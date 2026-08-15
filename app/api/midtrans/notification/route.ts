import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createMidtransSignature, mapMidtransStatus, type MidtransTransactionStatus } from "@/lib/midtrans";
import { CertificateEligibilityError, ensureCertificateForCourse } from "@/lib/certificate-generator";

export const runtime = "nodejs";

type MidtransNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: MidtransTransactionStatus;
  payment_type?: string;
};

export async function POST(request: NextRequest) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      return NextResponse.json({ error: "MIDTRANS_SERVER_KEY belum diisi." }, { status: 500 });
    }

    const payload = (await request.json()) as MidtransNotification;
    const expectedSignature = createMidtransSignature(payload.order_id, payload.status_code, payload.gross_amount, serverKey);

    if (payload.signature_key !== expectedSignature) {
      return NextResponse.json({ error: "Signature Midtrans tidak valid." }, { status: 401 });
    }

    const supabase = createSupabaseAdminClient() || (await createSupabaseServerClient());
    const mappedStatus = mapMidtransStatus(payload.transaction_status);
    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .update({
        status_pembayaran: mappedStatus.paymentStatus,
        metode_pembayaran: payload.payment_type || null,
        dibayar_pada: mappedStatus.paidAt,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id_pembayaran_eksternal", payload.order_id)
      .select("id, pelatihan_id, pengguna_id, tipe_pembayaran")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: `Pembayaran tidak ditemukan: ${paymentError?.message || payload.order_id}` }, { status: 404 });
    }

    if (mappedStatus.paymentStatus === "berhasil" && payment.tipe_pembayaran === "klaim_sertifikat") {
      try {
        await ensureCertificateForCourse(payment.pengguna_id, payment.pelatihan_id, supabase);
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json({ error: error.message || "Gagal memproses notifikasi Midtrans." }, { status: 500 });
  }
}
