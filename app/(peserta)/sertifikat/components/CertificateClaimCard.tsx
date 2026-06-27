"use client";

import Script from "next/script";
import { useState } from "react";

type CertificateClaimCardProps = {
  pelatihanId: string;
  courseTitle: string;
  certificatePrice: number;
  paymentStatus: "menunggu" | "berhasil" | "gagal" | "dikembalikan" | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function CertificateClaimCard({ pelatihanId, courseTitle, certificatePrice, paymentStatus }: CertificateClaimCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const snapScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

  const handleCertificateCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/midtrans/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pelatihanId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuat checkout sertifikat.");
      }

      const finishUrl = result.finishUrl || `/sertifikat?pelatihanId=${pelatihanId}`;

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
        throw new Error("Token checkout sertifikat tidak tersedia.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 bg-white">
      {midtransClientKey && <Script src={snapScriptUrl} data-client-key={midtransClientKey} strategy="afterInteractive" />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gold/30 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-navy to-blue-900 p-6 text-white">
            <p className="text-gold text-sm font-semibold mb-2">Penawaran Sertifikat</p>
            <h2 className="text-2xl font-bold">{courseTitle}</h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-navy mb-3">Pelatihan gratis telah selesai</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sertifikat untuk pelatihan gratis bersifat opsional. Anda dapat membeli sertifikat digital sebagai bukti penyelesaian pelatihan.
                </p>
                {paymentStatus === "menunggu" && <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">Pembayaran sertifikat sebelumnya masih menunggu penyelesaian.</p>}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-center">
                <p className="text-sm text-gray-600 mb-1">Biaya Sertifikat</p>
                <p className="text-2xl font-bold text-navy mb-4">{formatCurrency(certificatePrice)}</p>
                <button
                  type="button"
                  onClick={handleCertificateCheckout}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-60"
                >
                  {loading ? "Membuka Checkout..." : paymentStatus === "menunggu" ? "Lanjutkan Pembayaran" : "Beli Sertifikat"}
                </button>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
