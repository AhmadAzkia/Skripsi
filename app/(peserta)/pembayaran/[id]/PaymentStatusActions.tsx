"use client";

import { useState } from "react";
import Script from "next/script";

type PaymentStatusActionsProps = {
  kursusId: string;
  status: "menunggu" | "berhasil" | "gagal" | "dikembalikan";
};

export default function PaymentStatusActions({ kursusId, status }: PaymentStatusActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const snapScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

  const handlePayAgain = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/midtrans/snap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kursusId }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuka checkout Midtrans.");
      }

      const finishUrl = result.finishUrl || `/pembayaran/${result.paymentId}`;

      if ((window as any).snap && result.token) {
        (window as any).snap.pay(result.token, {
          onSuccess: () => {
            window.location.href = finishUrl;
          },
          onPending: () => {
            window.location.href = finishUrl;
          },
          onError: () => {
            window.location.href = finishUrl;
          },
          onClose: () => {
            window.location.href = finishUrl;
          },
        });
      } else if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        throw new Error("Token checkout Midtrans tidak tersedia.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {midtransClientKey && <Script src={snapScriptUrl} data-client-key={midtransClientKey} strategy="afterInteractive" />}

      {status !== "berhasil" && (
        <button
          type="button"
          onClick={handlePayAgain}
          disabled={loading}
          className="w-full px-6 py-3 bg-linear-to-r from-navy to-blue-700 text-white rounded-lg font-semibold hover:from-gold hover:to-gold/90 transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Membuka Checkout..." : "Buka Checkout Midtrans"}
        </button>
      )}

      <a href="/riwayat-peserta" className="block w-full px-6 py-3 border border-navy/20 text-navy rounded-lg font-semibold text-center hover:bg-navy/5 transition-colors">
        Lihat Riwayat Transaksi
      </a>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
