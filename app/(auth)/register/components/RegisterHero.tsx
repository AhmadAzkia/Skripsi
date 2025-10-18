"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegisterHero() {
  return (
    <div className="text-center mb-8">
      {/* Logo and Header */}
      <div className="flex justify-center mb-6">
        <div className="relative w-20 h-20 bg-white rounded-2xl p-3 shadow-2xl hover-lift">
          <Image src="/CertiGuardia.png" alt="CertiGuardia Logo" fill className="object-contain" priority />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2 animate-fade-in">
        Daftar <span className="text-gold">Akun</span>
      </h1>
      <p className="text-silver animate-slide-up mb-6">Bergabunglah dengan ribuan profesional lainnya dan tingkatkan karir Anda</p>

      {/* Back to Home */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-silver hover:text-gold transition-colors duration-300 group">
          <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
