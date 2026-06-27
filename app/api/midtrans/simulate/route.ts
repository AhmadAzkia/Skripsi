import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ensureCertificateForCourse } from "@/lib/certificate-generator";

export const runtime = "nodejs";

/**
 * SIMULATE ONLY — Sandbox test endpoint
 * Simulates a successful Midtrans payment notification.
 * Only works when MIDTRANS_IS_PRODUCTION !== "true"
 */
export async function POST(request: NextRequest) {
  if (process.env.MIDTRANS_IS_PRODUCTION === "true") {
    return NextResponse.json({ error: "Endpoint ini hanya untuk sandbox." }, { status: 403 });
  }

  try {
    const { paymentId } = (await request.json()) as { paymentId: string };

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId wajib dikirim." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient() || (await createSupabaseServerClient());

    // Find the payment
    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .select("id, pelatihan_id, pengguna_id, tipe_pembayaran, status_pembayaran")
      .eq("id", paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: `Pembayaran tidak ditemukan: ${paymentError?.message || paymentId}` }, { status: 404 });
    }

    if (payment.status_pembayaran === "berhasil") {
      return NextResponse.json({ success: true, message: "Pembayaran sudah dalam status berhasil.", alreadySuccess: true });
    }

    // Update payment status to berhasil
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("pembayaran")
      .update({
        status_pembayaran: "berhasil",
        metode_pembayaran: "bank_transfer",
        dibayar_pada: now,
        diperbarui_pada: now,
      })
      .eq("id", paymentId);

    if (updateError) {
      return NextResponse.json({ error: `Gagal update status: ${updateError.message}` }, { status: 500 });
    }

    // Generate certificate based on payment type
    let certificateGenerated = false;

    if (payment.tipe_pembayaran === "pendaftaran_pelatihan") {
      try {
        await ensureCertificateForCourse(payment.pengguna_id, payment.pelatihan_id, supabase);
        certificateGenerated = true;
      } catch (certError: any) {
        console.error("Simulate: Gagal generate sertifikat:", certError.message);
      }
    }

    if (payment.tipe_pembayaran === "klaim_sertifikat") {
      try {
        await ensureCertificateForCourse(payment.pengguna_id, payment.pelatihan_id, supabase);
        certificateGenerated = true;
      } catch (certError: any) {
        console.error("Simulate: Gagal generate sertifikat klaim:", certError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Status pembayaran ${paymentId} berhasil diubah ke "berhasil".`,
      certificateGenerated,
    });
  } catch (error: any) {
    console.error("Simulate payment error:", error);
    return NextResponse.json({ error: error.message || "Gagal mensimulasikan pembayaran." }, { status: 500 });
  }
}
