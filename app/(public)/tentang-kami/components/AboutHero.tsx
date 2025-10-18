"use client";

import { ScrollReveal } from "@/components/ui";

export default function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-navy via-navy to-blue-900 py-16 md:py-20 relative overflow-hidden">
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
              Tentang <span className="text-gold">Kami</span>
            </h1>
            <p className="text-xl md:text-2xl text-silver mb-8 max-w-3xl mx-auto text-pretty animate-slide-up">
              PT. CertiGuardia Solusi adalah Tempat Uji Kompetensi (TUK) terpercaya yang berdedikasi untuk mengembangkan sumber daya manusia Indonesia melalui pelatihan dan sertifikasi profesional berkualitas tinggi.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
