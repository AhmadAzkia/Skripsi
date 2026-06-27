import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSnapTransaction, getSiteUrl } from "@/lib/midtrans";

export const runtime = "nodejs";

type CheckoutRequest = {
  pelatihanId: string;
  nama_lengkap?: string;
  email?: string;
  nomor_hp?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;

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

    const { data: pelatihan, error: pelatihanError } = await supabase.from("pelatihan").select("id, judul, harga, status, maksimal_peserta").eq("id", body.pelatihanId).eq("status", "published").single();

    if (pelatihanError || !pelatihan) {
      return NextResponse.json({ error: "Pelatihan tidak ditemukan atau belum dipublikasikan." }, { status: 404 });
    }

    const { data: pelatihanJadwal, error: jadwalError } = await supabase.from("pelatihan").select("tanggal_mulai").eq("id", pelatihan.id).single();

    if (jadwalError) {
      return NextResponse.json({ error: `Gagal memeriksa jadwal pelatihan: ${jadwalError.message}` }, { status: 500 });
    }

    if (pelatihanJadwal?.tanggal_mulai) {
      const startDate = new Date(pelatihanJadwal.tanggal_mulai);
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

    const { data: existingRegistration, error: registrationCheckError } = await supabase.from("pendaftaran_pelatihan").select("id").eq("pelatihan_id", pelatihan.id).eq("pengguna_id", profile.id).maybeSingle();

    if (registrationCheckError) {
      return NextResponse.json({ error: `Gagal memeriksa pendaftaran: ${registrationCheckError.message}` }, { status: 500 });
    }

    if (existingRegistration) {
      // Check if there's an existing pending payment - reuse it
      const { data: existingPayment } = await supabase
        .from("pembayaran")
        .select("id, id_pembayaran_eksternal, status_pembayaran, jumlah")
        .eq("pelatihan_id", pelatihan.id)
        .eq("pengguna_id", profile.id)
        .eq("tipe_pembayaran", "pendaftaran_pelatihan")
        .eq("status_pembayaran", "menunggu")
        .maybeSingle();

      if (existingPayment && existingPayment.id_pembayaran_eksternal) {
        // Generate new order_id (Midtrans max 50 chars, no reusing same order_id)
        const newOrderId = `CG-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const finishUrl = `${getSiteUrl()}/pembayaran/${existingPayment.id}`;

        // Update payment with new order_id
        await supabase
          .from("pembayaran")
          .update({
            id_pembayaran_eksternal: newOrderId,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq("id", existingPayment.id);

        const snap = await createSnapTransaction({
          transaction_details: {
            order_id: newOrderId,
            gross_amount: existingPayment.jumlah,
          },
          item_details: [
            {
              id: pelatihan.id,
              price: existingPayment.jumlah,
              quantity: 1,
              name: pelatihan.judul.slice(0, 50),
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
          isFree: false,
          paymentId: existingPayment.id,
          orderId: newOrderId,
          token: snap.token,
          redirectUrl: snap.redirect_url,
          finishUrl,
        });
      }

      // Check if payment already completed
      const { data: completedPayment } = await supabase
        .from("pembayaran")
        .select("id, status_pembayaran")
        .eq("pelatihan_id", pelatihan.id)
        .eq("pengguna_id", profile.id)
        .eq("tipe_pembayaran", "pendaftaran_pelatihan")
        .eq("status_pembayaran", "berhasil")
        .maybeSingle();

      if (completedPayment) {
        return NextResponse.json({ error: "Pembayaran untuk pelatihan ini sudah berhasil." }, { status: 409 });
      }

      return NextResponse.json({ error: "Anda sudah terdaftar di pelatihan ini." }, { status: 409 });
    }

    if (pelatihan.maksimal_peserta) {
      const { count, error: countError } = await supabase.from("pendaftaran_pelatihan").select("*", { count: "exact", head: true }).eq("pelatihan_id", pelatihan.id).in("status", ["terdaftar", "sedang_belajar", "selesai"]);

      if (countError) {
        return NextResponse.json({ error: `Gagal memeriksa kuota pelatihan: ${countError.message}` }, { status: 500 });
      }

      if ((count || 0) >= pelatihan.maksimal_peserta) {
        return NextResponse.json({ error: "Pendaftaran ditolak karena kuota pelatihan sudah penuh." }, { status: 400 });
      }
    }

    const { error: registrationError } = await supabase.from("pendaftaran_pelatihan").insert({
      pelatihan_id: pelatihan.id,
      pengguna_id: profile.id,
      status: "terdaftar",
      tanggal_daftar: new Date().toISOString(),
    });

    if (registrationError) {
      return NextResponse.json({ error: `Gagal membuat pendaftaran: ${registrationError.message}` }, { status: 500 });
    }

    if (pelatihan.harga <= 0) {
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
        pelatihan_id: pelatihan.id,
        jumlah: pelatihan.harga,
        status_pembayaran: "menunggu",
        tipe_pembayaran: "pendaftaran_pelatihan",
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

    const snap = await createSnapTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: pelatihan.harga,
      },
      item_details: [
        {
          id: pelatihan.id,
          price: pelatihan.harga,
          quantity: 1,
          name: pelatihan.judul.slice(0, 50),
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
