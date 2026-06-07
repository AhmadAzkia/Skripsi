"use client";

import { useState } from "react";
import Script from "next/script";

type Kursus = {
  id: string;
  judul: string;
  harga: number;
  tipe_kursus: "online" | "offline" | "hybrid";
};

type Profile = {
  id: string;
  nama_lengkap: string;
  email: string;
  nomor_hp: string | null;
};

interface RegistrationModalProps {
  kursus: Kursus;
  profile: Profile;
  isOpen: boolean;
}

export default function RegistrationModal({ kursus, profile, isOpen }: RegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState({
    nama_lengkap: profile.nama_lengkap,
    email: profile.email,
    nomor_hp: profile.nomor_hp || "",
    motivasi: "",
    persetujuan: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    // Dispatch custom event untuk menutup modal
    window.dispatchEvent(new CustomEvent("closeRegistrationModal"));
  };

  const handleSuccess = () => {
    // Dispatch custom event untuk success callback
    window.dispatchEvent(new CustomEvent("registrationSuccess"));
  };

  if (!isOpen) return null;

  const snapScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

  const formatHarga = (harga: number) => {
    if (harga === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.nomor_hp.trim()) {
      newErrors.nomor_hp = "Nomor HP wajib diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.nomor_hp)) {
      newErrors.nomor_hp = "Format nomor HP tidak valid";
    }

    if (!formData.motivasi.trim()) {
      newErrors.motivasi = "Motivasi mengikuti pelatihan wajib diisi";
    } else if (formData.motivasi.length < 20) {
      newErrors.motivasi = "Motivasi minimal 20 karakter";
    }

    if (!formData.persetujuan) {
      newErrors.persetujuan = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      setSubmitMessage(kursus.harga > 0 ? "Membuat checkout Midtrans..." : "Memproses pendaftaran...");

      const response = await fetch("/api/midtrans/snap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kursusId: kursus.id,
          nama_lengkap: formData.nama_lengkap,
          email: formData.email,
          nomor_hp: formData.nomor_hp,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuat checkout Midtrans.");
      }

      handleSuccess();

      if (result.isFree) {
        window.location.href = "/jadwal-peserta";
        return;
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
    } catch (error: any) {
      console.error("Error during registration:", error);

      let errorMessage = "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";

      if (error.code === "23505") {
        errorMessage = "Anda sudah terdaftar di pelatihan ini.";
      } else if (error.code === "23503") {
        errorMessage = "Data pelatihan atau profil tidak valid.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
      setSubmitMessage("");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop:blur-sm transition-opacity duration-300 flex items-center justify-center p-4 z-50" onClick={handleBackdropClick}>
      {midtransClientKey && <Script src={snapScriptUrl} data-client-key={midtransClientKey} strategy="afterInteractive" />}
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto p-2" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#001233] text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Daftar Pelatihan</h2>
              <p className="text-blue-100 text-lg">{kursus.judul}</p>
            </div>
            <button onClick={handleClose} className="text-white hover:text-gray-300 transition-colors p-1 ml-4" disabled={isSubmitting}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {errors.submit}
              </div>
            )}

            {submitMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                {submitMessage}
              </div>
            )}

            {/* Info Pelatihan */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-[#001233] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-[#001233] text-xl">Detail Pelatihan</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600 font-medium">Tipe Pelatihan</span>
                    </div>
                    <span className="font-bold capitalize text-[#001233] bg-blue-100 px-3 py-1 rounded-full text-sm">{kursus.tipe_kursus}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-gray-600 font-medium">Biaya Pelatihan</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#001233] text-xl">{formatHarga(kursus.harga)}</span>
                      {kursus.harga === 0 && <div className="text-xs text-green-600 font-medium">100% Gratis</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Data Peserta */}
            <div className="space-y-6">
              <h3 className="font-semibold text-[#001233] text-lg border-b border-gray-200 pb-2">Data Peserta</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001233] focus:border-[#001233] bg-white text-gray-900 placeholder-gray-400 transition-colors"
                    placeholder="Masukkan nama lengkap"
                    disabled={isSubmitting}
                  />
                  {errors.nama_lengkap && <p className="text-red-500 text-sm mt-2">{errors.nama_lengkap}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001233] focus:border-[#001233] bg-white text-gray-900 placeholder-gray-400 transition-colors"
                    placeholder="Masukkan email"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Nomor HP *</label>
                <input
                  type="tel"
                  value={formData.nomor_hp}
                  onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001233] focus:border-[#001233] bg-white text-gray-900 placeholder-gray-400 transition-colors"
                  placeholder="Masukkan nomor HP"
                  disabled={isSubmitting}
                />
                {errors.nomor_hp && <p className="text-red-500 text-sm mt-2">{errors.nomor_hp}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Motivasi Mengikuti Pelatihan *</label>
                <textarea
                  value={formData.motivasi}
                  onChange={(e) => setFormData({ ...formData, motivasi: e.target.value })}
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001233] focus:border-[#001233] bg-white resize-none text-gray-900 placeholder-gray-400 transition-colors"
                  placeholder="Jelaskan motivasi Anda mengikuti pelatihan ini (minimal 20 karakter)"
                  disabled={isSubmitting}
                />
                {errors.motivasi && <p className="text-red-500 text-sm mt-2">{errors.motivasi}</p>}
                <p className="text-xs text-gray-500 mt-2 text-right">{formData.motivasi.length}/20 karakter minimum</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.persetujuan}
                    onChange={(e) => setFormData({ ...formData, persetujuan: e.target.checked })}
                    className="mt-1 h-5 w-5 text-[#001233] focus:ring-[#001233] border-gray-300 rounded transition-colors"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Saya menyetujui{" "}
                    <a href="#" className="text-[#001233] hover:underline font-semibold">
                      syarat dan ketentuan
                    </a>{" "}
                    serta{" "}
                    <a href="#" className="text-[#001233] hover:underline font-semibold">
                      kebijakan privasi
                    </a>{" "}
                    yang berlaku. *
                  </span>
                </label>
                {errors.persetujuan && <p className="text-red-500 text-sm mt-2">{errors.persetujuan}</p>}
              </div>
            </div>

            {/* Info Pembayaran */}
            {kursus.harga > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-800 mb-2 text-lg">Informasi Pembayaran</h4>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Setelah mendaftar, Anda akan diarahkan untuk melakukan pembayaran sebesar <span className="font-bold text-amber-900">{formatHarga(kursus.harga)}</span>. Akses pelatihan akan aktif setelah pembayaran dikonfirmasi.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 bg-[#001233] text-white rounded-lg hover:bg-[#001233]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mendaftar...
                  </div>
                ) : (
                  kursus.harga > 0 ? "Lanjut ke Pembayaran" : "Daftar Sekarang"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
