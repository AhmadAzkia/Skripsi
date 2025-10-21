"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { SessionUser } from "@/contexts/AuthContext";

interface DashboardHeroProps {
  user: SessionUser;
}

export default function DashboardHero({ user }: DashboardHeroProps) {
  // Debug: Log user data structure
  console.log("DashboardHero - User data:", user);
  console.log("DashboardHero - User profile:", user.profile);
  console.log("DashboardHero - nama_lengkap:", user.profile?.nama_lengkap);

  const currentHour = new Date().getHours();
  let greeting = "Selamat Pagi";

  if (currentHour >= 12 && currentHour < 15) {
    greeting = "Selamat Siang";
  } else if (currentHour >= 15 && currentHour < 18) {
    greeting = "Selamat Sore";
  } else if (currentHour >= 18 || currentHour < 6) {
    greeting = "Selamat Malam";
  }

  return (
    <section className="bg-gradient-to-br from-navy via-navy to-blue-900 py-12 md:py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full animate-bounce-gentle" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2">
                {greeting}, <span className="text-gold">{user.profile?.nama_lengkap || user.email?.split("@")[0] || "User"}</span>!
              </h1>
              <p className="text-silver text-lg max-w-2xl">Selamat datang di dashboard pembelajaran Anda. Mari lanjutkan perjalanan pengembangan keahlian profesional Anda.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold mb-1">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-silver text-sm">
                  {new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
