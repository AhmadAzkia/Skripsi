"use client";

import { useState } from "react";
import Script from "next/script";

type PaymentStatusActionsProps = {
  paymentId: string;
  status: "menunggu" | "berhasil" | "gagal" | "dikembalikan";
};

export default function PaymentStatusActions({ paymentId, status }: PaymentStatusActionsProps) {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const snapScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

  const syncPaymentStatus = async () => {
    const response = await fetch("/api/midtrans/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Gagal sinkron status pembayaran.");
    }

    return result;
  };

  const handleSync = async () => {
    setSyncing(true);
    setError("");

    try {
      const result = await syncPaymentStatus();

      if (result.status === "berhasil") {
        window.location.reload();
        return;
      }

      setError("Pembayaran masih menunggu konfirmasi Midtrans.");
    } catch (err: any) {
      setError(err.message || "Gagal sinkron status pembayaran.");
    } finally {
      setSyncing(false);
    }
  };

  const reloadAfterSync = async () => {
    try {
      await syncPaymentStatus();
    } catch (err) {
      console.error("Gagal sinkron status pembayaran:", err);
    } finally {
      window.location.reload();
    }
  };

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/midtrans/reopen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuka checkout.");
      }

      if (result.alreadyPaid) {
        window.location.reload();
        return;
      }

      if ((window as any).snap && result.token) {
        (window as any).snap.pay(result.token, {
          onSuccess: reloadAfterSync,
          onPending: reloadAfterSync,
          onError: () => {
            setError("Pembayaran gagal. Silakan coba lagi.");
            setLoading(false);
          },
          onClose: () => {
            // Stay on same page, just reset loading
            setLoading(false);
          },
        });
      } else if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        throw new Error("Token checkout tidak tersedia.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {midtransClientKey && <Script src={snapScriptUrl} data-client-key={midtransClientKey} strategy="afterInteractive" />}

      {/* Menunggu: Bayar */}
      {status === "menunggu" && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handlePay}
            disabled={loading || syncing}
            className="w-full px-6 py-3 bg-linear-to-r from-navy to-blue-700 text-white rounded-lg font-semibold hover:from-gold hover:to-gold/90 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Membuka Checkout..." : "Bayar Sekarang"}
          </button>
          <button
            type="button"
            onClick={handleSync}
            disabled={loading || syncing}
            className="w-full px-6 py-3 border border-navy/20 text-navy rounded-lg font-semibold text-center hover:bg-navy/5 transition-colors disabled:opacity-60"
          >
            {syncing ? "Mengecek Status..." : "Refresh Status Pembayaran"}
          </button>
        </div>
      )}

      {/* Gagal: Retry */}
      {status === "gagal" && (
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="w-full px-6 py-3 bg-linear-to-r from-navy to-blue-700 text-white rounded-lg font-semibold hover:from-gold hover:to-gold/90 transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Membuka Checkout..." : "Coba Bayar Lagi"}
        </button>
      )}

      <a href="/riwayat-peserta" className="block w-full px-6 py-3 border border-navy/20 text-navy rounded-lg font-semibold text-center hover:bg-navy/5 transition-colors">
        Lihat Riwayat Saya
      </a>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
