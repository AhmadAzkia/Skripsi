import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSnapTransaction, getMidtransTransactionStatus, getSiteUrl } from "@/lib/midtrans";
import { applyMidtransPaymentStatus } from "@/lib/payment-status";

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

    const sessionClient = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await sessionClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { data: profile } = await sessionClient
      .from("profil_pengguna")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profil tidak ditemukan." }, { status: 404 });
    }

    const supabase = createSupabaseAdminClient() || sessionClient;
    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .select("id, jumlah, status_pembayaran, id_pembayaran_eksternal, pelatihan:pelatihan_id ( id, judul )")
      .eq("id", paymentId)
      .eq("pengguna_id", profile.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Pembayaran tidak ditemukan." }, { status: 404 });
    }

    if (payment.status_pembayaran !== "menunggu") {
      return NextResponse.json({ error: "Pembayaran sudah diproses." }, { status: 400 });
    }

    if (payment.id_pembayaran_eksternal) {
      try {
        const midtransStatus = await getMidtransTransactionStatus(payment.id_pembayaran_eksternal);
        const syncedPayment = await applyMidtransPaymentStatus({
          supabase,
          orderId: midtransStatus.order_id,
          transactionStatus: midtransStatus.transaction_status,
          paymentType: midtransStatus.payment_type,
        });

        if (syncedPayment.paymentStatus === "berhasil") {
          return NextResponse.json({
            success: true,
            alreadyPaid: true,
            paymentId: payment.id,
            status: syncedPayment.paymentStatus,
          });
        }
      } catch (error) {
        console.warn("Gagal cek status Midtrans sebelum reopen:", error);
      }
    }

    const pelatihan = Array.isArray(payment.pelatihan) ? payment.pelatihan[0] : payment.pelatihan;

    // Generate new order_id (Midtrans max 50 chars, no reusing same order_id)
    const newOrderId = `CG-${payment.id}-${Date.now().toString(36).slice(-6)}`;
    const finishPath = `/pembayaran/${payment.id}`;
    const finishUrl = `${getSiteUrl(request)}${finishPath}`;

    // Update payment with new order_id
    await supabase
      .from("pembayaran")
      .update({
        id_pembayaran_eksternal: newOrderId,
        status_pembayaran: "menunggu",
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
          id: pelatihan?.id || "unknown",
          price: payment.jumlah,
          quantity: 1,
          name: (pelatihan?.judul || "Pelatihan").slice(0, 50),
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
      finishPath,
      finishUrl,
    });
  } catch (error: any) {
    console.error("Midtrans reopen error:", error);
    return NextResponse.json({ error: error.message || "Gagal membuka checkout." }, { status: 500 });
  }
}
