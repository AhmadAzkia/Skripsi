"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";

interface Author {
  id: string;
  nama_lengkap: string;
  foto_profil_url: string | null;
  bio: string | null;
}

interface ArticleDetail {
  id: string;
  judul: string;
  ringkasan: string | null;
  konten: string | null;
  slug: string;
  gambar_utama_url: string | null;
  tags: string[] | null;
  dipublikasi_pada: string | null;
  diperbarui_pada: string | null;
  penulis: Author;
}

interface RelatedArticle {
  id: string;
  judul: string;
  ringkasan: string | null;
  slug: string;
  gambar_utama_url: string | null;
  dipublikasi_pada: string | null;
  tags: string[] | null;
  penulis: {
    nama_lengkap: string;
    foto_profil_url: string | null;
  };
}

interface AuthorArticle {
  id: string;
  judul: string;
  ringkasan: string | null;
  slug: string;
  gambar_utama_url: string | null;
  dipublikasi_pada: string | null;
}

interface BlogDetailViewProps {
  article: ArticleDetail;
  relatedArticles: RelatedArticle[];
  authorArticles: AuthorArticle[];
  mode?: "public" | "pemateri"; // Menentukan mode tampilan
  showEditButton?: boolean; // Apakah menampilkan tombol edit
  onEdit?: () => void; // Callback untuk edit
  backUrl?: string; // URL untuk tombol kembali
}

export default function BlogDetailView({ article, relatedArticles, authorArticles, mode = "public", showEditButton = false, onEdit, backUrl = "/blog-pemateri" }: BlogDetailViewProps) {

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak diketahui";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadingTime = (content: string | null) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Menentukan breadcrumb berdasarkan mode
  const getBreadcrumbItems = () => {
    const baseItems: { label: string; href: string; current?: boolean }[] = [{ label: "Beranda", href: "/" }];

    if (mode === "pemateri") {
      baseItems.push({ label: "Dashboard", href: "/pemateri" }, { label: "Blog Saya", href: "/blog-pemateri" });
    } else {
      baseItems.push({ label: "Blog", href: "/blog" });
    }

    baseItems.push({ label: article.judul, href: "#", current: true });
    return baseItems;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <ScrollReveal>
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {item.current ? (
                  <span className="text-navy font-medium truncate">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-navy transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </ScrollReveal>

      {/* Article Header */}
      <ScrollReveal>
        <header className="mb-8">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 5).map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-navy/10 text-navy text-sm rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">{article.judul}</h1>

          {/* Subtitle */}
          {article.ringkasan && <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.ringkasan}</p>}

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-navy to-gold rounded-full flex items-center justify-center overflow-hidden">
                {article.penulis.foto_profil_url ? (
                  <Image src={article.penulis.foto_profil_url} alt={article.penulis.nama_lengkap} width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {article.penulis.nama_lengkap
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-navy">{article.penulis.nama_lengkap}</p>
                <p className="text-sm text-gray-500">Instruktur CertiGuardia</p>
              </div>
            </div>

            {/* Date & Reading Time */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(article.dipublikasi_pada)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{estimateReadingTime(article.konten)} menit baca</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Edit Button (hanya untuk pemateri) */}
              {showEditButton && onEdit && (
                <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </header>
      </ScrollReveal>

      {/* Featured Image */}
      {article.gambar_utama_url && (
        <ScrollReveal>
          <div className="mb-8">
            <div className="relative w-full h-96 md:h-[500px] bg-gray-100 rounded-xl overflow-hidden">
              <Image src={article.gambar_utama_url} alt={article.judul} fill className="object-cover" priority />
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Article Content */}
      <ScrollReveal>
        <article className="bg-white rounded-xl shadow-lg border border-navy/10 p-8 mb-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-navy prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-code:text-navy prose-code:bg-navy/10 prose-code:px-1 prose-code:rounded"
            dangerouslySetInnerHTML={{
              __html: article.konten?.replace(/\n/g, "<br>") || "Konten tidak tersedia",
            }}
          />
        </article>
      </ScrollReveal>

      {/* Author Bio */}
      <ScrollReveal>
        <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-8 mb-12">
          <h3 className="text-2xl font-bold text-navy mb-6">Tentang Penulis</h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0">
              <div className="w-24 h-24 bg-linear-to-br from-navy to-gold rounded-full flex items-center justify-center overflow-hidden">
                {article.penulis.foto_profil_url ? (
                  <Image src={article.penulis.foto_profil_url} alt={article.penulis.nama_lengkap} width={96} height={96} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {article.penulis.nama_lengkap
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-navy mb-2">{article.penulis.nama_lengkap}</h4>
              <p className="text-gray-600 mb-4">{article.penulis.bio || "Instruktur berpengalaman di CertiGuardia dengan keahlian dalam berbagai bidang sertifikasi profesional."}</p>
              {authorArticles.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-navy mb-3">Artikel lainnya dari {article.penulis.nama_lengkap}:</p>
                  <div className="space-y-2">
                    {authorArticles.slice(0, 3).map((authorArticle) => (
                      <Link key={authorArticle.id} href={mode === "pemateri" ? `/blog-pemateri/${authorArticle.slug}` : `/blog/${authorArticle.slug}`} className="block text-sm text-gray-600 hover:text-navy transition-colors duration-200">
                        • {authorArticle.judul}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <ScrollReveal>
          <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-8">
            <h3 className="text-2xl font-bold text-navy mb-6">Artikel Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={mode === "pemateri" ? `/blog-pemateri/${relatedArticle.slug}` : `/blog/${relatedArticle.slug}`}
                  className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-48 bg-linear-to-br from-navy/10 to-gold/10">
                    {relatedArticle.gambar_utama_url ? (
                      <Image src={relatedArticle.gambar_utama_url} alt={relatedArticle.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-navy mb-2 line-clamp-2 group-hover:text-gold transition-colors duration-200">{relatedArticle.judul}</h4>
                    {relatedArticle.ringkasan && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedArticle.ringkasan}</p>}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{relatedArticle.penulis.nama_lengkap}</span>
                      <span>{formatDate(relatedArticle.dipublikasi_pada)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Back Button */}
      <ScrollReveal>
        <div className="text-center mt-12">
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {mode === "pemateri" ? "Kembali ke Blog Saya" : "Kembali ke Blog"}
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
