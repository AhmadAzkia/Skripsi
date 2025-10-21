"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";

export default function TermsConditionsHero() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <ScrollReveal>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-6">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white-text mb-6">
            Syarat & <span className="text-gold">Ketentuan</span>
          </h1>
          <p className="text-xl md:text-2xl text-silver mb-8 max-w-3xl mx-auto leading-relaxed">Ketentuan penggunaan layanan pelatihan dan platform PT. CertiGuardia Solusi yang perlu Anda pahami dan setujui</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#content" className="bg-gold hover:bg-gold/90 text-navy px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg group scroll-smooth">
              Baca Ketentuan
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
              </svg>
            </Link>
            <Link
              href="/kebijakan-privasi"
              className="border-2 border-gold text-gold hover:bg-gold hover:text-navy px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm bg-white/10"
            >
              Lihat Kebijakan Privasi
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-12 text-center">
            <p className="text-silver/80 text-sm">
              Terakhir diperbarui: <span className="text-gold font-medium">18 Oktober 2025</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
