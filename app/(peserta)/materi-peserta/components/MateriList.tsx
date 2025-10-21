"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

type MateriPelajaran = {
  id: string;
  judul: string;
  deskripsi: string | null;
  durasi_menit: number | null;
  urutan: number;
  video_url: string | null;
  konten: string;
  kursus: {
    id: string;
    judul: string;
  };
  progress: {
    persentase_progress: number | null;
    selesai_pada: string | null;
  } | null;
};

interface MateriListProps {
  materiList: MateriPelajaran[];
}

export default function MateriList({ materiList }: MateriListProps) {
  const getProgressStatus = (progress: MateriPelajaran["progress"]) => {
    if (!progress) return { status: "belum_mulai", label: "Belum Mulai", color: "bg-gray-100 text-gray-800" };
    if (progress.selesai_pada) return { status: "selesai", label: "Selesai", color: "bg-green-100 text-green-800" };
    if (progress.persentase_progress && progress.persentase_progress > 0) {
      return { status: "sedang_belajar", label: "Sedang Dipelajari", color: "bg-blue-100 text-blue-800" };
    }
    return { status: "belum_mulai", label: "Belum Mulai", color: "bg-gray-100 text-gray-800" };
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Durasi tidak ditentukan";
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} jam ${remainingMinutes} menit` : `${hours} jam`;
  };

  if (materiList.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Materi Tersedia</h3>
              <p className="text-gray-600 mb-6">Anda belum memiliki akses ke materi pembelajaran atau belum ada kursus yang aktif.</p>
              <Link href="/peserta/katalog-pelatihan" className="inline-flex items-center px-6 py-3 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors duration-200 font-medium">
                Jelajahi Kursus
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 border border-gold rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 border border-silver rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Materi <span className="text-gold">Pembelajaran</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Akses dan pelajari semua materi dari kursus yang Anda ikuti</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materiList.map((materi, index) => {
              const progressStatus = getProgressStatus(materi.progress);
              const progressPercentage = materi.progress?.persentase_progress || 0;

              return (
                <div key={materi.id} className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-gold">{materi.kursus.judul}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${progressStatus.color}`}>{progressStatus.label}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-gold transition-colors duration-300">{materi.judul}</h3>
                    {materi.deskripsi && (
                      <p
                        className="text-gray-600 text-sm leading-relaxed overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {materi.deskripsi}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuration(materi.durasi_menit)}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                        </svg>
                        Urutan {materi.urutan}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {progressPercentage > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gold h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/peserta/materi-peserta/${materi.id}`} className="flex-1 bg-gold text-navy text-center py-2 px-4 rounded-lg hover:bg-gold/90 transition-colors duration-200 font-medium text-sm">
                        {progressStatus.status === "selesai" ? "Buka Ulang" : "Mulai Belajar"}
                      </Link>
                      {materi.video_url && (
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M9 16h1m4 0h1" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
