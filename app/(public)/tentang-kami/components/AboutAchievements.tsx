"use client";

import { ScrollReveal } from "@/components/ui";

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

interface AboutAchievementsProps {
  achievements: Achievement[];
}

export default function AboutAchievements({ achievements }: AboutAchievementsProps) {
  return (
    <section className="py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Pencapaian & <span className="text-gold">Sertifikasi</span>
            </h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Pengakuan dan sertifikasi yang membuktikan kualitas layanan kami</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-white rounded-xl p-6 text-center hover-lift hover-glow transition-all duration-300 shadow-lg border border-gold/20">
                <div className="text-4xl mb-4 bg-linear-to-r from-gold/10 to-amber/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">{achievement.icon}</div>
                <h3 className="text-lg font-bold text-navy mb-3">{achievement.title}</h3>
                <p className="text-sm text-silver text-pretty">{achievement.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
