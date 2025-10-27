"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui";

export default function BlogHero() {
  return (
    <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-16 md:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full animate-bounce-gentle" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white-text mb-6 text-balance animate-fade-in">
              Blog & <span className="text-gold">Artikel</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver mb-8 max-w-3xl mx-auto text-pretty animate-slide-up">
              Temukan wawasan terbaru tentang pengembangan karir, tips profesional, dan tren industri yang akan membantu Anda mencapai kesuksesan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link href="#artikel-terbaru" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center hover-lift shadow-lg">
                Jelajahi Artikel
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
              <Link
                href="/jadwal-pelatihan"
                className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
              >
                Lihat Pelatihan
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
