"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import TestimonialCard from "@/components/cards/TestimonialCard";

const testimonials = [
  {
    name: "Sarah Wijaya",
    position: "Marketing Manager",
    rating: 5,
    testimonial: "Pelatihan digital marketing di CertiGuardia sangat komprehensif dan praktis. Sertifikat yang saya dapatkan membantu saya mendapat promosi di kantor.",
  },
  {
    name: "Ahmad Rizki",
    position: "Project Coordinator",
    rating: 5,
    testimonial: "Instruktur sangat berpengalaman dan materi yang diberikan sangat relevan dengan kebutuhan industri saat ini. Highly recommended!",
  },
];

export default function HomeTestimonials() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-navy via-gold to-silver rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-br from-gold via-silver to-navy rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Testimoni <span className="text-gold">Peserta</span>
            </h2>
            <p className="text-silver text-lg max-w-2xl mx-auto">Kepuasan dan kesuksesan peserta adalah prioritas utama kami dalam setiap program pelatihan</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={(index + 1) * 100}>
              <TestimonialCard name={testimonial.name} position={testimonial.position} rating={testimonial.rating} testimonial={testimonial.testimonial} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-linear-to-r from-gold/10 to-gold/5 rounded-full border border-gold/20">
              <span className="text-gold font-medium">Bergabunglah dengan ribuan profesional lainnya</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
