"use client";

import { ScrollReveal } from "@/components/ui";

export default function AboutVisionMission() {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-amber-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Visi & <span className="text-gold">Misi</span>
            </h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Landasan dan arah yang memandu setiap langkah kami dalam mengembangkan sumber daya manusia Indonesia</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-xl p-8 hover-lift hover-glow transition-all duration-300 shadow-lg border border-gold/20">
              <div className="text-center mb-6">
                <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4">Visi</h3>
              </div>
              <p className="text-silver text-center text-pretty">Menjadi garda terdepan dalam menjaga dan meningkatkan kualitas kompetensi profesional di Indonesia melalui layanan sertifikasi yang tepercaya dan inovatif.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-white rounded-xl p-8 hover-lift hover-glow transition-all duration-300 shadow-lg border border-gold/20">
              <div className="text-center mb-6">
                <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4">Misi</h3>
              </div>
              <ul className="text-silver space-y-3 text-pretty">
                <li className="flex items-start">
                  <span className="text-gold mr-3 mt-1">•</span>
                  Menyediakan layanan uji kompetensi yang profesional, akuntabel, dan berintegritas tinggi sesuai dengan standar nasional dan internasional.
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3 mt-1">•</span>
                  Berperan aktif dalam pengembangan sumber daya manusia yang kompeten dan berdaya saing global.
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3 mt-1">•</span>
                  Membangun kemitraan strategis dengan berbagai lembaga pendidikan, industri, dan pemerintah untuk mendukung ekosistem sertifikasi yang kuat.
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3 mt-1">•</span>
                  Mengintegrasikan teknologi terkini untuk menciptakan proses sertifikasi yang efisien, transparan, dan mudah diakses oleh seluruh masyarakat.
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
