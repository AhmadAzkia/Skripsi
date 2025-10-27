"use client";

import React from "react";
import Link from "next/link";
import { AcademicCapIcon, CalendarDaysIcon, CheckBadgeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { CertificateWithCourse } from "../page"; // Impor tipe dari halaman

interface CertificateListProps {
  certificates: CertificateWithCourse[];
}

// Helper untuk format tanggal
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function CertificateList({ certificates }: CertificateListProps) {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Sertifikat</h2>
        <p className="text-gray-500">Selesaikan pelatihan untuk mendapatkan sertifikat Anda.</p>
        <Link href="/peserta/katalog" className="mt-4 inline-block text-gold hover:underline">
          Jelajahi Pelatihan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {certificates.map((cert) => (
        <div key={cert.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300">
          {/* Bagian Kiri: Info Kursus */}
          <div className="p-6 flex-1">
            <div className="flex items-center mb-3">
              <CheckBadgeIcon className="w-6 h-6 text-gold mr-2 shrink-0" />
              <h2 className="text-xl font-bold text-navy truncate" title={cert.kursus?.judul || "Nama Kursus Tidak Tersedia"}>
                {cert.kursus?.judul || "Nama Kursus Tidak Tersedia"}
              </h2>
            </div>
            <div className="flex items-center text-sm text-silver mb-2">
              <AcademicCapIcon className="w-4 h-4 mr-2" />
              <span>Nomor: {cert.nomor_sertifikat}</span>
            </div>
            <div className="flex items-center text-sm text-silver">
              <CalendarDaysIcon className="w-4 h-4 mr-2" />
              <span>Diterbitkan: {formatDate(cert.tanggal_terbit)}</span>
            </div>
          </div>

          {/* Bagian Kanan: Tombol Aksi */}
          <div className="bg-gray-50 p-4 md:p-6 flex items-center justify-center md:border-l border-gray-200">
            {cert.sertifikat_url ? (
              <a
                href={cert.sertifikat_url}
                target="_blank"
                rel="noopener noreferrer"
                download // Menyarankan browser untuk download
                className="inline-flex items-center px-4 py-2 bg-linear-to-r from-navy to-navy/90 text-white rounded-lg hover:from-navy/90 hover:to-navy font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Unduh Sertifikat
              </a>
            ) : (
              <span className="text-sm text-gray-400 italic">URL tidak tersedia</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
