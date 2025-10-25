"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { SessionUser } from "@/contexts/AuthContext";

interface BlogPemateriHeroProps {
  user: SessionUser;
}

export default function BlogPemateriHero({ user }: BlogPemateriHeroProps) {
  const currentHour = new Date().getHours();
  let greeting = "Selamat Pagi";

  if (currentHour >= 12 && currentHour < 15) {
    greeting = "Selamat Siang";
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = "Selamat Sore";
  } else if (currentHour >= 18 || currentHour < 6) {
    greeting = "Selamat Malam";
  }

  return (
    <section className="bg-gradient-to-br from-navy via-navy to-blue-900 py-12 md:py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full animate-bounce-gentle" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {greeting}, <span className="text-gold">{user.profile?.nama_lengkap || user.email}</span>!
              </h1>
              <p className="text-silver text-lg max-w-2xl">Kelola blog dan artikel Anda. Bagikan pengetahuan dan inspirasi melalui tulisan yang bermakna.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="text-center">
                <h3 className="text-gold text-lg font-semibold mb-2">Tip Menulis Hari Ini</h3>
                <p className="text-silver text-sm leading-relaxed">"Tulisan yang baik dimulai dari ide yang jelas dan hati yang tulus. Bagikan pengalaman Anda untuk menginspirasi orang lain."</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <div className="w-2 h-2 bg-silver rounded-full"></div>
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Kelola <span className="text-gold">Blog</span> Anda
            </h2>
            <p className="text-silver text-lg mb-8 max-w-3xl mx-auto">Platform lengkap untuk mengelola konten blog, dari menulis artikel baru hingga menganalisis performa tulisan Anda</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-navy rounded-lg hover:from-gold/90 hover:to-yellow-500/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tulis Artikel Baru
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-navy transition-all duration-300 rounded-lg transform hover:-translate-y-1 font-semibold">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Lihat Statistik
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
