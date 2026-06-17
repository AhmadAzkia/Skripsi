"use client";

import RegisterForm from "./RegisterForm";
import RegisterHero from "./RegisterHero";
import { ScrollReveal } from "@/components/ui";
import Link from "next/link";

export default function RegisterContainer() {
  return (
    <div className="relative w-full max-w-md">
      <ScrollReveal>
        <RegisterHero />
      </ScrollReveal>

      {/* Under Development Banner
      <div className="mt-10 mb-6">
        <div className="bg-navy/50 backdrop-blur-sm border border-gold/20 rounded-xl p-8 shadow-lg">

          <div className="flex justify-center mb-4">
            <div className="bg-gold/10 rounded-full p-4">
              <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>


          <h2 className="text-2xl font-bold text-white text-center mb-3">Sedang Dalam Pengembangan</h2>

          <p className="text-silver text-center mb-6 leading-relaxed">
            Fitur registrasi saat ini sedang dalam tahap pengembangan.
            <br />
            Kami bekerja keras untuk memberikan pengalaman terbaik untuk Anda.
          </p>


          <div className="flex justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>*/}

      {/* Back to Home */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center text-silver hover:text-gold transition-colors duration-300 group">
          <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
      <ScrollReveal delay={200}>
        <RegisterForm />
      </ScrollReveal>
    </div>
  );
}
