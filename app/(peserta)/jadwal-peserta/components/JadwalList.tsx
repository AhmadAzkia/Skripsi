"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

type JadwalPelatihan = {
  id: string;
  judul: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  tipe_kursus: string;
  durasi_jam: number;
  instruktur: string;
  persentase_progress: number;
};

interface JadwalListProps {
  jadwalList: JadwalPelatihan[];
}

export default function JadwalList({ jadwalList }: JadwalListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "sedang_belajar":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "terdaftar":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "dibatalkan":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "selesai":
        return "Selesai";
      case "sedang_belajar":
        return "Berlangsung";
      case "terdaftar":
        return "Terdaftar";
      case "dibatalkan":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case "online":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "offline":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "hybrid":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Jadwal</h3>
              <p className="text-gray-500 mb-6">Anda belum memiliki jadwal pelatihan. Daftar pelatihan untuk melihat jadwal Anda.</p>
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
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-navy mb-2 flex-1">{jadwal.judul}</h3>
                        <div className="flex gap-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(jadwal.status)}`}>{getStatusText(jadwal.status)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTipeColor(jadwal.tipe_kursus)}`}>{jadwal.tipe_kursus.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">
                            {new Date(jadwal.tanggal_mulai).toLocaleDateString("id-ID")} - {new Date(jadwal.tanggal_selesai).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{jadwal.durasi_jam} jam</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm">{jadwal.instruktur}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {jadwal.status === "sedang_belajar" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm text-gray-600">{jadwal.persentase_progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gold h-2 rounded-full transition-all duration-300" style={{ width: `${jadwal.persentase_progress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Section */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                      {jadwal.status === "sedang_belajar" && <button className="px-4 py-2 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors duration-300">Lanjutkan Belajar</button>}
                      {jadwal.status === "terdaftar" && <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300">Mulai Belajar</button>}
                      {jadwal.status === "selesai" && <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300">Lihat Sertifikat</button>}
                      <button className="px-4 py-2 bg-transparent border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors duration-300">Detail</button>
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
