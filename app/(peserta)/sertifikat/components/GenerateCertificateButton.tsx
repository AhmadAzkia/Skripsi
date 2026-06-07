"use client";

import { useState } from "react";

type GenerateCertificateButtonProps = {
  certificateId: string;
};

export default function GenerateCertificateButton({ certificateId }: GenerateCertificateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certificateId }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuat file sertifikat.");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full inline-flex items-center justify-center px-4 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy/90 transition-all duration-300 disabled:opacity-60"
      >
        {loading ? "Membuat File..." : "Buat File Sertifikat"}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
