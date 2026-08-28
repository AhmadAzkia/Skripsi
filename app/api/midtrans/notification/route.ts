import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createMidtransSignature, type MidtransTransactionStatus } from "@/lib/midtrans";
import { applyMidtransPaymentStatus } from "@/lib/payment-status";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ success: true, message: "Midtrans notification endpoint aktif." });
}

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
    const result = await applyMidtransPaymentStatus({
      supabase,
      orderId: payload.order_id,
      transactionStatus: payload.transaction_status,
      paymentType: payload.payment_type,
    });

    console.log("Midtrans notification processed:", {
      orderId: payload.order_id,
      transactionStatus: payload.transaction_status,
      paymentStatus: result.paymentStatus,
    });

    return NextResponse.json({ success: true, status: result.paymentStatus });
  } catch (error: any) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json({ error: error.message || "Gagal memproses notifikasi Midtrans." }, { status: 500 });
  }
}
