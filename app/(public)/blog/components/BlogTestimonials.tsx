"use client";

import { ScrollReveal } from "@/components/ui";
import { TestimonialCard } from "@/components/cards";

export default function BlogTestimonials() {
  const testimonials = [
    {
      name: "Sarah Melissa",
      position: "HR Manager di Tech Corp",
      testimonial: "Artikel-artikel di CertiGuardia sangat membantu saya dalam mengembangkan strategi pengembangan karyawan. Kontennya selalu up-to-date dan praktis.",
      rating: 5,
    },
    {
      name: "Ahmad Rahman",
      position: "Software Engineer",
      testimonial: "Sebagai developer, saya sering membaca tips karir dan sertifikasi di sini. Informasinya sangat relevan dengan kebutuhan industri saat ini.",
      rating: 5,
    },
    {
      name: "Linda Sari",
      position: "Project Manager",
      testimonial: "Blog CertiGuardia menjadi referensi utama saya untuk update tren industri dan best practices dalam project management.",
      rating: 5,
    },
  ];

  return (
    <ScrollReveal delay={100}>
      <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Apa Kata <span className="text-gold">Pembaca Kami</span>
            </h2>
            <p className="text-xl text-silver max-w-2xl mx-auto">Testimoni dari para profesional yang telah mendapatkan manfaat dari artikel-artikel kami</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} name={testimonial.name} position={testimonial.position} testimonial={testimonial.testimonial} rating={testimonial.rating} />
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
