import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSnapTransaction, getSiteUrl } from "@/lib/midtrans";
import { getCertificatePriceForCourse, isCourseCompleted } from "@/lib/certificates";

export const runtime = "nodejs";

type CertificateCheckoutRequest = {
  pelatihanId: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CertificateCheckoutRequest;

    if (!body.pelatihanId) {
      return NextResponse.json({ error: "ID pelatihan wajib dikirim." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Silakan login sebagai peserta terlebih dahulu." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, nama_lengkap, email, nomor_hp, peran").eq("user_id", user.id).single();

    if (profileError || !profile || profile.peran !== "peserta") {
      return NextResponse.json({ error: "Akun peserta tidak valid." }, { status: 403 });
    }

    const { data: registration, error: registrationError } = await supabase
      .from("pendaftaran_pelatihan")
      .select(
        `
        id,
        status,
        pelatihan:pelatihan_id (
          id,
          judul,
          harga,
          harga_sertifikat,
          tanggal_selesai
        )
      `
      )
      .eq("pelatihan_id", body.pelatihanId)
      .eq("pengguna_id", profile.id)
      .single();

    const pelatihan = Array.isArray(registration?.pelatihan) ? registration?.pelatihan[0] : registration?.pelatihan;

    if (registrationError || !registration || !pelatihan) {
      return NextResponse.json({ error: "Data pelatihan peserta tidak ditemukan." }, { status: 404 });
    }

    if (!isCourseCompleted(pelatihan.tanggal_selesai)) {
      return NextResponse.json({ error: "Sertifikat hanya dapat diklaim setelah pelatihan selesai." }, { status: 400 });
    }

    if (registration.status === "dibatalkan") {
      return NextResponse.json({ error: "Pendaftaran pelatihan sudah dibatalkan." }, { status: 403 });
    }

    if (pelatihan.harga > 0) {
      return NextResponse.json({ error: "Sertifikat pelatihan berbayar sudah termasuk dalam pembayaran pelatihan." }, { status: 400 });
    }

    const database = supabase as any;
    const { data: trainingResult, error: trainingResultError } = await database
      .from("hasil_pelatihan")
      .select("status_kelulusan")
      .eq("pendaftaran_id", registration.id)
      .maybeSingle();

    if (trainingResultError) {
      return NextResponse.json({ error: `Gagal memeriksa hasil pelatihan: ${trainingResultError.message}` }, { status: 500 });
    }

    if (!trainingResult) {
      return NextResponse.json({ error: "Hasil pelatihan belum dievaluasi." }, { status: 400 });
    }

    if (trainingResult.status_kelulusan !== "lulus") {
      return NextResponse.json({ error: "Sertifikat hanya dapat dibeli oleh peserta yang dinyatakan lulus." }, { status: 403 });
    }

    const { data: existingCertificate } = await database.from("sertifikat").select("id, status").eq("pelatihan_id", pelatihan.id).eq("peserta_id", profile.id).maybeSingle();

    if (existingCertificate?.status === "terbit") {
      return NextResponse.json({ error: "Sertifikat untuk pelatihan ini sudah tersedia." }, { status: 409 });
    }

    const certificatePrice = getCertificatePriceForCourse(pelatihan.harga_sertifikat);
    const now = new Date().toISOString();

    const { data: oldPendingPayments } = await supabase
      .from("pembayaran")
      .select("id")
      .eq("pelatihan_id", pelatihan.id)
      .eq("pengguna_id", profile.id)
      .eq("tipe_pembayaran", "klaim_sertifikat")
      .eq("status_pembayaran", "menunggu");

    const oldPendingPaymentIds = oldPendingPayments?.map((payment) => payment.id) || [];

    if (oldPendingPaymentIds.length > 0) {
      await supabase
        .from("pembayaran")
        .update({
          status_pembayaran: "gagal",
          diperbarui_pada: now,
        })
        .in("id", oldPendingPaymentIds);

    }

    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .insert({
        pengguna_id: profile.id,
        pelatihan_id: pelatihan.id,
        jumlah: certificatePrice,
        status_pembayaran: "menunggu",
        tipe_pembayaran: "klaim_sertifikat",
      })
      .select("id")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: `Gagal membuat data pembayaran sertifikat: ${paymentError?.message || "data kosong"}` }, { status: 500 });
    }

    const orderId = `CG-CERT-${payment.id}`;
    const finishPath = `/sertifikat?pelatihanId=${pelatihan.id}`;
    const finishUrl = `${getSiteUrl(request)}${finishPath}`;

    const { error: updatePaymentError } = await supabase
      .from("pembayaran")
      .update({
        id_pembayaran_eksternal: orderId,
        diperbarui_pada: now,
      })
      .eq("id", payment.id);

    if (updatePaymentError) {
      return NextResponse.json({ error: `Gagal menyimpan order ID sertifikat: ${updatePaymentError.message}` }, { status: 500 });
    }

    const snap = await createSnapTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: certificatePrice,
      },
      item_details: [
        {
          id: `CERT-${pelatihan.id}`,
          price: certificatePrice,
          quantity: 1,
          name: `Sertifikat ${pelatihan.judul}`.slice(0, 50),
        },
      ],
      customer_details: {
        first_name: profile.nama_lengkap,
        email: profile.email,
        phone: profile.nomor_hp || undefined,
      },
      callbacks: {
        finish: finishUrl,
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId,
      token: snap.token,
      redirectUrl: snap.redirect_url,
      finishPath,
      finishUrl,
    });
  } catch (error: any) {
    console.error("Midtrans certificate checkout error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan saat membuat checkout sertifikat." }, { status: 500 });
  }
}
