"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

type JadwalPelatihan = {
  id: string;
  pelatihan_id: string;
  judul: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  tipe_pelatihan: string;
};

interface JadwalListProps {
  jadwalList: JadwalPelatihan[];
}

export default function JadwalList({ jadwalList }: JadwalListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "sedang_belajar":
        return "bg-gold/10 text-amber-700 border-gold/30";
      case "terdaftar":
        return "bg-navy/10 text-navy border-navy/30";
      case "dibatalkan":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "selesai":
        return "Selesai";
      case "sedang_belajar":
        return "Sedang Berlangsung";
      case "terdaftar":
        return "Mendatang";
      case "dibatalkan":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case "online":
        return "bg-navy/5 text-navy border-navy/20";
      case "offline":
        return "bg-gold/5 text-amber-700 border-gold/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (jadwalList.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-navy mb-2">Belum Ada Jadwal</h3>
              <p className="text-navy/70 mb-6">Anda belum memiliki jadwal pelatihan. Daftar pelatihan untuk melihat jadwal Anda.</p>
              <a href="/katalog-pelatihan" className="inline-flex items-center px-6 py-3 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors duration-300">
                Lihat Katalog Pelatihan
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-2">Jadwal Pelatihan Anda</h2>
            <p className="text-gray-600">Kelola dan pantau semua jadwal pelatihan yang Anda ikuti</p>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {jadwalList.map((jadwal, index) => (
            <ScrollReveal key={jadwal.id} delay={index * 100}>
              <div className="bg-white border border-navy/10 rounded-xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-navy mb-2 flex-1">{jadwal.judul}</h3>
                        <div className="flex gap-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(jadwal.status)}`}>{getStatusText(jadwal.status)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTipeColor(jadwal.tipe_pelatihan)}`}>{jadwal.tipe_pelatihan.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex items-center text-navy/70">
                          <svg className="w-4 h-4 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">
                            {new Date(jadwal.tanggal_mulai).toLocaleDateString("id-ID")} - {new Date(jadwal.tanggal_selesai).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                      {jadwal.status === "sedang_belajar" && (
                        <a href={`/materi-kursus/${jadwal.pelatihan_id}`} className="px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors duration-300 text-center">
                          Lanjutkan Pelatihan
                        </a>
                      )}
                      {jadwal.status === "terdaftar" && <span className="px-4 py-2 bg-navy/10 text-navy font-medium rounded-lg text-center border border-navy/20">Menunggu Dimulai</span>}
                      {jadwal.status === "selesai" && (
                        <a href={`/sertifikat?pelatihanId=${jadwal.pelatihan_id}`} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-300 text-center">
                          Lihat Sertifikat
                        </a>
                      )}
                      {jadwal.status === "dibatalkan" && <span className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg text-center border border-red-200">Dibatalkan</span>}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
