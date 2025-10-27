"use client";

import { ScrollReveal } from "@/components/ui";

interface TeamMember {
  name: string;
  position: string;
  experience: string;
  education: string;
  image: string;
}

interface AboutTeamProps {
  teamMembers: TeamMember[];
}

export default function AboutTeam({ teamMembers }: AboutTeamProps) {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Tim <span className="text-gold">Profesional</span>
            </h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Tim berpengalaman yang berdedikasi untuk memberikan layanan terbaik</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-white rounded-xl border border-silver/20 hover-lift hover-glow transition-all duration-300 p-6 text-center shadow-lg">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 bg-linear-to-br from-gold/20 to-silver/20 rounded-full flex items-center justify-center border-2 border-gold/20">
                    <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{member.name}</h3>
                <p className="text-gold font-medium mb-2">{member.position}</p>
                <div className="space-y-1">
                  <p className="text-sm text-silver">{member.education}</p>
                  <p className="text-sm text-silver">Pengalaman: {member.experience}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
