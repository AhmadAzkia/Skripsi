"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { SessionUser } from "@/contexts/AuthContext";

type KursusDetail = {
  id: string;
  judul: string;
  deskripsi: string;
  tipe_kursus: string;
};

interface MateriHeroProps {
  user: SessionUser;
  kursusDetail: KursusDetail;
}

export default function MateriHero({ user, kursusDetail }: MateriHeroProps) {
  const userName = user.profile?.nama_lengkap || user.email?.split("@")[0] || "Peserta";

  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case "online":
        return "bg-navy/10 text-gold border-gold";
      case "offline":
        return "bg-navy/10 text-gold border-gold";
      case "hybrid":
        return "bg-navy/10 text-gold border-gold";
      default:
        return "bg-navy/10 text-gold border-gold";
    }
  };

  return (
    <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-12 md:py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full animate-bounce-gentle" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col items-start">
            {/* Course Content */}
            <div className="w-full">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-silver/80 mb-6">
                <a href="/jadwal-peserta" className="hover:text-gold transition-colors duration-300">
                  Jadwal Peserta
                </a>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gold">Materi Kursus</span>
              </nav>

              {/* Course Title */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{kursusDetail.judul}</h1>
                <p className="text-silver text-lg leading-relaxed max-w-3xl">{kursusDetail.deskripsi}</p>
              </div>

              {/* Course Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTipeColor(kursusDetail.tipe_kursus)}`}>{kursusDetail.tipe_kursus.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
