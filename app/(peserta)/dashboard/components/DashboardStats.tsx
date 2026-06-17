"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type DashboardStats = {
  totalPelatihanDiikuti: number;
  sertifikatCount: number;
  jadwalBerlangsung: number;
  totalPengeluaran: number;
};

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statsData = [
    {
      end: stats.totalPelatihanDiikuti,
      label: "Total Pelatihan Diikuti",
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
      borderColor: "border-navy/30",
      hoverBorderColor: "hover:border-navy/50",
    },
    {
      end: stats.sertifikatCount,
      label: "Sertifikat Diterima",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      bgColor: "from-gold/10 to-gold/20",
      borderColor: "border-gold/30",
      hoverBorderColor: "hover:border-gold/50",
    },
    {
      end: stats.jadwalBerlangsung,
      label: "Sedang Berlangsung",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "from-silver/10 to-silver/20",
      borderColor: "border-silver/30",
      hoverBorderColor: "hover:border-silver/50",
    },
    {
      end: stats.totalPengeluaran,
      label: "Total Pengeluaran",
      prefix: "Rp ",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "from-green-100/50 to-green-200/50",
      borderColor: "border-green-300/50",
      hoverBorderColor: "hover:border-green-400/50",
    },
  ];

  return (
    <section className="py-16 bg-linear-to-br from-amber-50 to-gray-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-silver rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Progress <span className="text-gold">Pembelajaran</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Ringkasan aktivitas pembelajaran dan pencapaian Anda</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className={`group text-center p-8 bg-linear-to-br ${stat.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${stat.borderColor} ${stat.hoverBorderColor} hover:-translate-y-1`}>
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/60 p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">{stat.icon}</div>
                </div>
                <AnimatedCounter end={stat.end} label={stat.label} prefix={"prefix" in stat ? (stat.prefix as string) : ""} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
