"use client";

import ResetPasswordHero from "./ResetPasswordHero";
import ResetPasswordForm from "./ResetPasswordForm";
import { ScrollReveal } from "@/app/components/ui";

export default function ResetPasswordContainer() {
  return (
    <div className="relative w-full max-w-md">
      <ScrollReveal>
        <ResetPasswordHero />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <ResetPasswordForm />
      </ScrollReveal>
    </div>
  );
}
