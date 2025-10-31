"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Kursus = {
  id: string;
  judul: string;
  deskripsi: string | null;
  harga: number;
  kategori: string;
  tipe_kursus: "online" | "offline" | "hybrid";
  status: "draft" | "published" | "archived";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  thumbnail_url: string | null;
  instruktur: {
    nama_lengkap: string;
  } | null;
};

interface KatalogListProps {
  kursusList: Kursus[];
}

export default function KatalogList({ kursusList }: KatalogListProps) {
  const formatHarga = (harga: number) => {
    if (harga === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const formatTanggal = (tanggal: string | null) => {
    if (!tanggal) return "Belum ditentukan";
    return new Date(tanggal).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTipeBadgeColor = (tipe: string) => {
    switch (tipe) {
      case "online":
        return "bg-blue-100 text-blue-800";
      case "offline":
        return "bg-green-100 text-green-800";
      case "hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (kursusList.length === 0) {
    return (
      <section className="py-16 bg-linear-to-br from-white to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">Tidak Ada Pelatihan Ditemukan</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Tidak ada pelatihan yang sesuai dengan filter yang dipilih. Coba ubah filter atau lihat semua pelatihan yang tersedia.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-linear-to-br from-white to-gray-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 border border-gold rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 border border-silver rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Daftar <span className="text-gold">Pelatihan</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Temukan {kursusList.length} pelatihan berkualitas yang sesuai dengan kebutuhan Anda</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kursusList.map((kursus, index) => (
              <div key={kursus.id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gold/30 hover:-translate-y-1 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative h-48 bg-linear-to-br from-navy/10 to-gold/10 overflow-hidden">
                  {kursus.thumbnail_url ? (
                    <img src={kursus.thumbnail_url} alt={kursus.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-navy/20 to-gold/20">
                      <svg className="w-16 h-16 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipeBadgeColor(kursus.tipe_kursus)}`}>{kursus.tipe_kursus.charAt(0).toUpperCase() + kursus.tipe_kursus.slice(1)}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${kursus.harga === 0 ? "bg-green-100 text-green-800" : "bg-gold/20 text-gold font-bold"}`}>{formatHarga(kursus.harga)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-navy/10 text-navy text-xs font-medium rounded-full">{kursus.kategori}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors duration-300">{kursus.judul}</h3>

                  {/* Description */}
                  {kursus.deskripsi && (
                    <p
                      className="text-gray-600 text-sm mb-4 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {kursus.deskripsi}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="space-y-2 mb-6">
                    {kursus.instruktur && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {kursus.instruktur.nama_lengkap}
                      </div>
                    )}
                    {kursus.tanggal_mulai && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatTanggal(kursus.tanggal_mulai)}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/katalog-pelatihan/${kursus.id}`}
                    className="w-full bg-linear-to-r from-navy to-blue-700 hover:from-gold hover:to-gold/90 text-white py-3 px-4 rounded-lg font-medium text-center block transition-all duration-300 group-hover:shadow-lg"
                  >
                    Lihat Detail
                    <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
