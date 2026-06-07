import crypto from "crypto";

export type MidtransTransactionStatus =
  | "capture"
  | "settlement"
  | "pending"
  | "deny"
  | "cancel"
  | "expire"
  | "failure"
  | "refund"
  | "partial_refund"
  | "authorize";

type SnapTransactionPayload = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  item_details?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  customer_details?: {
    first_name?: string;
    email?: string;
    phone?: string;
  };
  callbacks?: {
    finish?: string;
  };
};

export function isMidtransProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

export function getSnapApiUrl() {
  return isMidtransProduction() ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

export function getSnapScriptUrl() {
  return isMidtransProduction() ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function mapMidtransStatus(status: MidtransTransactionStatus) {
  if (status === "capture" || status === "settlement") {
    return {
      paymentStatus: "berhasil" as const,
      transactionStatus: "berhasil" as const,
      paidAt: new Date().toISOString(),
    };
  }

  if (status === "pending" || status === "authorize") {
    return {
      paymentStatus: "menunggu" as const,
      transactionStatus: "menunggu" as const,
      paidAt: null,
    };
  }

  return {
    paymentStatus: "gagal" as const,
    transactionStatus: "gagal" as const,
    paidAt: null,
  };
}

export function createMidtransSignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string) {
  return crypto.createHash("sha512").update(`${orderId}${statusCode}${grossAmount}${serverKey}`).digest("hex");
}

export async function createSnapTransaction(payload: SnapTransactionPayload) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY belum diisi di environment.");
  }

  const response = await fetch(getSnapApiUrl(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    const message = Array.isArray(result?.error_messages) ? result.error_messages.join(", ") : result?.status_message || "Gagal membuat transaksi Midtrans.";
    throw new Error(message);
  }

  return result as {
    token: string;
    redirect_url: string;
  };
}
