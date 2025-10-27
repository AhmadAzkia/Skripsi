"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

type ArtikelItem = {
  id: string;
  judul: string;
  ringkasan: string | null;
  konten: string | null;
  status: "draft" | "review" | "published" | "ditolak";
  slug: string;
  tags: string[] | null;
  gambar_utama_url: string | null;
  dibuat_pada: string;
  diperbarui_pada: string | null;
  dipublikasi_pada: string | null;
  penulis_id: string;
};

interface BlogPemateriListProps {
  articles: ArtikelItem[];
}

export default function BlogPemateriList({ articles }: BlogPemateriListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "review" | "published" | "ditolak">("all");
  const [sortBy, setSortBy] = useState<"dibuat_pada" | "diperbarui_pada" | "judul">("diperbarui_pada");

  const filteredArticles = articles
    .filter((article) => article.judul.toLowerCase().includes(searchTerm.toLowerCase()) || (article.ringkasan && article.ringkasan.toLowerCase().includes(searchTerm.toLowerCase())))
    .filter((article) => filterStatus === "all" || article.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "judul") {
        return a.judul.localeCompare(b.judul);
      }
      const dateA = sortBy === "dibuat_pada" ? a.dibuat_pada : a.diperbarui_pada || a.dibuat_pada;
      const dateB = sortBy === "dibuat_pada" ? b.dibuat_pada : b.diperbarui_pada || b.dibuat_pada;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ditolak":
        return "bg-red-100 text-red-800 border-red-200";
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
      case "review":
        return "Review";
      case "ditolak":
        return "Ditolak";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-16 bg-linear-to-br from-gray-50 to-amber-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Kelola <span className="text-gold">Artikel</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Lihat, edit, dan kelola semua artikel blog Anda</p>
          </div>
        </ScrollReveal>

        {/* Search and Filter Controls */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-navy/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Cari Artikel</label>
                <div className="relative">
                  <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari berdasarkan judul atau ringkasan..."
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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Urutkan</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                  <option value="diperbarui_pada">Terakhir Diupdate</option>
                  <option value="dibuat_pada">Tanggal Dibuat</option>
                  <option value="judul">Judul (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Articles List */}
        <ScrollReveal delay={400}>
          <div className="space-y-6">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-navy/10">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
                <p className="text-gray-500">Coba ubah filter atau buat artikel baru</p>
              </div>
            ) : (
              filteredArticles.map((article, index) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-navy/10 hover:border-navy/20 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Article Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="shrink-0">
                          {article.gambar_utama_url ? (
                            <img src={article.gambar_utama_url} alt={article.judul} className="w-16 h-16 object-cover rounded-lg border-2 border-gold/20" />
                          ) : (
                            <div className="w-16 h-16 bg-linear-to-br from-gold/10 to-navy/10 rounded-lg border-2 border-gold/20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-navy line-clamp-1">{article.judul}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(article.status)}`}>{getStatusText(article.status)}</span>
                          </div>

                          {article.ringkasan && <p className="text-gray-600 mb-3 line-clamp-2">{article.ringkasan}</p>}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(article.dibuat_pada)}
                            </span>

                            {article.diperbarui_pada && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Diupdate: {formatDate(article.diperbarui_pada)}
                              </span>
                            )}

                            {article.tags && article.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span>{article.tags.join(", ")}</span>
                              </div>
                            )}
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
        {filteredArticles.length > 0 && (
          <ScrollReveal delay={600}>
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl">Muat Lebih Banyak</button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
