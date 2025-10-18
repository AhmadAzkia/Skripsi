"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function HomeHero() {
  return (
    <section className="bg-gradient-to-br from-navy via-navy/95 to-navy/90 py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full animate-bounce-gentle" style={{ animationDelay: "2s" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-transparent to-gold/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,_rgba(212,175,55,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,_rgba(192,192,192,0.1)_0%,_transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <ScrollReveal>
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white-text mb-6 text-balance">
              PT. CertiGuardia <span className="text-gold">Solusi</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver mb-8 max-w-4xl mx-auto text-pretty leading-relaxed">
              Tempat Uji Kompetensi (TUK) terpercaya milik PT. CertiGuardia Solusi untuk mengembangkan keahlian profesional Anda dengan sertifikasi berkualitas tinggi yang diakui industri
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl group"
              >
                Daftar Sekarang
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/jadwal-pelatihan"
                className="border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/10 group"
              >
                Lihat Pelatihan
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
