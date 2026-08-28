import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getMidtransTransactionStatus } from "@/lib/midtrans";
import { applyMidtransPaymentStatus } from "@/lib/payment-status";

export const runtime = "nodejs";

type StatusRequest = {
  paymentId: string;
};

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = (await request.json()) as StatusRequest;

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

    const { data: profile, error: profileError } = await sessionClient.from("profil_pengguna").select("id, peran").eq("user_id", user.id).single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profil pengguna tidak ditemukan." }, { status: 404 });
    }

    const supabase = createSupabaseAdminClient() || sessionClient;
    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .select("id, pengguna_id, id_pembayaran_eksternal, status_pembayaran")
      .eq("id", paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Pembayaran tidak ditemukan." }, { status: 404 });
    }

    if (profile.peran !== "admin" && payment.pengguna_id !== profile.id) {
      return NextResponse.json({ error: "Anda tidak dapat memeriksa pembayaran milik pengguna lain." }, { status: 403 });
    }

    if (!payment.id_pembayaran_eksternal) {
      return NextResponse.json({ error: "Order ID Midtrans belum tersedia." }, { status: 400 });
    }

    const midtransStatus = await getMidtransTransactionStatus(payment.id_pembayaran_eksternal);
    const result = await applyMidtransPaymentStatus({
      supabase,
      orderId: midtransStatus.order_id || payment.id_pembayaran_eksternal,
      transactionStatus: midtransStatus.transaction_status,
      paymentType: midtransStatus.payment_type,
    });

    console.log("Midtrans status synced:", {
      orderId: midtransStatus.order_id,
      transactionStatus: midtransStatus.transaction_status,
      paymentStatus: result.paymentStatus,
    });

    return NextResponse.json({
      success: true,
      status: result.paymentStatus,
      transactionStatus: midtransStatus.transaction_status,
      paymentType: midtransStatus.payment_type || null,
    });
  } catch (error: any) {
    console.error("Midtrans status sync error:", error);
    return NextResponse.json({ error: error.message || "Gagal sinkron status pembayaran." }, { status: 500 });
  }
}
