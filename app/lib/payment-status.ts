import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/../types/database";
import { CertificateEligibilityError, ensureCertificateForCourse } from "@/lib/certificate-generator";
import { mapMidtransStatus, type MidtransTransactionStatus } from "@/lib/midtrans";

type Supabase = SupabaseClient<Database>;

type ApplyPaymentStatusParams = {
  supabase: Supabase;
  orderId: string;
  transactionStatus: MidtransTransactionStatus;
  paymentType?: string | null;
};

function getPaymentIdFromOrderId(orderId: string) {
  const match = orderId.match(/^CG-(?:CERT-)?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:-.+)?$/i);
  return match?.[1] || null;
}

export async function applyMidtransPaymentStatus({ supabase, orderId, transactionStatus, paymentType }: ApplyPaymentStatusParams) {
  const mappedStatus = mapMidtransStatus(transactionStatus);
  let { data: currentPayment, error: currentPaymentError } = await supabase
    .from("pembayaran")
    .select("id, pelatihan_id, pengguna_id, tipe_pembayaran, status_pembayaran")
    .eq("id_pembayaran_eksternal", orderId)
    .maybeSingle();

  if (!currentPayment) {
    const paymentId = getPaymentIdFromOrderId(orderId);

    if (paymentId) {
      const result = await supabase
        .from("pembayaran")
        .select("id, pelatihan_id, pengguna_id, tipe_pembayaran, status_pembayaran")
        .eq("id", paymentId)
        .maybeSingle();

      currentPayment = result.data;
      currentPaymentError = result.error;
    }
  }

  if (currentPaymentError || !currentPayment) {
    throw new Error(`Pembayaran tidak ditemukan: ${currentPaymentError?.message || orderId}`);
  }

  if (currentPayment.status_pembayaran === "berhasil" && mappedStatus.paymentStatus !== "berhasil") {
    return {
      payment: currentPayment,
      paymentStatus: currentPayment.status_pembayaran,
      transactionStatus: "berhasil" as const,
      paidAt: null,
      certificateGenerated: false,
    };
  }

  const { data: payment, error: paymentError } = await supabase
    .from("pembayaran")
    .update({
      id_pembayaran_eksternal: orderId,
      status_pembayaran: mappedStatus.paymentStatus,
      metode_pembayaran: paymentType || null,
      dibayar_pada: mappedStatus.paidAt,
      diperbarui_pada: new Date().toISOString(),
    })
    .eq("id", currentPayment.id)
    .select("id, pelatihan_id, pengguna_id, tipe_pembayaran, status_pembayaran")
    .single();

  if (paymentError || !payment) {
    throw new Error(`Gagal update pembayaran: ${paymentError?.message || orderId}`);
  }

  let certificateGenerated = false;

  if (mappedStatus.paymentStatus === "berhasil" && payment.tipe_pembayaran === "klaim_sertifikat") {
    try {
      await ensureCertificateForCourse(payment.pengguna_id, payment.pelatihan_id, supabase);
      certificateGenerated = true;
    } catch (error) {
      if (!(error instanceof CertificateEligibilityError)) throw error;
      console.warn("Sertifikat klaim belum memenuhi syarat:", error.message);
    }
  }

  if (mappedStatus.paymentStatus === "berhasil" && payment.tipe_pembayaran === "pendaftaran_pelatihan") {
    await supabase
      .from("pendaftaran_pelatihan")
      .update({ status: "terdaftar" })
      .eq("pelatihan_id", payment.pelatihan_id)
      .eq("pengguna_id", payment.pengguna_id)
      .eq("status", "menunggu_pembayaran");
  }

  return {
    payment,
    paymentStatus: mappedStatus.paymentStatus,
    transactionStatus: mappedStatus.transactionStatus,
    paidAt: mappedStatus.paidAt,
    certificateGenerated,
  };
}
