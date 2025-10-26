"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "../../../components/ui/ScrollReveal";

interface Author {
  nama_lengkap: string;
  foto_profil_url: string | null;
}

interface BlogArticle {
  id: string;
  judul: string;
  ringkasan: string | null;
  slug: string;
  gambar_utama_url: string | null;
  tags: string[] | null;
  dipublikasi_pada: string | null;
  penulis: Author;
}

interface BlogPublicListProps {
  initialArticles: BlogArticle[];
}

export default function BlogPublicList({ initialArticles }: BlogPublicListProps) {
  const [articles] = useState<BlogArticle[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Get unique tags
  const allTags = articles.flatMap((article) => article.tags || []);
  const uniqueTags = [...new Set(allTags)].sort();

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = searchQuery === "" || article.judul.toLowerCase().includes(searchQuery.toLowerCase()) || (article.ringkasan && article.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === "" || (article.tags && article.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak diketahui";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const estimateReadingTime = (content: string | null) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <ScrollReveal>
        <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200"
              />
            </div>

            {/* Tag Filter */}
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200">
              <option value="">Semua Kategori</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredArticles.length} dari {articles.length} artikel
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("");
                }}
                className="ml-2 text-navy hover:underline"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <ScrollReveal>
          <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-navy/10 to-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Tidak ada artikel ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah kata kunci pencarian atau filter kategori Anda</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Lihat Semua Artikel
              </button>
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <ScrollReveal key={article.id} delay={index * 100}>
              <Link href={`/blog/${article.slug}`} className="group block bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-navy/10 to-gold/10">
                  {article.gambar_utama_url ? (
                    <Image src={article.gambar_utama_url} alt={article.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-navy/10 text-navy text-xs rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">+{article.tags.length - 2}</span>}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-navy mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-200">{article.judul}</h3>

                  {/* Summary */}
                  {article.ringkasan && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.ringkasan}</p>}

                  {/* Author & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-navy to-gold rounded-full flex items-center justify-center overflow-hidden">
                        {article.penulis.foto_profil_url ? (
                          <Image src={article.penulis.foto_profil_url} alt={article.penulis.nama_lengkap} width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-semibold text-xs">
                            {article.penulis.nama_lengkap
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{article.penulis.nama_lengkap}</p>
                        <p className="text-xs text-gray-500">{formatDate(article.dipublikasi_pada)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{estimateReadingTime(article.ringkasan)} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
