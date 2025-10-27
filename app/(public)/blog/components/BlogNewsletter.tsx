"use client";

import { ScrollReveal } from "@/components/ui";

export default function BlogNewsletter() {
  return (
    <ScrollReveal delay={400}>
      <section className="py-16 bg-linear-to-br from-amber-50 to-orange-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gold/20">
              <div className="text-gold mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Dapatkan <span className="text-gold">Update Terbaru</span>
              </h2>
              <p className="text-lg text-silver mb-8">Berlangganan newsletter kami dan jangan lewatkan artikel terbaru seputar pengembangan karir dan sertifikasi profesional</p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Masukkan email Anda" className="flex-1 px-4 py-3 rounded-lg border border-silver/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-300" />
                <button className="bg-gold hover:bg-gold/90 text-navy px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-lift shadow-lg">Berlangganan</button>
              </div>

              <p className="text-sm text-silver mt-4">* Kami menghormati privasi Anda dan tidak akan membagikan email Anda kepada pihak ketiga</p>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
