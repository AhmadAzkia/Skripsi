import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createMidtransSignature, mapMidtransStatus, type MidtransTransactionStatus } from "@/lib/midtrans";
import { createCertificateNumber } from "@/lib/certificates";
import { generateAndUploadCertificate, ensureCertificateForCourse } from "@/lib/certificate-generator";

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
      .select("id, kursus_id, pengguna_id, tipe_pembayaran")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: `Pembayaran tidak ditemukan: ${paymentError?.message || payload.order_id}` }, { status: 404 });
    }

    if (mappedStatus.paymentStatus === "berhasil" && payment.tipe_pembayaran === "klaim_sertifikat") {
      const { data: existingCertificate } = await supabase.from("sertifikat").select("id, sertifikat_url").eq("kursus_id", payment.kursus_id).eq("peserta_id", payment.pengguna_id).maybeSingle();
      let certificateId = existingCertificate?.id || null;

      if (!certificateId) {
        const { data: certificate, error: certificateError } = await supabase
          .from("sertifikat")
          .insert({
            kursus_id: payment.kursus_id,
            peserta_id: payment.pengguna_id,
            nomor_sertifikat: createCertificateNumber(payment.kursus_id, payment.pengguna_id),
            status: "terbit",
            tanggal_terbit: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (certificateError || !certificate) {
          throw new Error(`Gagal membuat sertifikat: ${certificateError?.message || "data kosong"}`);
        }

        certificateId = certificate.id;
      }

      if (certificateId && !existingCertificate?.sertifikat_url) {
        await generateAndUploadCertificate(certificateId);
      }
    }

    // Auto-generate certificate for paid course registration
    if (mappedStatus.paymentStatus === "berhasil" && payment.tipe_pembayaran === "pendaftaran_kursus") {
      try {
        await ensureCertificateForCourse(payment.pengguna_id, payment.kursus_id, supabase);
      } catch (certError: any) {
        console.error("Gagal auto-generate sertifikat untuk pelatihan berbayar:", certError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json({ error: error.message || "Gagal memproses notifikasi Midtrans." }, { status: 500 });
  }
}
