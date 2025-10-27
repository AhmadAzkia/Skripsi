"use client"; // -> Tandai sebagai Client Component

import { useState, useMemo } from "react";
import type { JadwalWithInstructor } from "../page";
import JadwalCard from "./JadwalCard";
import { ScrollReveal, AnimatedCounter } from "@/components/ui";
import Link from "next/link";

type FilterType = "semua" | "online" | "offline" | "gratis" | "berbayar";

interface JadwalContainerProps {
  initialJadwal: JadwalWithInstructor[];
}

export default function JadwalContainer({ initialJadwal }: JadwalContainerProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("semua");

  const filteredJadwal = useMemo(() => {
    if (activeFilter === "semua") return initialJadwal;
    if (activeFilter === "online") return initialJadwal.filter((j) => j.tipe_kursus === "online");
    if (activeFilter === "offline") return initialJadwal.filter((j) => j.tipe_kursus === "offline");
    if (activeFilter === "gratis") return initialJadwal.filter((j) => j.harga === 0);
    if (activeFilter === "berbayar") return initialJadwal.filter((j) => j.harga > 0);
    return initialJadwal;
  }, [activeFilter, initialJadwal]);

  // Statistik untuk AnimatedCounter
  const totalKursus = initialJadwal.length;
  const kursusOnline = initialJadwal.filter((j) => j.tipe_kursus === "online").length;
  const kursusGratis = initialJadwal.filter((j) => j.harga === 0).length;
  const instrukturUnik = new Set(initialJadwal.map((j) => j.profil_pengguna?.nama_lengkap).filter(Boolean)).size;

  const filterButtons: { label: string; filter: FilterType }[] = [
    { label: "Semua Program", filter: "semua" },
    { label: "Online", filter: "online" },
    { label: "Offline", filter: "offline" },
    { label: "Gratis", filter: "gratis" },
    { label: "Berbayar", filter: "berbayar" },
  ];

  return (
    <>
      {/* Hero Section dengan animasi */}
      <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-16 md:py-20 relative overflow-hidden">
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
                Jadwal <span className="text-gold">Pelatihan</span>
              </h1>
              <p className="text-xl md:text-2xl text-silver mb-8 max-w-3xl mx-auto text-pretty animate-slide-up">Temukan jadwal pelatihan terbaru dari PT. CertiGuardia Solusi. Pilih program yang sesuai dengan kebutuhan dan jadwal Anda.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
                <Link href="/daftar" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center hover-lift shadow-lg">
                  Daftar Sekarang
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
          </ScrollReveal>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="py-16 bg-linear-to-r from-gray-50 to-amber-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Statistik Pelatihan</h2>
              <p className="text-lg text-silver max-w-2xl mx-auto">Data terkini program pelatihan yang tersedia</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ScrollReveal delay={300}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
                <AnimatedCounter end={totalKursus} suffix="+" label="Total Program" duration={2000} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
                <AnimatedCounter end={kursusOnline} suffix="+" label="Program Online" duration={2200} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
                <AnimatedCounter end={kursusGratis} suffix="+" label="Program Gratis" duration={2400} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
                <AnimatedCounter end={instrukturUnik} suffix="+" label="Instruktur Expert" duration={2600} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Filter Section dengan animasi yang lebih menarik */}
      <ScrollReveal delay={100}>
        <section className="py-8 bg-linear-to-br from-amber-50 via-white to-gray-50">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {filterButtons.map((btn) => (
                <button
                  key={btn.filter}
                  onClick={() => setActiveFilter(btn.filter)}
                  className={`${
                    activeFilter === btn.filter ? "bg-gold text-navy shadow-lg scale-105" : "bg-white text-navy border border-silver/30 hover:border-gold/50"
                  } px-6 py-3 rounded-full font-medium hover:bg-gold/90 hover:text-navy transition-all duration-300 hover-lift`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Training Schedule Section dengan scroll reveal */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Jadwal Pelatihan Terbuka</h2>
              <p className="text-lg text-silver max-w-2xl mx-auto">Program pelatihan dengan jadwal tetap yang dapat diikuti oleh siapa saja</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJadwal.map((jadwal, index) => (
              <ScrollReveal key={jadwal.id} delay={300 + index * 100}>
                <JadwalCard jadwal={jadwal} />
              </ScrollReveal>
            ))}
          </div>

          {filteredJadwal.length === 0 && (
            <ScrollReveal delay={300}>
              <div className="text-center mt-12">
                <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.005-5.707-2.593M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Tidak ada jadwal yang sesuai dengan filter Anda</p>
                  <p className="text-gray-400 text-sm mt-2">Coba ubah filter atau kembali lagi nanti</p>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  );
}
