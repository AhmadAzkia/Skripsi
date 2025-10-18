"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui";

export default function AboutCTA() {
  return (
    <ScrollReveal>
      <section className="py-16 bg-gradient-to-br from-navy via-navy to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white-text mb-4">
              Bergabunglah dengan <span className="text-gold">Ribuan Alumni</span>
            </h2>
            <p className="text-lg text-silver mb-8 max-w-2xl mx-auto">Mulai perjalanan pengembangan karir Anda bersama PT. CertiGuardia Solusi. Raih sertifikasi profesional yang diakui industri.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jadwal-pelatihan" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center hover-lift shadow-lg">
                Lihat Jadwal Pelatihan
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Link>
              <Link
                href="/konsultasi"
                className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
              >
                Konsultasi Gratis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
