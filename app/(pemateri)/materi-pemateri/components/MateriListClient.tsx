"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { MateriData, KursusOption, searchAndFilterMateri } from "../actions";

interface MateriListClientProps {
  initialMateri: MateriData[];
  kursusOptions: KursusOption[];
  userId: string;
}

const tipeMateriOptions = [
  { value: "all", label: "Semua Tipe" },
  { value: "pdf", label: "PDF Document" },
  { value: "ppt", label: "PowerPoint" },
  { value: "video", label: "Video File" },
  { value: "zoom_recording", label: "Zoom Recording" },
];

export default function MateriListClient({ initialMateri, kursusOptions, userId }: MateriListClientProps) {
  const [materiList, setMateriList] = useState<MateriData[]>(initialMateri);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKursus, setSelectedKursus] = useState("all");
  const [selectedTipe, setSelectedTipe] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedKursus, selectedTipe]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const result = await searchAndFilterMateri(userId, searchQuery || undefined, selectedKursus !== "all" ? selectedKursus : undefined, selectedTipe !== "all" ? selectedTipe : undefined);

      if (result.success && result.data) {
        setMateriList(result.data);
      } else {
        console.error("Search error:", result.error);
        // Optionally show error message to user
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedKursus("all");
    setSelectedTipe("all");
  };

  // Fungsi untuk mendapatkan icon berdasarkan tipe materi
  const getMateriIcon = (tipe: string) => {
    switch (tipe) {
      case "video":
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
    if (!sizeInBytes) return "Tidak diketahui";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return Math.round((sizeInBytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const hasActiveFilters = searchQuery || selectedKursus !== "all" || selectedTipe !== "all";

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <ScrollReveal>
        <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-navy mb-2">Cari & Filter Materi</h3>
            <p className="text-gray-600 text-sm">Temukan materi pembelajaran yang Anda cari</p>
          </div>

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan judul atau deskripsi materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200"
              />
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy"></div>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kursus Filter */}
              <select value={selectedKursus} onChange={(e) => setSelectedKursus(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200">
                <option value="all">Semua Pelatihan</option>
                {kursusOptions.map((kursus) => (
                  <option key={kursus.id} value={kursus.id}>
                    {kursus.judul}
                  </option>
                ))}
              </select>

              {/* Tipe Materi Filter */}
              <select value={selectedTipe} onChange={(e) => setSelectedTipe(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200">
                {tipeMateriOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Menampilkan {materiList.length} materi
              {hasActiveFilters && <span className="ml-2 px-2 py-1 bg-navy/10 text-navy rounded text-xs">Filter aktif</span>}
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-navy">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy"></div>
                <span>Mencari...</span>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Results */}
      {materiList.length === 0 ? (
        <ScrollReveal>
          <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-navy/10 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">{hasActiveFilters ? "Tidak ada hasil" : "Belum Ada Materi"}</h3>
              <p className="text-gray-600 mb-6">{hasActiveFilters ? "Coba ubah kriteria pencarian atau filter Anda" : "Anda belum memiliki materi pembelajaran. Mulai dengan membuat pelatihan dan menambahkan materi ke dalamnya."}</p>
              {hasActiveFilters ? (
                <button onClick={resetFilters} className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                  Reset Semua Filter
                </button>
              ) : (
                <Link
                  href="/pelatihan-pemateri"
                  className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Kelola Pelatihan
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <div className="space-y-6">
          {materiList.map((materi, index) => (
            <ScrollReveal key={materi.id} delay={index * 100}>
              <div className="bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">{getMateriIcon(materi.tipe_materi)}</div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-navy mb-2">{materi.judul}</h3>

                          {/* Kursus Info */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-500">Dari pelatihan:</span>
                            <Link href={`/pelatihan-pemateri/${materi.kursus.id}/materi`} className="text-sm font-medium text-navy hover:text-gold transition-colors">
                              {materi.kursus.judul}
                            </Link>
                          </div>

                          {materi.deskripsi && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{materi.deskripsi}</p>}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">{materi.tipe_materi.replace("_", " ")}</span>

                            {materi.is_gratis !== null && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${materi.is_gratis ? "bg-green-100 text-green-800" : "bg-gold/10 text-gold"}`}>
                                {materi.is_gratis ? "Gratis" : "Premium"}
                              </span>
                            )}

                            {materi.ukuran_file && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                {formatFileSize(materi.ukuran_file)}
                              </span>
                            )}

                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(materi.dibuat_pada).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {materi.file_url && (
                            <a href={materi.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Lihat File">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                          )}

                          <Link href={`/pelatihan-pemateri/${materi.kursus.id}/materi`} className="p-2 text-navy hover:bg-navy/10 rounded-lg transition-colors duration-200" title="Kelola Materi">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
