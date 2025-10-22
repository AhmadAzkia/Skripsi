"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type MateriPemateriStats = {
  totalMateri: number;
  materiAktif: number;
  totalKursus: number;
  materiTerbaru: number;
};

interface MateriPemateriStatsProps {
  stats: MateriPemateriStats;
}

export default function MateriPemateriStats({ stats }: MateriPemateriStatsProps) {
  const statsData = [
    {
      end: stats.totalMateri,
      label: "Total Materi",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "from-navy/5 to-navy/10",
      borderColor: "border-navy/20",
      hoverBorderColor: "hover:border-navy/30",
    },
    {
      end: stats.materiAktif,
      label: "Materi Aktif",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "from-gold/5 to-gold/10",
      borderColor: "border-gold/20",
      hoverBorderColor: "hover:border-gold/30",
    },
    {
      end: stats.totalKursus,
      label: "Kursus Anda",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: "from-silver/5 to-silver/10",
      borderColor: "border-silver/20",
      hoverBorderColor: "hover:border-silver/30",
    },
    {
      end: stats.materiTerbaru,
      label: "Bulan Ini",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "from-navy/10 to-gold/5",
      borderColor: "border-navy/30",
      hoverBorderColor: "hover:border-gold/30",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-gray-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-silver rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Statistik <span className="text-gold">Materi</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Ringkasan konten pembelajaran yang telah Anda buat dan kelola</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className={`group text-center p-8 bg-gradient-to-br ${stat.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${stat.borderColor} ${stat.hoverBorderColor} hover:-translate-y-1`}>
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/60 p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">{stat.icon}</div>
                </div>
                <AnimatedCounter end={stat.end} label={stat.label} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
