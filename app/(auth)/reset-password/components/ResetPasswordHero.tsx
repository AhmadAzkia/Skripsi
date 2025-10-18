"use client";

import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordHero() {
  return (
    <div className="text-center mb-8">
      {/* Logo and Header */}
      <div className="flex justify-center mb-6">
        <div className="relative w-20 h-20 bg-white rounded-2xl p-3 shadow-2xl">
          <Image src="/img/CertiGuardia.png" alt="CertiGuardia Logo" fill className="object-contain" priority />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white-text mb-2 animate-fade-in">
        Buat Password <span className="text-gold">Baru</span>
      </h1>
      <p className="text-silver animate-slide-up mb-6">Masukkan password baru untuk akun Anda</p>

      {/* Security Info */}
      <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-gold text-sm font-medium">Keamanan Password</span>
        </div>
        <p className="text-silver/90 text-xs leading-relaxed">Gunakan minimal 6 karakter dengan kombinasi huruf, angka, dan simbol untuk keamanan optimal</p>
      </div>
    </div>
  );
}
