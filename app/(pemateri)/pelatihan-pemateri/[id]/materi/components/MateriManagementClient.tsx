"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Tables } from "@/../types/database";
import { deleteMateri } from "../actions";

type MateriData = Tables<"materi_kursus">;
type KursusData = Tables<"kursus">;
type ProfileData = Tables<"profil_pengguna">;

interface MateriManagementClientProps {
  kursus: KursusData;
  materiData: MateriData[];
  profile: ProfileData;
}

export default function MateriManagementClient({ kursus, materiData, profile }: MateriManagementClientProps) {
  const [materi, setMateri] = useState<MateriData[]>(materiData);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteMateri = async (materiId: string) => {
    const materiItem = materi.find((m) => m.id === materiId);
    if (!materiItem) return;

    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus materi "${materiItem.judul}"?\n\nTindakan ini tidak dapat dibatalkan.`);

    if (!isConfirmed) return;

    setLoading(materiId);
    try {
      const result = await deleteMateri(materiId);

      if (result.success) {
        setMateri(materi.filter((m) => m.id !== materiId));
        alert(result.message || "Materi berhasil dihapus");
      } else {
        alert(result.error || "Gagal menghapus materi");
      }
    } catch (error) {
      console.error("Error deleting materi:", error);
      alert("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(null);
    }
  };

  const handleEditMateri = (materiId: string) => {
    router.push(`/pelatihan-pemateri/${kursus.id}/materi/edit/${materiId}`);
  };

  const getMateriIcon = (tipe: string) => {
    switch (tipe) {
      case "video":
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 10V9a4 4 0 118 0v1M9 10c0 1.105.895 2 2 2h2c1.105 0 2-.895 2-2M9 10H7m10 0h2" />
          </svg>
        );
      case "pdf":
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "ppt":
        return (
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "zoom_recording":
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const formatFileSize = (sizeInBytes: number | null) => {
    if (!sizeInBytes) return "Unknown";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return Math.round((sizeInBytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  if (materi.length === 0) {
    return (
      <ScrollReveal>
        <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-navy/10 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Belum Ada Materi</h3>
            <p className="text-silver mb-6">Mulai tambahkan materi pembelajaran untuk pelatihan "{kursus.judul}". Anda dapat mengunggah berbagai jenis file seperti PDF, PPT, video, atau rekaman Zoom.</p>
            <button
              onClick={() => router.push(`/pelatihan-pemateri/${kursus.id}/materi/tambah`)}
              className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Materi Pertama
            </button>
          </div>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <div className="space-y-6">
      {materi.map((materiItem, index) => (
        <ScrollReveal key={materiItem.id} delay={index * 100}>
          <div className="bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0">{getMateriIcon(materiItem.tipe_materi)}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-navy">{materiItem.judul}</h3>
                      {materiItem.urutan && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-navy/10 text-navy">#{materiItem.urutan}</span>}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{materiItem.tipe_materi.replace("_", " ")}</span>
                    </div>

                    {materiItem.deskripsi && <p className="text-silver text-sm mb-3 line-clamp-2">{materiItem.deskripsi}</p>}

                    <div className="flex items-center gap-4 text-sm text-silver">
                      {materiItem.ukuran_file && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {formatFileSize(materiItem.ukuran_file)}
                        </span>
                      )}

                      {materiItem.is_gratis !== null && (
                        <span className={`flex items-center gap-1 ${materiItem.is_gratis ? "text-green-600" : "text-gold"}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {materiItem.is_gratis ? "Gratis" : "Premium"}
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(materiItem.dibuat_pada).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {materiItem.file_url && (
                    <a href={materiItem.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Lihat File">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  )}

                  <button onClick={() => handleEditMateri(materiItem.id)} className="p-2 text-navy hover:bg-navy/10 rounded-lg transition-colors duration-200" title="Edit Materi">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDeleteMateri(materiItem.id)}
                    disabled={loading === materiItem.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    title="Hapus Materi"
                  >
                    {loading === materiItem.id ? (
                      <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
