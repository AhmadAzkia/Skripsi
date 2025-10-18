"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui";

interface BlogPopularTagsProps {
  tags: string[];
}

export default function BlogPopularTags({ tags }: BlogPopularTagsProps) {
  return (
    <ScrollReveal delay={500}>
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Topik <span className="text-gold">Populer</span>
            </h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Jelajahi artikel berdasarkan kategori yang paling diminati pembaca</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {tags.slice(0, 12).map((tag, index) => (
              <ScrollReveal key={tag} delay={600 + index * 50}>
                <Link
                  href={`/blog?category=${encodeURIComponent(tag)}`}
                  className="bg-white hover:bg-gold/10 hover:text-gold text-navy px-6 py-3 rounded-full font-medium transition-all duration-300 hover-lift border-2 border-transparent hover:border-gold/20 shadow-md hover:shadow-lg"
                >
                  #{tag}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
