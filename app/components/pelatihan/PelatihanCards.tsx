"use client";

import Link from "next/link";
import { useState } from "react";
import { Tables } from "@/../types/database";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Tipe data kursus berdasarkan database schema
type KursusData = Tables<"kursus"> & {
  // Tambahan data yang mungkin di-join dari tabel lain
  jumlah_peserta?: number;
  jumlah_materi?: number;
  nama_instruktur?: string;
};

interface PelatihanCardsProps {
  kursusData: KursusData[];
  userRole: "admin" | "instruktur" | "peserta";
  showActions?: boolean;
  onEdit?: (kursus: KursusData) => void;
  onDelete?: (kursusId: string) => void;
  onView?: (kursusId: string) => void;
}

export default function PelatihanCards({ kursusData, userRole, showActions = true, onEdit, onDelete, onView }: PelatihanCardsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-gold/10 text-gold border-gold/20";
      case "archived":
        return "bg-silver/10 text-silver border-silver/20";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Published";
      case "draft":
        return "Draft";
      case "archived":
        return "Archived";
      default:
        return "Unknown";
    }
  };

  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case "online":
        return "bg-navy text-white";
      case "offline":
        return "bg-gold text-navy";
      case "hybrid":
        return "bg-silver text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAction = async (action: () => void, kursusId: string) => {
    setLoading(kursusId);
    try {
      await action();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(null);
    }
  };

  const getViewLink = (kursusId: string) => {
    switch (userRole) {
      case "admin":
        return `/admin/kursus/${kursusId}`;
      case "instruktur":
        return `/materi-pemateri/${kursusId}`;
      case "peserta":
        return `/kursus/${kursusId}`;
      default:
        return `/kursus/${kursusId}`;
    }
  };

  if (kursusData.length === 0) {
    return (
      <ScrollReveal>
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-navy/10 hover-lift">
          <div className="bg-gradient-to-br from-navy/5 to-gold/5 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-navy mb-3">Belum ada pelatihan</h3>
          <p className="text-silver text-balance max-w-md mx-auto">{userRole === "admin" ? "Buat pelatihan baru untuk memulai" : userRole === "instruktur" ? "Buat pelatihan pertama Anda" : "Belum ada pelatihan yang tersedia"}</p>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {kursusData.map((kursus, index) => (
        <ScrollReveal key={kursus.id} delay={index * 100}>
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-navy/10 hover:border-navy/20 overflow-hidden hover-lift">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-navy/10 to-gold/10">
              {kursus.thumbnail_url ? (
                <img src={kursus.thumbnail_url} alt={kursus.judul} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              )}

              {/* Status & Type Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(kursus.status)}`}>{getStatusText(kursus.status)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipeColor(kursus.tipe_kursus)}`}>{kursus.tipe_kursus.toUpperCase()}</span>
              </div>

              {/* Price Badge */}
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 backdrop-blur-sm text-sm font-bold rounded-full ${kursus.harga === 0 ? "bg-green-100/90 text-green-800" : "bg-white/90 text-navy"}`}>{formatCurrency(kursus.harga)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-navy/10 text-navy text-xs font-medium rounded">{kursus.kategori}</span>
                  <span className="px-2 py-1 bg-gold/10 text-gold text-xs font-medium rounded">{kursus.durasi_jam} jam</span>
                </div>

                <h3 className="text-xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2">{kursus.judul}</h3>

                {kursus.deskripsi && <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{kursus.deskripsi}</p>}
              </div>

              {/* Stats */}
              {(kursus.jumlah_peserta !== undefined || kursus.jumlah_materi !== undefined) && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {kursus.jumlah_materi !== undefined && (
                    <div className="bg-navy/5 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-navy">{kursus.jumlah_materi}</div>
                      <div className="text-gray-600 text-xs">Materi</div>
                    </div>
                  )}
                  {kursus.jumlah_peserta !== undefined && (
                    <div className="bg-gold/5 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-navy">{kursus.jumlah_peserta}</div>
                      <div className="text-gray-600 text-xs">Peserta</div>
                    </div>
                  )}
                </div>
              )}

              {/* Instructor Info (for admin/peserta view) */}
              {kursus.nama_instruktur && userRole !== "instruktur" && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">Instruktur:</span>
                    <span className="text-sm font-medium text-navy">{kursus.nama_instruktur}</span>
                  </div>
                </div>
              )}

              {/* Dates */}
              {(kursus.tanggal_mulai || kursus.tanggal_selesai) && (
                <div className="mb-4 space-y-1 text-xs text-gray-500">
                  {kursus.tanggal_mulai && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Mulai: {formatDate(kursus.tanggal_mulai)}
                    </div>
                  )}
                  {kursus.tanggal_selesai && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Selesai: {formatDate(kursus.tanggal_selesai)}
                    </div>
                  )}
                </div>
              )}

              {/* Capacity Info */}
              {kursus.maksimal_peserta && (
                <div className="mb-4 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Kapasitas:</span>
                    <span className="font-medium">
                      {kursus.jumlah_peserta || 0} / {kursus.maksimal_peserta} peserta
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-gradient-to-r from-navy to-gold h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(((kursus.jumlah_peserta || 0) / kursus.maksimal_peserta) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-200">
                  {/* View/Access Button */}
                  <Link href={getViewLink(kursus.id)} className="flex-1 px-4 py-2 bg-gradient-to-r from-navy to-gold text-white text-sm font-medium rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 text-center">
                    {userRole === "instruktur" ? "Kelola Materi" : userRole === "admin" ? "Kelola Kursus" : "Lihat Detail"}
                  </Link>

                  {/* Additional Actions for Admin/Instruktur */}
                  {(userRole === "admin" || userRole === "instruktur") && (
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => handleAction(() => onEdit(kursus), kursus.id)}
                          disabled={loading === kursus.id}
                          className="p-2 text-navy hover:text-gold border border-navy/20 hover:border-gold/30 rounded-lg hover:bg-gold/5 transition-all duration-300 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}

                      {onDelete && userRole === "admin" && (
                        <button
                          onClick={() => handleAction(() => onDelete(kursus.id), kursus.id)}
                          disabled={loading === kursus.id}
                          className="p-2 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                        >
                          {loading === kursus.id ? (
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
