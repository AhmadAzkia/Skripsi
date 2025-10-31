"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ProfilManager, ChangePasswordForm } from "@/components/profil";
import { Button, LinkButton, Alert } from "@/components/ui";

interface PesertaStats {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
}

interface ProfilPesertaClientProps {
  initialData: {
    profile: any;
    user: any;
    stats: PesertaStats;
  } | null;
  error?: string;
}

export default function ProfilPesertaClient({ initialData, error }: ProfilPesertaClientProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const [stats, setStats] = useState<PesertaStats>(
    initialData?.stats || {
      enrolledCourses: 0,
      completedCourses: 0,
      certificates: 0,
    }
  );

  if (error || !initialData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="error" title="Error memuat profil">
            {error || "Profil tidak ditemukan. Silakan login ulang."}
          </Alert>
        </div>
      </div>
    );
  }

  const { profile, user } = initialData;

  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };

  const handleCancelChangePassword = () => {
    setIsChangingPassword(false);
  };

  const handlePasswordChangeSuccess = () => {
    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);

    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // If changing password, show the change password form
  if (isChangingPassword) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ChangePasswordForm onSuccess={handlePasswordChangeSuccess} onCancel={handleCancelChangePassword} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Peserta</h1>
          <p className="text-gray-600">Kelola informasi profil dan preferensi akun Anda sebagai peserta pelatihan.</p>
        </div>

        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-navy">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Profil</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Component */}
          <div className="lg:col-span-2">
            <ProfilManager user={user} profile={profile} role="peserta" compact={false} />
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Learning Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Belajar</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pelatihan Diikuti</span>
                  <span className="text-lg font-semibold text-navy">{stats.enrolledCourses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pelatihan Selesai</span>
                  <span className="text-lg font-semibold text-navy">{stats.completedCourses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sertifikat Diperoleh</span>
                  <span className="text-lg font-semibold text-gold">{stats.certificates}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <LinkButton href="/katalog-pelatihan" variant="secondary" size="md" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Katalog Pelatihan
                </LinkButton>
                <LinkButton href="/jadwal-peserta" variant="secondary" size="md" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Jadwal Pelatihan
                </LinkButton>
                <LinkButton href="/sertifikat" variant="secondary" size="md" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Sertifikat Saya
                </LinkButton>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pencapaian Terbaru</h3>
              <div className="space-y-3">
                {stats.certificates > 0 || stats.completedCourses > 0 ? (
                  <div className="space-y-3">
                    {stats.completedCourses > 0 && (
                      <div className="flex items-center p-3 bg-navy/5 border border-navy/20 rounded-lg">
                        <div className="shrink-0">
                          <svg className="w-6 h-6 text-navy" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-navy">Pelatihan Selesai!</p>
                          <p className="text-xs text-navy">{stats.completedCourses} pelatihan telah diselesaikan</p>
                        </div>
                      </div>
                    )}
                    {stats.certificates > 0 && (
                      <div className="flex items-center p-3 bg-navy/5 border border-navy/20 rounded-lg">
                        <div className="shrink-0">
                          <svg className="w-6 h-6 text-navy" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-navy">Sertifikat Diperoleh!</p>
                          <p className="text-xs text-navy">{stats.certificates} sertifikat telah diterbitkan</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-gold/5 border border-gold/20 rounded-lg">
                    <div className="shrink-0">
                      <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gold">Selamat datang!</p>
                      <p className="text-xs text-gold">Mulai mengikuti pelatihan untuk mendapatkan pencapaian</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Akun</h3>
              <div className="space-y-3">
                <Button onClick={handleChangePassword} variant="secondary" size="md" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Ganti Password
                </Button>
                <Button onClick={handleLogout} disabled={isLoggingOut} variant="danger" size="md" className="w-full justify-start">
                  {isLoggingOut ? (
                    <>
                      <svg className="w-5 h-5 mr-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={cancelLogout} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 mx-4 max-w-md w-full transform transition-all duration-300 animate-slideInFromTop">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Keluar</h3>
                <p className="text-sm text-gray-500">Pastikan untuk menyimpan pekerjaan Anda</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">Apakah Anda yakin ingin keluar dari portal peserta?</p>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">⚠️ Anda akan diarahkan kembali ke halaman utama dan perlu login ulang untuk mengakses portal peserta.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button onClick={cancelLogout} disabled={isLoggingOut} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50">
                Batal
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Keluar...</span>
                  </>
                ) : (
                  <span>Ya, Keluar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
