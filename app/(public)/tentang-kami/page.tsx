
import AnimatedCounter from "@/app/components/ui/AnimatedCounter";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import TestimonialCard from "@/app/components/cards/TestimonialCard";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - PT. CertiGuardia Solusi",
  description: "Pelajari lebih lanjut tentang PT. CertiGuardia Solusi, Tempat Uji Kompetensi terpercaya dengan pengalaman 5 tahun dalam memberikan pelatihan dan sertifikasi profesional.",
};

export default function TentangKamiPage() {
  const teamMembers = [
    {
      name: "Dr. Bambang Setiawan",
      position: "Direktur Utama",
      experience: "15 tahun",
      education: "Ph.D. Manajemen Bisnis",
      image: "/img/team-1.jpg",
    },
    {
      name: "Sarah Wijaya, M.M.",
      position: "Direktur Akademik",
      experience: "12 tahun",
      education: "Master Manajemen, PMP Certified",
      image: "/img/team-2.jpg",
    },
    {
      name: "Ahmad Rizki, M.Kom.",
      position: "Head of Technology",
      experience: "10 tahun",
      education: "Master Komputer, CISSP",
      image: "/img/team-3.jpg",
    },
    {
      name: "Maya Sari, S.Psi.",
      position: "Head of HR & Development",
      experience: "8 tahun",
      education: "Sarjana Psikologi, CHRP",
      image: "/img/team-4.jpg",
    },
  ];

  const achievements = [
    {
      icon: "🏆",
      title: "Sertifikasi BNSP",
      description: "Terakreditasi sebagai Tempat Uji Kompetensi (TUK) oleh Badan Nasional Sertifikasi Profesi",
    },
    {
      icon: "🎓",
      title: "ISO 9001:2015",
      description: "Sistem manajemen mutu yang diakui internasional untuk layanan pelatihan profesional",
    },
    {
      icon: "🤝",
      title: "Partnership",
      description: "Bermitra dengan 50+ perusahaan dan institusi untuk program pelatihan korporat",
    },
    {
      icon: "⭐",
      title: "Excellence Award",
      description: "Penghargaan Best Training Provider 2023 dari Indonesia Training Association",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-navy py-16 md:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white-text mb-6 text-balance">
                Tentang <span className="text-gold">Kami</span>
              </h1>
              <p className="text-xl md:text-2xl text-silver mb-8 max-w-4xl mx-auto text-pretty">
                PT. CertiGuardia Solusi adalah Tempat Uji Kompetensi (TUK) terpercaya yang berdedikasi untuk mengembangkan sumber daya manusia Indonesia melalui pelatihan dan sertifikasi profesional berkualitas tinggi.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                  Perjalanan <span className="text-gold">Kami</span>
                </h2>
                <div className="space-y-4 text-silver">
                  <p className="text-pretty">
                    Didirikan pada tahun 2019, PT. CertiGuardia Solusi hadir sebagai respons terhadap kebutuhan akan lembaga pelatihan yang dapat memberikan sertifikasi berkualitas dan diakui industri. Kami memulai perjalanan dengan visi
                    sederhana namun mulia: membantu profesional Indonesia meningkatkan kompetensi mereka.
                  </p>
                  <p className="text-pretty">
                    Selama 5 tahun perjalanan kami, PT. CertiGuardia Solusi telah berkembang menjadi salah satu Tempat Uji Kompetensi (TUK) terpercaya di Indonesia. Kami telah melayani lebih dari 1.500 peserta dari berbagai latar belakang
                    profesi dan berhasil membantu mereka mencapai sertifikasi yang dibutuhkan untuk kemajuan karir.
                  </p>
                  <p className="text-pretty">
                    Komitmen kami tidak hanya pada kualitas pelatihan, tetapi juga pada inovasi pembelajaran yang mengikuti perkembangan teknologi dan kebutuhan industri. Dengan tim instruktur berpengalaman dan kurikulum yang selalu
                    diperbarui, kami memastikan setiap peserta mendapatkan pembelajaran yang relevan dan aplikatif.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-50 to-gray-50 rounded-lg p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <AnimatedCounter end={2019} label="Tahun Berdiri" />
                    <AnimatedCounter end={1500} suffix="+" label="Alumni" />
                    <AnimatedCounter end={25} suffix="+" label="Program" />
                    <AnimatedCounter end={98} suffix="%" label="Kepuasan" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision Mission Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Visi & Misi</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-lg p-8 hover-lift transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-4">Visi</h3>
                </div>
                <p className="text-silver text-center text-pretty">
                  Menjadi Tempat Uji Kompetensi (TUK) terdepan di Indonesia yang berperan aktif dalam mengembangkan sumber daya manusia berkualitas dan bersertifikat untuk mendukung kemajuan bangsa.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-white rounded-lg p-8 hover-lift transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-4">Misi</h3>
                </div>
                <ul className="text-silver space-y-2 text-pretty">
                  <li>• Memberikan pelatihan berkualitas tinggi dengan standar internasional</li>
                  <li>• Mengembangkan kurikulum yang relevan dengan kebutuhan industri</li>
                  <li>• Memfasilitasi sertifikasi profesi yang diakui secara nasional</li>
                  <li>• Membangun ekosistem pembelajaran yang berkelanjutan</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Tim <span className="text-gold">Profesional</span>
              </h2>
              <p className="text-lg text-silver max-w-2xl mx-auto">Tim berpengalaman yang berdedikasi untuk memberikan layanan terbaik</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white rounded-lg border border-silver/20 hover-lift hover-glow transition-all duration-300 p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-gold/20 to-silver/20 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{member.name}</h3>
                  <p className="text-gold font-medium mb-2">{member.position}</p>
                  <p className="text-sm text-silver mb-1">{member.education}</p>
                  <p className="text-sm text-silver">Pengalaman: {member.experience}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Pencapaian & <span className="text-gold">Sertifikasi</span>
              </h2>
              <p className="text-lg text-silver max-w-2xl mx-auto">Pengakuan dan sertifikasi yang membuktikan kualitas layanan kami</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white rounded-lg p-6 text-center hover-lift transition-all duration-300">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="text-lg font-bold text-navy mb-3">{achievement.title}</h3>
                  <p className="text-sm text-silver text-pretty">{achievement.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Testimoni <span className="text-gold">Alumni</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ScrollReveal delay={100}>
              <TestimonialCard
                name="Budi Santoso"
                position="IT Manager, PT. Teknologi Maju"
                rating={5}
                testimonial="Pelatihan di CertiGuardia sangat profesional dan materi yang diberikan sangat aplikatif. Sertifikat yang saya peroleh membantu meningkatkan kredibilitas di perusahaan."
              />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <TestimonialCard
                name="Linda Kusuma"
                position="Marketing Director, CV. Kreatif Solusi"
                rating={5}
                testimonial="Instruktur berpengalaman dan metode pembelajaran yang interaktif membuat saya mudah memahami materi. Highly recommended untuk profesional yang ingin upgrade skill!"
              />
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <TestimonialCard
                name="Eko Prasetyo"
                position="Project Manager, PT. Inovasi Digital"
                rating={5}
                testimonial="Fasilitas lengkap, kurikulum up-to-date, dan networking yang baik. CertiGuardia benar-benar membantu saya mencapai target karir yang diimpikan."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white-text mb-4">
                Bergabunglah dengan <span className="text-gold">Ribuan Alumni</span>
              </h2>
              <p className="text-lg text-silver mb-8 max-w-2xl mx-auto">Mulai perjalanan pengembangan karir Anda bersama PT. CertiGuardia Solusi. Raih sertifikasi profesional yang diakui industri.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jadwal-pelatihan" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-3 rounded-md text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center">
                  Lihat Jadwal Pelatihan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
                <Link
                  href="/konsultasi"
                  className="border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive px-8 py-3 rounded-md text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
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
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
