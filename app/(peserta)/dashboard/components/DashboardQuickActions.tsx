"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface DashboardQuickActionsProps {}

export default function DashboardQuickActions({}: DashboardQuickActionsProps) {
  const quickActions = [
    {
      title: "Lihat Pelatihan Tersedia",
      description: "Jelajahi berbagai pelatihan yang dapat Anda ikuti",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: "/katalog-pelatihan",
      bgColor: "from-navy/10 to-navy/20",
      borderColor: "border-navy/30",
      hoverBorderColor: "hover:border-navy/50",
      iconColor: "text-navy",
    },
    {
      title: "Sertifikat Saya",
      description: "Kelola dan unduh sertifikat yang telah diterima",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      href: "/sertifikat",
      bgColor: "from-gold/10 to-gold/20",
      borderColor: "border-gold/30",
      hoverBorderColor: "hover:border-gold/50",
      iconColor: "text-gold",
    },
    {
      title: "Riwayat Pelatihan",
      description: "Lihat detail dan progres pelatihan yang telah diikuti",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      href: "/jadwal-peserta",
      bgColor: "from-silver/10 to-silver/20",
      borderColor: "border-silver/30",
      hoverBorderColor: "hover:border-silver/50",
      iconColor: "text-silver",
    },
    {
      title: "Update Profil",
      description: "Perbarui informasi profil dan pengaturan akun",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: "/profil-peserta",
      bgColor: "from-navy/5 to-gold/10",
      borderColor: "border-navy/20",
      hoverBorderColor: "hover:border-gold/40",
      iconColor: "text-navy",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-navy rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gold rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Aksi <span className="text-gold">Cepat</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Akses fitur-fitur penting dengan mudah dan cepat</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`group block p-6 bg-gradient-to-br ${action.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${action.borderColor} ${action.hoverBorderColor} hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${action.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>{action.icon}</div>
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">{action.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                  <div className="mt-4 text-gold font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                    Buka
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
