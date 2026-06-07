"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { SessionUser } from "@/contexts/AuthContext";
import RegistrationModal from "./RegistrationModal";

type Kursus = {
  id: string;
  judul: string;
  deskripsi: string | null;
  harga: number;
  kategori: string;
  tipe_kursus: "online" | "offline" | "hybrid";
  status: "draft" | "published" | "archived";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  thumbnail_url: string | null;
  maksimal_peserta: number | null;
  instruktur: {
    id: string;
    nama_lengkap: string;
    bio: string | null;
    foto_profil_url: string | null;
  } | null;
};

type RegistrationStatus = {
  isRegistered: boolean;
  registrationData?: {
    id: string;
    status: "terdaftar" | "sedang_belajar" | "selesai" | "dibatalkan";
    tanggal_daftar: string;
  };
};

type Profile = {
  id: string;
  nama_lengkap: string;
  email: string;
  nomor_hp: string | null;
};

interface DetailPelatihanContainerProps {
  user: SessionUser;
  profile: Profile;
  kursus: Kursus;
  registrationStatus: RegistrationStatus;
  jumlahPeserta: number;
}

export default function DetailPelatihanContainer({ user, profile, kursus, registrationStatus, jumlahPeserta }: DetailPelatihanContainerProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const isPendaftaranDitutup = (() => {
    if (!kursus.tanggal_mulai) {
      return false;
    }

    const startDate = new Date(kursus.tanggal_mulai);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return startDate <= today;
  })();

  // Function untuk membuka modal pendaftaran
  const handleBukaModal = () => {
    setShowRegistrationModal(true);
  };

  // Function untuk menutup modal pendaftaran
  const handleTutupModal = () => {
    setShowRegistrationModal(false);
  };

  useEffect(() => {
    const handleCloseModal = () => {
      handleTutupModal();
    };

    const handleRegistrationSuccess = () => {
      handleTutupModal();
    };

    window.addEventListener("closeRegistrationModal", handleCloseModal);
    window.addEventListener("registrationSuccess", handleRegistrationSuccess);

    return () => {
      window.removeEventListener("closeRegistrationModal", handleCloseModal);
      window.removeEventListener("registrationSuccess", handleRegistrationSuccess);
    };
  }, []);

  const formatHarga = (harga: number) => {
    if (harga === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const formatTanggal = (tanggal: string | null) => {
    if (!tanggal) return "Belum ditentukan";
    return new Date(tanggal).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTipeBadgeColor = (tipe: string) => {
    switch (tipe) {
      case "online":
        return "bg-blue-100 text-blue-800";
      case "offline":
        return "bg-green-100 text-green-800";
      case "hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "terdaftar":
        return "bg-blue-100 text-blue-800";
      case "sedang_belajar":
        return "bg-yellow-100 text-yellow-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isKursusPenuh = kursus.maksimal_peserta && jumlahPeserta >= kursus.maksimal_peserta;

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-gray-50">
      {/* Header dengan Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/katalog-pelatihan" className="hover:text-navy transition-colors">
              Katalog Pelatihan
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-navy font-medium">{kursus.judul}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Konten Utama */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              {/* Header Kursus */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipeBadgeColor(kursus.tipe_kursus)}`}>{kursus.tipe_kursus.charAt(0).toUpperCase() + kursus.tipe_kursus.slice(1)}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-navy/10 text-navy">{kursus.kategori}</span>
                  {registrationStatus.isRegistered && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(registrationStatus.registrationData!.status)}`}>{registrationStatus.registrationData!.status.replace("_", " ").toUpperCase()}</span>
                  )}
                </div>

                {/* Judul */}
                <h1 className="text-3xl font-bold text-navy mb-4">{kursus.judul}</h1>

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className={`text-sm ${isKursusPenuh ? "text-red-600 font-medium" : "text-green-600 font-medium"}`}>{isKursusPenuh ? "Penuh" : "Tersedia"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{formatTanggal(kursus.tanggal_mulai)}</span>
                  </div>
                </div>

                {/* Thumbnail */}
                {kursus.thumbnail_url && (
                  <div className="mb-6">
                    <img src={kursus.thumbnail_url} alt={kursus.judul} className="w-full h-64 object-cover rounded-lg" />
                  </div>
                )}

                {/* Deskripsi */}
                {kursus.deskripsi && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-navy mb-3">Deskripsi Pelatihan</h3>
                    <div className="prose prose-blue max-w-none text-gray-700">
                      {kursus.deskripsi.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Instruktur */}
            {kursus.instruktur && (
              <ScrollReveal delay={300}>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-navy mb-4">Instruktur</h3>
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0">
                      {kursus.instruktur.foto_profil_url ? (
                        <img src={kursus.instruktur.foto_profil_url} alt={kursus.instruktur.nama_lengkap} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-navy">{kursus.instruktur.nama_lengkap}</h4>
                      {kursus.instruktur.bio && <p className="text-gray-600 text-sm mt-1">{kursus.instruktur.bio}</p>}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={400}>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                {/* Harga */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-navy mb-2">{formatHarga(kursus.harga)}</div>
                  {kursus.harga > 0 && <p className="text-sm text-gray-600">Harga pendaftaran pelatihan</p>}
                </div>

                {/* Status Pendaftaran */}
                {registrationStatus.isRegistered ? (
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-semibold text-green-800 mb-1">Anda Sudah Terdaftar</h4>
                      <p className="text-sm text-green-700">Terdaftar sejak {formatTanggal(registrationStatus.registrationData!.tanggal_daftar)}</p>
                    </div>

                    {registrationStatus.registrationData!.status === "sedang_belajar" && (
                      <Link
                        href={`/my-learning/${kursus.id}`}
                        className="w-full bg-linear-to-r from-navy to-blue-700 hover:from-gold hover:to-gold/90 text-white py-3 px-4 rounded-lg font-medium text-center block transition-all duration-300 mt-4"
                      >
                        Lanjutkan Belajar
                      </Link>
                    )}
                  </div>
                ) : isPendaftaranDitutup ? (
                  <div className="mb-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center mb-4">
                      <svg className="w-12 h-12 text-amber-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9.75 0c0 5.385-4.365 9.75-9.75 9.75S2.25 18.135 2.25 12.75 6.615 3 12 3s9.75 4.365 9.75 9.75zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <h4 className="font-semibold text-amber-800 mb-1">Pendaftaran Ditutup</h4>
                      <p className="text-sm text-amber-700">Pelatihan ini sudah dimulai, jadi peserta baru tidak bisa mendaftar lagi.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    {isKursusPenuh ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-4">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h4 className="font-semibold text-red-800 mb-1">Pelatihan Penuh</h4>
                        <p className="text-sm text-red-700">Kuota peserta sudah terpenuhi</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleBukaModal}
                        className="w-full bg-linear-to-r from-navy to-blue-700 hover:from-gold hover:to-gold/90 text-white py-3 px-4 rounded-lg font-medium text-center transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Daftar Sekarang
                      </button>
                    )}
                  </div>
                )}

                {/* Info Kuota */}
                {kursus.maksimal_peserta && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Status Kuota</span>
                      <span className={`font-medium ${isKursusPenuh ? "text-red-600" : "text-green-600"}`}>{isKursusPenuh ? "Penuh" : "Tersedia"}</span>
                    </div>
                  </div>
                )}

                {/* Info Pelatihan */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipe</span>
                    <span className="font-medium capitalize">{kursus.tipe_kursus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Mulai</span>
                    <span className="font-medium">{formatTanggal(kursus.tanggal_mulai)}</span>
                  </div>
                  {kursus.tanggal_selesai && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal Selesai</span>
                      <span className="font-medium">{formatTanggal(kursus.tanggal_selesai)}</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Modal Pendaftaran */}
      <RegistrationModal kursus={kursus} profile={profile} isOpen={showRegistrationModal} />
    </div>
  );
}
