"use client";

import Link from "next/link";
import { useState } from "react";
import { Tables } from "@/../types/database";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Tipe data pelatihan berdasarkan database schema
type PelatihanData = Tables<"pelatihan"> & {
  // Tambahan data yang mungkin di-join dari tabel lain
  jumlah_peserta?: number;
  jumlah_materi?: number;
};

interface PelatihanCardsProps {
  pelatihanData: PelatihanData[];
  userRole: "admin" | "peserta";
  showActions?: boolean;
  onEdit?: (pelatihan: PelatihanData) => void;
  onDelete?: (pelatihanId: string) => void;
  onView?: (pelatihanId: string) => void;
}

export default function PelatihanCards({ pelatihanData, userRole, showActions = true, onEdit, onDelete, onView }: PelatihanCardsProps) {
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

  const handleAction = async (action: () => void, pelatihanId: string) => {
    setLoading(pelatihanId);
    try {
      await action();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(null);
    }
  };

  const getViewLink = (pelatihanId: string) => {
    switch (userRole) {
      case "admin":
        return `/pelatihan-admin/edit/${pelatihanId}`;
      case "peserta":
        return `/pelatihan/${pelatihanId}`;
      default:
        return `/pelatihan/${pelatihanId}`;
    }
  };

  if (pelatihanData.length === 0) {
    return (
      <ScrollReveal>
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-navy/10 hover-lift">
          <div className="bg-linear-to-br from-navy/5 to-gold/5 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-navy mb-3">Belum ada pelatihan</h3>
          <p className="text-silver text-balance max-w-md mx-auto">{userRole === "admin" ? "Buat pelatihan baru untuk memulai" : "Belum ada pelatihan yang tersedia"}</p>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pelatihanData.map((pelatihan, index) => (
        <ScrollReveal key={pelatihan.id} delay={index * 100}>
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-navy/10 hover:border-navy/20 overflow-hidden hover-lift">
            {/* Thumbnail */}
            <div className="relative h-48 bg-linear-to-br from-navy/10 to-gold/10">
              {pelatihan.thumbnail_url ? (
                <img src={pelatihan.thumbnail_url} alt={pelatihan.judul} className="w-full h-full object-cover" />
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(pelatihan.status)}`}>{getStatusText(pelatihan.status)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipeColor(pelatihan.tipe_pelatihan)}`}>{pelatihan.tipe_pelatihan.toUpperCase()}</span>
              </div>

              {/* Price Badge */}
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 backdrop-blur-sm text-sm font-bold rounded-full ${pelatihan.harga === 0 ? "bg-green-100/90 text-green-800" : "bg-white/90 text-navy"}`}>{formatCurrency(pelatihan.harga)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-navy/10 text-navy text-xs font-medium rounded">{pelatihan.kategori}</span>
                </div>

                <h3 className="text-xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors duration-300 line-clamp-2">{pelatihan.judul}</h3>

                {pelatihan.deskripsi && <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{pelatihan.deskripsi}</p>}
              </div>

              {/* Stats */}
              {(pelatihan.jumlah_peserta !== undefined || pelatihan.jumlah_materi !== undefined) && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {pelatihan.jumlah_materi !== undefined && (
                    <div className="bg-navy/5 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-navy">{pelatihan.jumlah_materi}</div>
                      <div className="text-gray-600 text-xs">Materi</div>
                    </div>
                  )}
                  {pelatihan.jumlah_peserta !== undefined && (
                    <div className="bg-gold/5 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-navy">{pelatihan.jumlah_peserta}</div>
                      <div className="text-gray-600 text-xs">Peserta</div>
                    </div>
                  )}
                </div>
              )}

              {/* Dates */}
              {(pelatihan.tanggal_mulai || pelatihan.tanggal_selesai) && (
                <div className="mb-4 space-y-1 text-xs text-gray-500">
                  {pelatihan.tanggal_mulai && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Mulai: {formatDate(pelatihan.tanggal_mulai)}
                    </div>
                  )}
                  {pelatihan.tanggal_selesai && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Selesai: {formatDate(pelatihan.tanggal_selesai)}
                    </div>
                  )}
                </div>
              )}

              {/* Capacity Info */}
              {pelatihan.maksimal_peserta && (
                <div className="mb-4 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Kapasitas:</span>
                    <span className="font-medium">
                      {pelatihan.jumlah_peserta || 0} / {pelatihan.maksimal_peserta} peserta
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-linear-to-r from-navy to-gold h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(((pelatihan.jumlah_peserta || 0) / pelatihan.maksimal_peserta) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-200">
                  {/* View/Access Button */}
                  <Link href={getViewLink(pelatihan.id)} className="flex-1 px-4 py-2 bg-linear-to-r from-navy to-gold text-white text-sm font-medium rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 text-center">
                    {userRole === "admin" ? "Kelola Pelatihan" : "Lihat Detail"}
                  </Link>

                  {/* Additional Actions for Admin */}
                  {userRole === "admin" && (
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => handleAction(() => onEdit(pelatihan), pelatihan.id)}
                          disabled={loading === pelatihan.id}
                          className="p-2 text-navy hover:text-gold border border-navy/20 hover:border-gold/30 rounded-lg hover:bg-gold/5 transition-all duration-300 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}

                      {onDelete && userRole === "admin" && (
                        <button
                          onClick={() => handleAction(() => onDelete(pelatihan.id), pelatihan.id)}
                          disabled={loading === pelatihan.id}
                          className="p-2 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                        >
                          {loading === pelatihan.id ? (
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
