"use client";

import Link from "next/link";
import { ScrollReveal } from "@/app/components/ui";

interface BlogCategoriesProps {
  categories: string[];
}

export default function BlogCategories({ categories }: BlogCategoriesProps) {
  return (
    <ScrollReveal delay={100}>
      <section className="py-8 bg-gradient-to-br from-amber-50 via-white to-gray-50" id="artikel-terbaru">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Jelajahi Artikel</h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Pilih kategori untuk menemukan artikel yang sesuai dengan minat Anda</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog" className="bg-gold text-navy shadow-lg scale-105 px-6 py-3 rounded-full font-medium transition-all duration-300 hover-lift">
              Semua Artikel
            </Link>
            {categories.slice(0, 6).map((tag) => (
              <Link
                key={tag}
                href={`/blog?category=${encodeURIComponent(tag)}`}
                className="bg-white text-navy border border-silver/30 hover:border-gold/50 px-6 py-3 rounded-full font-medium hover:bg-gold/90 hover:text-navy transition-all duration-300 hover-lift"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
