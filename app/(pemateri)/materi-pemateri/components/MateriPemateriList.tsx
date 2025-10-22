"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

type MateriItem = {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  status: "draft" | "published" | "archived";
  tanggalDibuat: string;
  tanggalUpdate: string;
  jumlahPeserta: number;
  durasi: string;
  tipeMateri: "video" | "pdf" | "presentasi" | "text";
};

interface MateriPemateriListProps {
  materials: MateriItem[];
}

export default function MateriPemateriList({ materials }: MateriPemateriListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published" | "archived">("all");
  const [sortBy, setSortBy] = useState<"tanggalDibuat" | "tanggalUpdate" | "judul">("tanggalUpdate");

  const filteredMaterials = materials
    .filter((material) => material.judul.toLowerCase().includes(searchTerm.toLowerCase()) || material.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((material) => filterStatus === "all" || material.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "judul") {
        return a.judul.localeCompare(b.judul);
      }
      return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Terbitkan";
      case "draft":
        return "Draft";
      case "archived":
        return "Arsip";
      default:
        return "Unknown";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return (
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case "pdf":
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "presentasi":
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Kelola <span className="text-gold">Materi</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Lihat, edit, dan kelola semua materi pembelajaran Anda</p>
          </div>
        </ScrollReveal>

        {/* Search and Filter Controls */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-navy/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Cari Materi</label>
                <div className="relative">
                  <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan judul atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Status */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Filter Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                  <option value="all">Semua Status</option>
                  <option value="published">Terbitkan</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Urutkan</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                  <option value="tanggalUpdate">Terakhir Diupdate</option>
                  <option value="tanggalDibuat">Tanggal Dibuat</option>
                  <option value="judul">Judul (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Materials List */}
        <ScrollReveal delay={400}>
          <div className="space-y-6">
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-navy/10">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada materi ditemukan</h3>
                <p className="text-gray-500">Coba ubah filter atau buat materi baru</p>
              </div>
            ) : (
              filteredMaterials.map((material, index) => (
                <div key={material.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-navy/10 hover:border-navy/20 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Material Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{getTypeIcon(material.tipeMateri)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-navy">{material.judul}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.status)}`}>{getStatusText(material.status)}</span>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{material.deskripsi}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {material.kategori}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {material.durasi}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {material.jumlahPeserta} peserta
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 text-navy hover:text-gold transition-colors duration-300 border border-navy/20 hover:border-gold/30 rounded-lg hover:bg-gold/5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="px-4 py-2 text-navy hover:text-gold transition-colors duration-300 border border-navy/20 hover:border-gold/30 rounded-lg hover:bg-gold/5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-300 border border-red-200 hover:border-red-300 rounded-lg hover:bg-red-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollReveal>

        {/* Pagination or Load More */}
        {filteredMaterials.length > 0 && (
          <ScrollReveal delay={600}>
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl">Muat Lebih Banyak</button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
