"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

type ProfilStats = {
  totalPelatihan: number;
  pelatihanSelesai: number;
  totalSertifikat: number;
  waktuBelajar: number; // dalam jam
};

interface ProfilStatsProps {
  stats: ProfilStats;
}

export default function ProfilStats({ stats }: ProfilStatsProps) {
  const statsData = [
    {
      end: stats.totalPelatihan,
      label: "Total Pelatihan",
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
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      hoverBorderColor: "hover:border-blue-300",
    },
    {
      end: stats.pelatihanSelesai,
      label: "Pelatihan Selesai",
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
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      hoverBorderColor: "hover:border-green-300",
    },
    {
      end: stats.totalSertifikat,
      label: "Sertifikat Diterima",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      hoverBorderColor: "hover:border-purple-300",
    },
    {
      end: stats.waktuBelajar,
      label: "Jam Belajar",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      hoverBorderColor: "hover:border-amber-300",
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
              Statistik <span className="text-gold">Pembelajaran</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Lihat pencapaian dan progress pembelajaran Anda</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div key={index} className={`group text-center p-6 bg-gradient-to-br ${stat.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${stat.borderColor} ${stat.hoverBorderColor} hover:-translate-y-1`}>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/60 p-3 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">{stat.icon}</div>
                </div>
                <AnimatedCounter end={stat.end} label={stat.label} />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Progress Chart */}
        <ScrollReveal delay={400}>
          <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-navy mb-6 text-center">
              Progress <span className="text-gold">Pembelajaran</span>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tingkat Penyelesaian</span>
                  <span className="text-sm font-semibold text-navy">{stats.totalPelatihan > 0 ? Math.round((stats.pelatihanSelesai / stats.totalPelatihan) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-gold to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: stats.totalPelatihan > 0 ? `${(stats.pelatihanSelesai / stats.totalPelatihan) * 100}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-navy">{stats.totalPelatihan}</div>
                  <div className="text-sm text-gray-600">Total Pelatihan</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-navy">{stats.pelatihanSelesai}</div>
                  <div className="text-sm text-gray-600">Selesai</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                  <div className="text-2xl font-bold text-navy">{stats.totalPelatihan - stats.pelatihanSelesai}</div>
                  <div className="text-sm text-gray-600">Sedang Berjalan</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
