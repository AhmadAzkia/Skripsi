"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScrollReveal from "../../../components/ui/ScrollReveal";
import { ArtikelBlog, searchAndFilterArtikel, deleteArtikel } from "../actions";

interface BlogListClientProps {
  initialArticles: ArtikelBlog[];
  userId: string;
}

const statusOptions = [
  { value: "all", label: "Semua Status", color: "bg-gray-100 text-gray-800" },
  { value: "draft", label: "Draft", color: "bg-yellow-100 text-yellow-800" },
  { value: "review", label: "Review", color: "bg-blue-100 text-blue-800" },
  { value: "published", label: "Published", color: "bg-green-100 text-green-800" },
];

export default function BlogListClient({ initialArticles, userId }: BlogListClientProps) {
  const [articles, setArticles] = useState<ArtikelBlog[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"draft" | "review" | "published" | "ditolak" | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedStatus]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const result = await searchAndFilterArtikel(userId, searchQuery || undefined, selectedStatus !== "all" ? selectedStatus : undefined);

      if (result.success && result.data) {
        setArticles(result.data);
      } else {
        console.error("Search error:", result.error);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;

    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus artikel "${article.judul}"?\n\nTindakan ini tidak dapat dibatalkan.`);

    if (!isConfirmed) return;

    setDeleteLoading(articleId);
    try {
      const result = await deleteArtikel(userId, articleId);

      if (result.success) {
        setArticles(articles.filter((a) => a.id !== articleId));
        alert("Artikel berhasil dihapus");
      } else {
        alert(result.error || "Gagal menghapus artikel");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Terjadi kesalahan yang tidak terduga");
    } finally {
      setDeleteLoading(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.label || status;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak diketahui";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasActiveFilters = searchQuery || selectedStatus !== "all";

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <ScrollReveal>
        <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-navy mb-2">Cari & Filter Artikel</h3>
            <p className="text-gray-600 text-sm">Temukan artikel blog yang Anda cari</p>
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
                placeholder="Cari berdasarkan judul, ringkasan, atau konten artikel..."
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
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as "draft" | "review" | "published" | "ditolak" | "all")}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Add New Article Button */}
              <Link
                href="/blog-pemateri/tulis"
                className="px-4 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tulis Artikel Baru
              </Link>

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
              Menampilkan {articles.length} artikel
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
      {articles.length === 0 ? (
        <ScrollReveal>
          <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-navy/10 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">{hasActiveFilters ? "Tidak ada hasil" : "Belum Ada Artikel"}</h3>
              <p className="text-gray-600 mb-6">{hasActiveFilters ? "Coba ubah kriteria pencarian atau filter Anda" : "Anda belum memiliki artikel blog. Mulai menulis artikel pertama Anda."}</p>
              {hasActiveFilters ? (
                <button onClick={resetFilters} className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                  Reset Semua Filter
                </button>
              ) : (
                <Link
                  href="/blog-pemateri/tulis"
                  className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tulis Artikel Pertama
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ScrollReveal key={article.id} delay={index * 100}>
              <div className="bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-navy/10 to-gold/10">
                  {article.gambar_utama_url ? (
                    <img src={article.gambar_utama_url} alt={article.judul} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>{getStatusText(article.status)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-2 line-clamp-2">{article.judul}</h3>

                  {article.ringkasan && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.ringkasan}</p>}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-navy/10 text-navy text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{article.tags.length - 3} lagi</span>}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Dibuat: {formatDate(article.dibuat_pada)}
                    </div>
                    {article.dipublikasi_pada && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        Dipublikasi: {formatDate(article.dipublikasi_pada)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link href={`/blog-pemateri/edit/${article.id}`} className="p-2 text-navy hover:bg-navy/10 rounded-lg transition-colors duration-200" title="Edit Artikel">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      <button onClick={() => handleDelete(article.id)} disabled={deleteLoading === article.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50" title="Hapus Artikel">
                        {deleteLoading === article.id ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>

                      <Link href={`/blog-pemateri/${article.slug}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Lihat Detail">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </div>

                    {article.status === "published" && (
                      <Link href={`/blog/${article.slug}`} target="_blank" className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200" title="Lihat di Blog Public">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    )}
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
