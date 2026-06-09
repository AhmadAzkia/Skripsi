import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSnapTransaction, getSiteUrl } from "@/lib/midtrans";

export const runtime = "nodejs";

type CheckoutRequest = {
  kursusId: string;
  nama_lengkap?: string;
  email?: string;
  nomor_hp?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;

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

    const { data: kursus, error: kursusError } = await supabase.from("kursus").select("id, judul, harga, status, maksimal_peserta").eq("id", body.kursusId).eq("status", "published").single();

    if (kursusError || !kursus) {
      return NextResponse.json({ error: "Pelatihan tidak ditemukan atau belum dipublikasikan." }, { status: 404 });
    }

    const { data: kursusJadwal, error: jadwalError } = await supabase.from("kursus").select("tanggal_mulai").eq("id", kursus.id).single();

    if (jadwalError) {
      return NextResponse.json({ error: `Gagal memeriksa jadwal pelatihan: ${jadwalError.message}` }, { status: 500 });
    }

    if (kursusJadwal?.tanggal_mulai) {
      const startDate = new Date(kursusJadwal.tanggal_mulai);
      const today = new Date();
      startDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (startDate <= today) {
        return NextResponse.json({ error: "Pendaftaran ditutup karena pelatihan sudah dimulai." }, { status: 400 });
      }
    }

    const phone = body.nomor_hp?.trim() || profile.nomor_hp || "";

    if (phone && phone !== profile.nomor_hp) {
      await supabase.from("profil_pengguna").update({ nomor_hp: phone, diperbarui_pada: new Date().toISOString() }).eq("id", profile.id);
    }

    const { data: existingRegistration, error: registrationCheckError } = await supabase.from("pendaftaran_kursus").select("id").eq("kursus_id", kursus.id).eq("pengguna_id", profile.id).maybeSingle();

    if (registrationCheckError) {
      return NextResponse.json({ error: `Gagal memeriksa pendaftaran: ${registrationCheckError.message}` }, { status: 500 });
    }

    if (existingRegistration) {
      return NextResponse.json({ error: "Anda sudah terdaftar di pelatihan ini." }, { status: 409 });
    }

    if (kursus.maksimal_peserta) {
      const { count, error: countError } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("kursus_id", kursus.id).in("status", ["terdaftar", "sedang_belajar", "selesai"]);

      if (countError) {
        return NextResponse.json({ error: `Gagal memeriksa kuota pelatihan: ${countError.message}` }, { status: 500 });
      }

      if ((count || 0) >= kursus.maksimal_peserta) {
        return NextResponse.json({ error: "Pendaftaran ditolak karena kuota pelatihan sudah penuh." }, { status: 400 });
      }
    }

    const { error: registrationError } = await supabase.from("pendaftaran_kursus").insert({
      kursus_id: kursus.id,
      pengguna_id: profile.id,
      status: "terdaftar",
      tanggal_daftar: new Date().toISOString(),
    });

    if (registrationError) {
      return NextResponse.json({ error: `Gagal membuat pendaftaran: ${registrationError.message}` }, { status: 500 });
    }

    if (kursus.harga <= 0) {
      return NextResponse.json({
        success: true,
        isFree: true,
        message: "Pendaftaran pelatihan gratis berhasil.",
      });
    }

    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .insert({
        pengguna_id: profile.id,
        kursus_id: kursus.id,
        jumlah: kursus.harga,
        status_pembayaran: "menunggu",
        tipe_pembayaran: "pendaftaran_kursus",
      })
      .select("id, jumlah")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: `Gagal membuat data pembayaran: ${paymentError?.message || "data kosong"}` }, { status: 500 });
    }

    const orderId = `CG-${payment.id}`;
    const finishUrl = `${getSiteUrl()}/pembayaran/${payment.id}`;

    const { error: paymentUpdateError } = await supabase
      .from("pembayaran")
      .update({
        id_pembayaran_eksternal: orderId,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (paymentUpdateError) {
      return NextResponse.json({ error: `Gagal menyimpan order ID: ${paymentUpdateError.message}` }, { status: 500 });
    }

    await supabase.from("transaksi").insert({
      pengguna_id: profile.id,
      kursus_id: kursus.id,
      pembayaran_id: payment.id,
      jumlah: kursus.harga,
      status_transaksi: "menunggu",
      tipe_transaksi: "pendaftaran_kursus",
      deskripsi: `Pendaftaran pelatihan ${kursus.judul}`,
    });

    const snap = await createSnapTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: kursus.harga,
      },
      item_details: [
        {
          id: kursus.id,
          price: kursus.harga,
          quantity: 1,
          name: kursus.judul.slice(0, 50),
        },
      ],
      customer_details: {
        first_name: body.nama_lengkap?.trim() || profile.nama_lengkap,
        email: body.email?.trim() || profile.email,
        phone,
      },
      callbacks: {
        finish: finishUrl,
      },
    });

    return NextResponse.json({
      success: true,
      isFree: false,
      paymentId: payment.id,
      orderId,
      token: snap.token,
      redirectUrl: snap.redirect_url,
      finishUrl,
    });
  } catch (error: any) {
    console.error("Midtrans Snap error:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan saat membuat checkout Midtrans." }, { status: 500 });
  }
}
