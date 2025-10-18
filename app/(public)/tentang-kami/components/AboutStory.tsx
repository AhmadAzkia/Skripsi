"use client";

import { ScrollReveal, AnimatedCounter } from "@/app/components/ui";

interface AboutStoryProps {
  foundingYear: number;
  totalAlumni: number;
  totalPrograms: number;
  satisfactionRate: number;
}

export default function AboutStory({ foundingYear, totalAlumni, totalPrograms, satisfactionRate }: AboutStoryProps) {
  return (
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
                  Sebagai perwujudan dari visi "Menjadi garda terdepan dalam menjaga dan meningkatkan kualitas kompetensi profesional di Indonesia melalui layanan sertifikasi yang tepercaya dan inovatif", PT CertiGuardia Solusi adalah
                  bisnis Tempat Uji Kompetensi (TUK) yang beroperasi sebagai jembatan strategis antara Lembaga Sertifikasi Profesi (LSP) dan industri.
                </p>
                <p className="text-pretty">
                  Kami berpegang pada misi untuk menyediakan layanan uji kompetensi yang profesional dan akuntabel dengan mengoperasikan model bisnis TUK Sewaktu. Ini memungkinkan kami menekan biaya operasional dan berfokus pada integrasi
                  teknologi terkini, seperti platform digital untuk pelatihan dan administrasi.
                </p>
                <p className="text-pretty">
                  Fokus utama kami adalah penyaluran tenaga kerja sebagai bagian dari misi pengembangan sumber daya manusia yang kompeten dan berdaya saing global. Kami mengatasi kesenjangan antara pekerja bersertifikasi dan kebutuhan
                  industri dengan bermitra erat dengan LSP, mewujudkan misi membangun kemitraan strategis yang kuat. Dengan ini, kami memastikan lulusan dari LSP kami terhubung langsung dengan peluang kerja, menciptakan siklus yang
                  menguntungkan bagi semua pihak.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="relative">
              <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl p-8 shadow-lg border border-gold/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-md hover-lift">
                    <AnimatedCounter end={foundingYear} label="Tahun Berdiri" duration={1500} />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md hover-lift">
                    <AnimatedCounter end={totalAlumni} suffix="+" label="Alumni" duration={1800} />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md hover-lift">
                    <AnimatedCounter end={totalPrograms} suffix="+" label="Program" duration={2000} />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md hover-lift">
                    <AnimatedCounter end={satisfactionRate} suffix="%" label="Kepuasan" duration={2200} />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
