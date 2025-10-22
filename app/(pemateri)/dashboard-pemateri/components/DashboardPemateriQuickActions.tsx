"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface DashboardPemateriQuickActionsProps {}

export default function DashboardPemateriQuickActions({}: DashboardPemateriQuickActionsProps) {
  const quickActions = [
    {
      title: "Kelola Kursus",
      description: "Buat dan kelola kursus pelatihan Anda",
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
      href: "/kelola-kursus",
      bgColor: "from-navy/10 to-navy/20",
      borderColor: "border-navy/20",
      hoverBorderColor: "hover:border-navy/30",
      iconColor: "text-navy",
    },
    {
      title: "Lihat Peserta",
      description: "Pantau progress dan kelola peserta kursus",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      href: "/peserta-kursus",
      bgColor: "from-gold/10 to-gold/20",
      borderColor: "border-gold/20",
      hoverBorderColor: "hover:border-gold/30",
      iconColor: "text-gold",
    },
    {
      title: "Materi Pembelajaran",
      description: "Upload dan kelola materi kursus",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: "/materi-pembelajaran",
      bgColor: "from-silver/20 to-silver/30",
      borderColor: "border-silver/30",
      hoverBorderColor: "hover:border-silver/40",
      iconColor: "text-silver",
    },
    {
      title: "Laporan & Analitik",
      description: "Lihat laporan kinerja dan pendapatan",
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
      href: "/laporan-analitik",
      bgColor: "from-navy/15 to-blue-900/20",
      borderColor: "border-navy/25",
      hoverBorderColor: "hover:border-navy/35",
      iconColor: "text-navy",
    },
    {
      title: "Sertifikat",
      description: "Kelola dan terbitkan sertifikat peserta",
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
      href: "/kelola-sertifikat",
      bgColor: "from-gold/15 to-amber-200/20",
      borderColor: "border-gold/25",
      hoverBorderColor: "hover:border-gold/35",
      iconColor: "text-gold",
    },
    {
      title: "Profil Instruktur",
      description: "Update informasi profil dan pengaturan",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: "/profil-instruktur",
      bgColor: "from-gray-50 to-silver/15",
      borderColor: "border-silver/25",
      hoverBorderColor: "hover:border-silver/35",
      iconColor: "text-silver",
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
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Akses fitur-fitur penting instruktur dengan mudah dan cepat</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`group block p-6 bg-gradient-to-br ${action.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${action.borderColor} ${action.hoverBorderColor} hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${action.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>{action.icon}</div>
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors duration-300">{action.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{action.description}</p>
                  <div className="mt-auto text-gold font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
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
