"use client";

import { ScrollReveal, AnimatedCounter } from "@/app/components/ui";

interface BlogStatsProps {
  totalPosts: number;
  totalCategories: number;
  activeReaders: number;
  satisfactionRating: number;
}

export default function BlogStats({ totalPosts, totalCategories, activeReaders, satisfactionRating }: BlogStatsProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-amber-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={200}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Statistik Blog</h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Data terkini konten dan pembaca blog kami</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <ScrollReveal delay={300}>
            <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
              <AnimatedCounter end={totalPosts} label="Total Artikel" suffix="+" duration={1500} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
              <AnimatedCounter end={totalCategories} label="Kategori Topik" duration={1800} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
              <AnimatedCounter end={activeReaders} label="Pembaca Aktif" suffix="K+" duration={2000} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <div className="bg-white p-6 rounded-xl shadow-lg hover-lift hover-glow border border-gold/20">
              <AnimatedCounter end={satisfactionRating} label="Rating Kepuasan" suffix="%" duration={2200} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
