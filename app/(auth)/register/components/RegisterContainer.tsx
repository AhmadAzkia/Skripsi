"use client";

import RegisterForm from "./RegisterForm";
import RegisterHero from "./RegisterHero";
import { ScrollReveal } from "@/app/components/ui";

export default function RegisterContainer() {
  return (
    <div className="relative w-full max-w-md">
      <ScrollReveal>
        <RegisterHero />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <RegisterForm />
      </ScrollReveal>
    </div>
  );
}
