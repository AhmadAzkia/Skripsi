"use client"; // Ini adalah komponen Frontend

import React from "react";
import Link from "next/link";
import { useAuth, type SessionUser } from "@/contexts/AuthContext";
import { BookOpenIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

// Tipe data statistik dari page.tsx
type DashboardStats = {
  pelatihanAktifCount: number;
  sertifikatCount: number;
  jadwalHariIniCount: number;
};

// Props yang diterima dari Server Component
interface PesertaDashboardClientUIProps {
  initialStats: DashboardStats;
  initialUser: SessionUser | null; // Terima user awal dari server
}

// ... (const quickActions tetap sama) ...
const quickActions = [
    {
      icon: <BookOpenIcon className="h-6 w-6 text-navy" />,
      title: "Pelatihan Aktif",
      link: "/dashboard/pelatihan-aktif",
    },
    {
      icon: <CalendarDaysIcon className="h-6 w-6 text-navy" />,
      title: "Jadwal Hari Ini",
      link: "/dashboard/jadwal-hari-ini",
    },
];

export default function PesertaDashboardClientUI({ initialStats, initialUser }: PesertaDashboardClientUIProps) {
  // Kita masih bisa gunakan useAuth untuk mendapatkan update user jika ada,
  // tapi data awal kita ambil dari props untuk initial render.
  const { user: contextUser, loading } = useAuth();

  // Gunakan initialUser sebagai fallback jika context belum siap
  const displayUser = contextUser || initialUser;

  // Tampilkan loading jika context masih loading ATAU jika initialUser tidak ada (sebagai fallback)
  if (loading || !displayUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  // Jika setelah loading selesai tapi user tetap null (harusnya tidak terjadi karena layout)
  if (!displayUser) {
    return <div className="flex items-center justify-center min-h-screen">{/* ... (Pesan tidak terautentikasi) ... */}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {" "}
      {/* Tambahkan padding Y */}
      {/* Welcome Section - Gunakan data dari displayUser */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Selamat Datang, {displayUser.profile?.nama_lengkap || displayUser.email?.split("@")[0] || "Peserta"}!</h1>
        <p className="text-lg text-silver">Kelola pembelajaran dan sertifikasi Anda dari dashboard ini</p>
      </div>
      {/* Stats Cards - Gunakan data dari initialStats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 ...">
          <div className="flex items-center">
            {/* ... (Icon Pelatihan) ... */}
            <div className="ml-4">
              <p className="text-sm text-silver font-medium">Pelatihan Aktif</p>
              {/* Tampilkan data dari props */}
              <p className="text-2xl font-bold text-navy">{initialStats.pelatihanAktifCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 ...">
          <div className="flex items-center">
            {/* ... (Icon Sertifikat) ... */}
            <div className="ml-4">
              <p className="text-sm text-silver font-medium">Sertifikat</p>
              {/* Tampilkan data dari props */}
              <p className="text-2xl font-bold text-navy">{initialStats.sertifikatCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 ...">
          <div className="flex items-center">
            {/* ... (Icon Jadwal) ... */}
            <div className="ml-4">
              <p className="text-sm text-silver font-medium">Jadwal Hari Ini</p>
              {/* Tampilkan data dari props */}
              <p className="text-2xl font-bold text-navy">{initialStats.jadwalHariIniCount}</p>
            </div>
          </div>
        </div>
      </div>
      {/* ... (Quick Actions tetap sama, menggunakan map) ... */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-navy mb-6">Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            return (
              <Link
                key={action.title}
                href={action.link}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover-lift hover-glow transition-all duration-300 flex items-center"
              >
                <div className="mr-4">{action.icon}</div>
                <div>
                  <p className="text-sm text-silver font-medium">{action.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Recent Activity (Masih Statis untuk contoh ini) */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">{/* ... (Kode Recent Activity Anda) ... */}</div>
    </div>
  );
}
