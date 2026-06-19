import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSnapTransaction, getSiteUrl } from "@/lib/midtrans";

export const runtime = "nodejs";

type ReopenRequest = {
  paymentId: string;
};

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = (await request.json()) as ReopenRequest;

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId wajib dikirim." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profil_pengguna")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profil tidak ditemukan." }, { status: 404 });
    }

    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .select("id, jumlah, status_pembayaran, id_pembayaran_eksternal, kursus:kursus_id ( id, judul )")
      .eq("id", paymentId)
      .eq("pengguna_id", profile.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Pembayaran tidak ditemukan." }, { status: 404 });
    }

    if (payment.status_pembayaran !== "menunggu") {
      return NextResponse.json({ error: "Pembayaran sudah diproses." }, { status: 400 });
    }

    const kursus = Array.isArray(payment.kursus) ? payment.kursus[0] : payment.kursus;

    // Generate new order_id (Midtrans max 50 chars, no reusing same order_id)
    const newOrderId = `CG-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const finishUrl = `${getSiteUrl()}/pembayaran/${payment.id}`;

    // Update payment with new order_id
    await supabase
      .from("pembayaran")
      .update({
        id_pembayaran_eksternal: newOrderId,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id", payment.id);

    const snap = await createSnapTransaction({
      transaction_details: {
        order_id: newOrderId,
        gross_amount: payment.jumlah,
      },
      item_details: [
        {
          id: kursus?.id || "unknown",
          price: payment.jumlah,
          quantity: 1,
          name: (kursus?.judul || "Pelatihan").slice(0, 50),
        },
      ],
      callbacks: {
        finish: finishUrl,
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId: newOrderId,
      token: snap.token,
      redirectUrl: snap.redirect_url,
      finishUrl,
    });
  } catch (error: any) {
    console.error("Midtrans reopen error:", error);
    return NextResponse.json({ error: error.message || "Gagal membuka checkout." }, { status: 500 });
  }
}
