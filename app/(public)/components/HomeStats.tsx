"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function HomeStats() {
  return (
    <section className="py-16 bg-linear-to-br from-amber-50 to-gray-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-silver rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Pencapaian <span className="text-gold">Kami</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Kepercayaan ribuan peserta dan komitmen terhadap kualitas pelatihan profesional</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gold/30">
              <AnimatedCounter end={1500} suffix="+" label="Peserta Tersertifikasi" />
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gold/30">
              <AnimatedCounter end={25} suffix="+" label="Program Pelatihan" />
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gold/30">
              <AnimatedCounter end={98} suffix="%" label="Tingkat Kepuasan" />
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gold/30">
              <AnimatedCounter end={5} label="Tahun Pengalaman" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
