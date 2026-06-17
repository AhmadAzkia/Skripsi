"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export type AdminDashboardStatsData = {
  totalPengguna: number;
  totalPelatihan: number;
  pelatihanPublished: number;
  pendaftaranAktif: number;
  totalPendapatan: number;
};

interface AdminDashboardStatsProps {
  stats: AdminDashboardStatsData;
}

export default function AdminDashboardStats({ stats }: AdminDashboardStatsProps) {
  const statsData = [
    {
      title: "Total Pengguna",
      value: stats.totalPengguna,
      caption: "Seluruh akun terdaftar",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: "from-navy to-blue-700",
      bgColor: "bg-navy/10",
      textColor: "text-navy",
    },
    {
      title: "Total Pelatihan",
      value: stats.totalPelatihan,
      caption: `${stats.pelatihanPublished} dipublikasikan`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      color: "from-gold to-yellow-600",
      bgColor: "bg-gold/10",
      textColor: "text-gold",
    },
    {
      title: "Pendapatan Total",
      value: stats.totalPendapatan,
      caption: "Pembayaran berhasil",
      isCurrency: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Pendaftaran Aktif",
      value: stats.pendaftaranAktif,
      caption: "Terdaftar & sedang belajar",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: "from-silver to-gray-500",
      bgColor: "bg-silver/10",
      textColor: "text-silver",
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
              Statistik <span className="text-gold">Platform</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Ringkasan data pengguna, pelatihan, dan sertifikat dalam platform</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <ScrollReveal key={stat.title} delay={index * 100}>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} mb-4`}>{stat.icon}</div>
                    <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
                    <div className="text-3xl font-bold text-navy">
                      <AnimatedCounter end={stat.value} duration={2000} label={stat.caption} prefix={"isCurrency" in stat && stat.isCurrency ? "Rp " : ""} />
                    </div>
                  </div>
                  <div className={`w-1 h-16 bg-linear-to-b ${stat.color} rounded-full`}></div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
