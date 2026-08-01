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

    const sessionClient = await createSupabaseServerClient();
    const { data: { user } } = await sessionClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });

    const { data: profile } = await sessionClient.from("profil_pengguna").select("id, peran").eq("user_id", user.id).single();
    if (!profile) return NextResponse.json({ error: "Profil pengguna tidak ditemukan." }, { status: 404 });

    const supabase = createSupabaseAdminClient() || sessionClient;

    // Find the payment
    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .select("id, pelatihan_id, pengguna_id, tipe_pembayaran, status_pembayaran")
      .eq("id", paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: `Pembayaran tidak ditemukan: ${paymentError?.message || paymentId}` }, { status: 404 });
    }

    if (profile.peran !== "admin" && payment.pengguna_id !== profile.id) {
      return NextResponse.json({ error: "Anda tidak dapat mensimulasikan pembayaran milik pengguna lain." }, { status: 403 });
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

    let certificateGenerated = false;

    if (payment.tipe_pembayaran === "pendaftaran_pelatihan") {
      await supabase
        .from("pendaftaran_pelatihan")
        .update({ status: "terdaftar" })
        .eq("pelatihan_id", payment.pelatihan_id)
        .eq("pengguna_id", payment.pengguna_id)
        .eq("status", "menunggu_pembayaran");
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
