"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type SertifikatStats = {
  totalSertifikat: number;
  sertifikatBulanIni: number;
  kategoriTerlengkap: string;
  rataRataNilai: number;
};

interface SertifikatStatsProps {
  stats: SertifikatStats;
}

export default function SertifikatStats({ stats }: SertifikatStatsProps) {
  const statsData = [
    {
      end: stats.totalSertifikat,
      label: "Total Sertifikat",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z"
          />
        </svg>
      ),
      bgColor: "from-navy/5 to-navy/10",
      borderColor: "border-navy/20",
      hoverBorderColor: "hover:border-navy/30",
    },
    {
      end: stats.sertifikatBulanIni,
      label: "Bulan Ini",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "from-gold/5 to-gold/10",
      borderColor: "border-gold/20",
      hoverBorderColor: "hover:border-gold/30",
    },
    {
      end: stats.rataRataNilai,
      label: "Rata-rata Nilai",
      suffix: "/100",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      bgColor: "from-silver/5 to-silver/10",
      borderColor: "border-silver/20",
      hoverBorderColor: "hover:border-silver/30",
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
              Statistik <span className="text-gold">Sertifikat</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Ringkasan pencapaian dan koleksi sertifikat Anda</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className={`group text-center p-8 bg-gradient-to-br ${stat.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${stat.borderColor} ${stat.hoverBorderColor} hover:-translate-y-1`}>
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/60 p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">{stat.icon}</div>
                </div>
                <AnimatedCounter end={stat.end} label={stat.label} suffix={stat.suffix} />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {stats.kategoriTerlengkap && (
          <ScrollReveal delay={400}>
            <div className="mt-8 text-center">
              <div className="inline-block bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gold/20">
                <h3 className="text-lg font-semibold text-navy mb-2">Kategori Terfavorit</h3>
                <p className="text-gold font-bold text-xl">{stats.kategoriTerlengkap}</p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
