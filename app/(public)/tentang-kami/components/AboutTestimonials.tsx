"use client";

import { ScrollReveal } from "@/app/components/ui";
import { TestimonialCard } from "@/app/components/cards";

interface Testimonial {
  name: string;
  position: string;
  rating: number;
  testimonial: string;
}

interface AboutTestimonialsProps {
  testimonials: Testimonial[];
}

export default function AboutTestimonials({ testimonials }: AboutTestimonialsProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Testimoni <span className="text-gold">Alumni</span>
            </h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Cerita sukses dari para profesional yang telah bergabung dengan kami</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={100 + index * 100}>
              <TestimonialCard name={testimonial.name} position={testimonial.position} rating={testimonial.rating} testimonial={testimonial.testimonial} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
