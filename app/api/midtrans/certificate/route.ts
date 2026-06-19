import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSnapTransaction, getSiteUrl } from "@/lib/midtrans";
import { getCertificatePrice } from "@/lib/certificates";

export const runtime = "nodejs";

type CertificateCheckoutRequest = {
  kursusId: string;
};

function isCompleted(tanggalSelesai: string | null) {
  if (!tanggalSelesai) return false;
  const today = new Date().toISOString().split("T")[0];
  return today > tanggalSelesai;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CertificateCheckoutRequest;

    if (!body.kursusId) {
      return NextResponse.json({ error: "ID kursus wajib dikirim." }, { status: 400 });
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
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        status,
        kursus:kursus_id (
          id,
          judul,
          harga,
          tanggal_selesai
        )
      `
      )
      .eq("kursus_id", body.kursusId)
      .eq("pengguna_id", profile.id)
      .single();

    const kursus = Array.isArray(registration?.kursus) ? registration?.kursus[0] : registration?.kursus;

    if (registrationError || !registration || !kursus) {
      return NextResponse.json({ error: "Data pelatihan peserta tidak ditemukan." }, { status: 404 });
    }

    if (!isCompleted(kursus.tanggal_selesai) && registration.status !== "selesai") {
      return NextResponse.json({ error: "Sertifikat hanya dapat diklaim setelah pelatihan selesai." }, { status: 400 });
    }

    if (kursus.harga > 0) {
      return NextResponse.json({ error: "Sertifikat pelatihan berbayar sudah termasuk dalam pembayaran pelatihan." }, { status: 400 });
    }

    const { data: existingCertificate } = await supabase.from("sertifikat").select("id").eq("kursus_id", kursus.id).eq("peserta_id", profile.id).maybeSingle();

    if (existingCertificate) {
      return NextResponse.json({ error: "Sertifikat untuk pelatihan ini sudah tersedia." }, { status: 409 });
    }

    const certificatePrice = getCertificatePrice();
    const now = new Date().toISOString();

    const { data: oldPendingPayments } = await supabase
      .from("pembayaran")
      .select("id")
      .eq("kursus_id", kursus.id)
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
        kursus_id: kursus.id,
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
    const finishUrl = `${getSiteUrl()}/sertifikat?kursusId=${kursus.id}`;

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
          id: `CERT-${kursus.id}`,
          price: certificatePrice,
          quantity: 1,
          name: `Sertifikat ${kursus.judul}`.slice(0, 50),
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
      finishUrl,
    });
  } catch (error: any) {
    console.error("Midtrans certificate checkout error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan saat membuat checkout sertifikat." }, { status: 500 });
  }
}
