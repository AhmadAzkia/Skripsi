"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import InteractiveCard from "@/components/cards/InteractiveCard";
import Link from "next/link";
import { Tables } from "@/../types/database";

type KursusFeatured = Tables<"kursus">;

interface HomeFeaturedCoursesProps {
  featuredCourses: KursusFeatured[];
}

export default function HomeFeaturedCourses({ featuredCourses }: HomeFeaturedCoursesProps) {
  return (
    <section className="py-16 bg-linear-to-br from-gray-50 via-white to-gray-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-linear-to-br from-gold to-navy rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-linear-to-br from-silver to-gold rounded-full"></div>
        <div className="absolute top-3/4 left-3/4 w-16 h-16 bg-linear-to-br from-navy to-silver rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Pelatihan <span className="text-gold">Unggulan</span>
            </h2>
            <p className="text-silver text-lg max-w-2xl mx-auto">Program pelatihan terpopuler dengan sertifikasi profesional yang diakui industri</p>
          </div>
        </ScrollReveal>

        {featuredCourses.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {featuredCourses.map((course, index) => (
                <ScrollReveal key={course.id} delay={(index + 1) * 100}>
                  <InteractiveCard
                    id={course.id}
                    title={course.judul}
                    participants={`Maks. ${course.maksimal_peserta || "N/A"} Peserta`}
                    isOnline={course.tipe_kursus === "online" || course.tipe_kursus === "hybrid"}
                    price={course.harga}
                    href={`/kursus/${course.id}`}
                  />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={400}>
              <div className="text-center">
                <Link
                  href="/jadwal-pelatihan"
                  className="group bg-linear-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-navy btn-interactive px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  Lihat Semua Pelatihan
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </>
        ) : (
          <ScrollReveal>
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">Belum Ada Pelatihan Unggulan</h3>
              <p className="text-silver mb-6">Pelatihan unggulan akan segera hadir. Pantau terus untuk update terbaru!</p>
              <Link href="/jadwal-pelatihan" className="text-gold hover:text-gold/80 transition-colors font-medium">
                Lihat Jadwal Pelatihan →
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
