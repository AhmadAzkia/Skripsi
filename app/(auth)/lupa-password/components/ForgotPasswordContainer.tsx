"use client";

import ForgotPasswordHero from "./ForgotPasswordHero";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { ScrollReveal } from "@/app/components/ui";
import Link from "next/link";

export default function ForgotPasswordContainer() {
  return (
    <div className="relative w-full max-w-md">
      <ScrollReveal>
        <ForgotPasswordHero />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <ForgotPasswordForm />
      </ScrollReveal>
      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center text-silver hover:text-gold transition-colors duration-300 group">
          <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}
