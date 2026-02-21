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
    </div>
  );
}
