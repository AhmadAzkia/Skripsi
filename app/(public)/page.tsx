
import AnimatedCounter from "@/app/components/ui/AnimatedCounter";
import InteractiveCard from "@/app/components/cards/InteractiveCard";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import TestimonialCard from "@/app/components/cards/TestimonialCard";
import Link from "next/link";

export default function Home() {
  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-navy py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white-text mb-6 text-balance">
                PT. CertiGuardia <span className="text-gold">Solusi</span>
              </h1>
              <p className="text-xl md:text-2xl text-silver mb-8 max-w-4xl mx-auto text-pretty">
                Tempat Uji Kompetensi (TUK) terpercaya milik PT. CertiGuardia Solusi untuk mengembangkan keahlian profesional Anda dengan sertifikasi berkualitas tinggi yang diakui industri
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/daftar" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-4 rounded-md text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center">
                  Daftar Sekarang
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/pelatihan" className="border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive px-8 py-4 rounded-md text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center">
                  Lihat Pelatihan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-br from-amber-50 to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatedCounter end={1500} suffix="+" label="Peserta Tersertifikasi" />
                <AnimatedCounter end={25} suffix="+" label="Program Pelatihan" />
                <AnimatedCounter end={98} suffix="%" label="Tingkat Kepuasan" />
                <AnimatedCounter end={5} label="Tahun Pengalaman" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Mengapa Memilih PT. CertiGuardia Solusi?</h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              <ScrollReveal delay={100}>
                <div className="text-center hover-lift p-6 rounded-lg">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Sertifikasi Resmi</h3>
                  <p className="text-silver text-pretty">Sertifikat yang diakui industri dan memiliki legalitas resmi untuk meningkatkan karir Anda</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="text-center hover-lift p-6 rounded-lg">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Instruktur Berpengalaman</h3>
                  <p className="text-silver text-pretty">Dipandu oleh para ahli dan praktisi berpengalaman di bidangnya masing-masing</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="text-center hover-lift p-6 rounded-lg">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Materi Berkualitas</h3>
                  <p className="text-silver text-pretty">Kurikulum yang selalu update mengikuti perkembangan industri dan kebutuhan pasar</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Featured Training Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Pelatihan Unggulan</h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <ScrollReveal delay={100}>
                <InteractiveCard title="Digital Marketing Specialist" duration="4 Minggu" participants="150+ peserta" isOnline={true} isFree={true} href="/pelatihan/digital-marketing" />
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <InteractiveCard title="Project Management Professional" duration="6 Minggu" participants="50+ peserta" price="Rp 2.500.000" isOnline={false} href="/pelatihan/project-management" />
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <InteractiveCard title="Data Analysis Fundamentals" duration="3 Minggu" participants="200+ peserta" isOnline={true} isFree={true} href="/pelatihan/data-analysis" />
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <div className="text-center">
                <Link href="/pelatihan" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-3 rounded-md font-semibold transition-all duration-300 inline-flex items-center">
                  Lihat Semua Pelatihan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Testimoni Peserta</h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ScrollReveal delay={100}>
                <TestimonialCard
                  name="Sarah Wijaya"
                  position="Marketing Manager"
                  rating={5}
                  testimonial="Pelatihan digital marketing di CertiGuardia sangat komprehensif dan praktis. Sertifikat yang saya dapatkan membantu saya mendapat promosi di kantor."
                />
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <TestimonialCard name="Ahmad Rizki" position="Project Coordinator" rating={5} testimonial="Instruktur sangat berpengalaman dan materi yang diberikan sangat relevan dengan kebutuhan industri saat ini. Highly recommended!" />
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
  );
}
