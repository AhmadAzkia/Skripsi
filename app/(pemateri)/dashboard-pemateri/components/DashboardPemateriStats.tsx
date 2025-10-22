"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type DashboardPemateriStats = {
  totalKursusCount: number;
  kursusAktifCount: number;
  totalPesertaCount: number;
  pendapatanBulanIni: number;
};

interface DashboardPemateriStatsProps {
  stats: DashboardPemateriStats;
}

export default function DashboardPemateriStats({ stats }: DashboardPemateriStatsProps) {
  const statsData = [
    {
      end: stats.totalKursusCount,
      label: "Total Kursus",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      bgColor: "from-navy/10 to-navy/20",
      borderColor: "border-navy/20",
      hoverBorderColor: "hover:border-navy/30",
    },
    {
      end: stats.kursusAktifCount,
      label: "Kursus Aktif",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      bgColor: "from-gold/10 to-gold/20",
      borderColor: "border-gold/20",
      hoverBorderColor: "hover:border-gold/30",
    },
    {
      end: stats.totalPesertaCount,
      label: "Total Peserta",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      bgColor: "from-silver/20 to-silver/30",
      borderColor: "border-silver/30",
      hoverBorderColor: "hover:border-silver/40",
    },
    {
      end: stats.pendapatanBulanIni,
      label: "Pendapatan (Juta)",
      prefix: "Rp ",
      suffix: "M",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "from-amber-50 to-gold/10",
      borderColor: "border-gold/20",
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
              Statistik <span className="text-gold">Instruktur</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Ringkasan kinerja dan pencapaian Anda sebagai instruktur</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className={`group text-center p-8 bg-gradient-to-br ${stat.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${stat.borderColor} ${stat.hoverBorderColor} hover:-translate-y-1`}>
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/60 p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">{stat.icon}</div>
                </div>
                <AnimatedCounter end={stat.end} label={stat.label} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
