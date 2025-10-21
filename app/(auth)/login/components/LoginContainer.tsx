"use client";

import LoginHero from "./LoginHero";
import LoginForm from "./LoginForm";
import { ScrollReveal } from "@/components/ui";
import Link from "next/link";

export default function LoginContainer() {
  return (
    <div className="relative w-full max-w-md">
      <ScrollReveal>
        <LoginHero />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <LoginForm />
      </ScrollReveal>
      {/* Back to Home */}
      <div className="mt-6 text-center">
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
