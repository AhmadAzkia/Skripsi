"use client";

import { useState, useMemo } from "react";
import { Tables } from "@/../types/database";
import PelatihanCards from "./PelatihanCards";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Tipe data kursus berdasarkan database schema
type KursusData = Tables<"kursus"> & {
  // Tambahan data yang mungkin di-join dari tabel lain
  jumlah_peserta?: number;
  jumlah_materi?: number;
};

interface PelatihanListProps {
  kursusData: KursusData[];
  userRole: "admin" | "peserta";
  showActions?: boolean;
  onEdit?: (kursus: KursusData) => void;
  onDelete?: (kursusId: string) => void;
  onView?: (kursusId: string) => void;
  loading?: boolean;
}

export default function PelatihanList({ kursusData, userRole, showActions = true, onEdit, onDelete, onView, loading = false }: PelatihanListProps) {
  // State untuk filter dan pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tipeFilter, setTipeFilter] = useState<string>("all");
  const [kategoriFilter, setKategoriFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("terbaru");

  // Dapatkan kategori unik untuk filter
  const uniqueKategori = useMemo(() => {
    const kategoris = kursusData.map((kursus) => kursus.kategori).filter(Boolean);
    return [...new Set(kategoris)];
  }, [kursusData]);

  // Filter dan sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = kursusData.filter((kursus) => {
      const matchesSearch =
        kursus.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (kursus.deskripsi && kursus.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (kursus.kategori && kursus.kategori.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || kursus.status === statusFilter;
      const matchesTipe = tipeFilter === "all" || kursus.tipe_kursus === tipeFilter;
      const matchesKategori = kategoriFilter === "all" || kursus.kategori === kategoriFilter;

      return matchesSearch && matchesStatus && matchesTipe && matchesKategori;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "terbaru":
          return new Date(b.dibuat_pada || "").getTime() - new Date(a.dibuat_pada || "").getTime();
        case "terlama":
          return new Date(a.dibuat_pada || "").getTime() - new Date(b.dibuat_pada || "").getTime();
        case "judul":
          return a.judul.localeCompare(b.judul);
        case "harga-rendah":
          return (a.harga || 0) - (b.harga || 0);
        case "harga-tinggi":
          return (b.harga || 0) - (a.harga || 0);
        case "peserta":
          return (b.jumlah_peserta || 0) - (a.jumlah_peserta || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [kursusData, searchQuery, statusFilter, tipeFilter, kategoriFilter, sortBy]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Filter Section Skeleton */}
        <ScrollReveal>
          <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-linear-to-r from-navy/10 to-gold/10 rounded w-1/3"></div>
              <div className="h-4 bg-silver/10 rounded w-2/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-linear-to-r from-navy/5 to-gold/5 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden">
                <div className="h-48 bg-linear-to-br from-navy/10 to-gold/10 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-linear-to-r from-navy/10 to-gold/10 rounded animate-pulse"></div>
                  <div className="h-6 bg-navy/10 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-silver/10 rounded animate-pulse"></div>
                    <div className="h-3 bg-silver/10 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="h-10 bg-linear-to-r from-navy/10 to-gold/10 rounded animate-pulse"></div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter dan Search Section */}
      <ScrollReveal>
        <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6 hover-lift">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-navy mb-2">Filter & Pencarian</h3>
            <p className="text-silver text-sm">Temukan pelatihan berdasarkan kriteria yang Anda inginkan</p>
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
                placeholder="Cari berdasarkan judul, deskripsi, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Status Filter */}
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200">
                <option value="all">Semua Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {/* Tipe Filter */}
              <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200">
                <option value="all">Semua Tipe</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>

              {/* Kategori Filter */}
              <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200">
                <option value="all">Semua Kategori</option>
                {uniqueKategori.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200">
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="judul">Nama A-Z</option>
                <option value="harga-rendah">Harga Terendah</option>
                <option value="harga-tinggi">Harga Tertinggi</option>
                {userRole === "admin" && <option value="peserta">Peserta Terbanyak</option>}
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTipeFilter("all");
                  setKategoriFilter("all");
                  setSortBy("terbaru");
                }}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors duration-200 font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Menampilkan {filteredAndSortedData.length} dari {kursusData.length} pelatihan
            </div>
            {(searchQuery || statusFilter !== "all" || tipeFilter !== "all" || kategoriFilter !== "all") && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-navy font-medium">Filter aktif</span>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Results */}
      {filteredAndSortedData.length === 0 ? (
        <ScrollReveal>
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-navy/10 hover-lift">
            <div className="bg-linear-to-br from-navy/5 to-gold/5 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 17H9m6-13H9.5a3.5 3.5 0 000 7h1M15 4H9.5a3.5 3.5 0 000 7h1"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-3">Tidak ada pelatihan yang ditemukan</h3>
            <p className="text-silver mb-6 text-balance max-w-md mx-auto">Coba ubah kriteria pencarian atau filter Anda</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTipeFilter("all");
                setKategoriFilter("all");
              }}
              className="px-6 py-3 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              Reset Semua Filter
            </button>
          </div>
        </ScrollReveal>
      ) : (
        <PelatihanCards kursusData={filteredAndSortedData} userRole={userRole} showActions={showActions} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      )}
    </div>
  );
}
