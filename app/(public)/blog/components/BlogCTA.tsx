"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui";

export default function BlogCTA() {
  return (
    <ScrollReveal delay={600}>
      <section className="py-16 bg-gradient-to-br from-navy via-navy to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white-text mb-6">
              Siap Mengembangkan <span className="text-gold">Karir Anda?</span>
            </h2>
            <p className="text-xl text-silver mb-8 max-w-2xl mx-auto">Bergabunglah dengan ribuan profesional yang telah meningkatkan karir mereka melalui sertifikasi dan pelatihan berkualitas</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jadwal-pelatihan" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center hover-lift shadow-lg">
                Lihat Jadwal Pelatihan
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/tentang-kami"
                className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
