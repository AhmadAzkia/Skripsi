"use client";

import { useState } from "react";
import Script from "next/script";

type PaymentStatusActionsProps = {
  kursusId: string;
  paymentId: string;
  status: "menunggu" | "berhasil" | "gagal" | "dikembalikan";
};

export default function PaymentStatusActions({ kursusId, paymentId, status }: PaymentStatusActionsProps) {
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");
  const [simMessage, setSimMessage] = useState("");
  const isSandbox = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION !== "true";
  const snapScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

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

      if ((window as any).snap && result.token) {
        (window as any).snap.pay(result.token, {
          onSuccess: () => window.location.reload(),
          onPending: () => window.location.reload(),
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

  const handleSimulate = async () => {
    setSimulating(true);
    setError("");
    setSimMessage("");

    try {
      const response = await fetch("/api/midtrans/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mensimulasikan pembayaran.");
      }

      setSimMessage(result.alreadySuccess ? "Pembayaran sudah berhasil sebelumnya." : "Pembayaran berhasil! Memuat ulang...");
      if (!result.alreadySuccess) {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-4">
      {midtransClientKey && <Script src={snapScriptUrl} data-client-key={midtransClientKey} strategy="afterInteractive" />}

      {/* Menunggu: Bayar + Simulate */}
      {status === "menunggu" && (
        <>
          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="w-full px-6 py-3 bg-linear-to-r from-navy to-blue-700 text-white rounded-lg font-semibold hover:from-gold hover:to-gold/90 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Membuka Checkout..." : "Bayar Sekarang"}
          </button>

          {isSandbox && (
            <button
              type="button"
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-60"
            >
              {simulating ? "Memproses..." : "Simulate Pembayaran Berhasil"}
            </button>
          )}
        </>
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
        Lihat Riwayat Transaksi
      </a>

      {simMessage && <p className="text-sm text-green-600 text-center">{simMessage}</p>}
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}
