"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { SessionUser } from "@/contexts/AuthContext";
import { useState } from "react";

interface ProfilHeroProps {
  user: SessionUser;
}

export default function ProfilHero({ user }: ProfilHeroProps) {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

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
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center text-navy text-2xl font-bold shadow-xl ring-4 ring-white/20">
                  {user.profile?.foto_profil_url ? <img src={user.profile.foto_profil_url} alt="Profile" className="w-full h-full rounded-full object-cover" /> : getInitials(user.profile?.nama_lengkap, user.email)}
                </div>
                <button
                  onClick={() => setIsEditingPhoto(true)}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gold hover:bg-gold/90 rounded-full flex items-center justify-center text-navy shadow-lg transition-all duration-300 hover:scale-110"
                  title="Ubah foto profil"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2">
              Profil <span className="text-gold">Saya</span>
            </h1>
            <p className="text-gold text-xl font-semibold mb-2">{user.profile?.nama_lengkap || user.email}</p>
            <p className="text-silver text-lg max-w-2xl mx-auto">Kelola informasi profil dan pengaturan akun Anda</p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-white text-sm">Status: Aktif</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
