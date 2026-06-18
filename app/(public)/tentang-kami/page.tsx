// app/(public)/tentang-kami/page.tsx

import { Metadata } from "next";
import { AboutHero, AboutStory, AboutVisionMission, AboutTeam, AboutAchievements, AboutTestimonials, AboutCTA } from "./components";

export const metadata: Metadata = {
  title: "Tentang Kami - PT. CertiGuardia Solusi",
  description: "Pelajari lebih lanjut tentang PT. CertiGuardia Solusi, Tempat Uji Kompetensi terpercaya dengan pengalaman 5 tahun dalam memberikan pelatihan dan sertifikasi profesional.",
};

// Types
interface TeamMember {
  name: string;
  position: string;
  experience: string;
  education: string;
  image: string;
}

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  position: string;
  rating: number;
  testimonial: string;
}

export default function TentangKamiPage() {
  // Static data - could be moved to a separate data file or fetched from API
  const teamMembers: TeamMember[] = [
    {
      name: "Dr. Bambang Setiawan",
      position: "Direktur Utama",
      experience: "15 tahun",
      education: "Ph.D. Manajemen Bisnis",
      image: "/img/team-1.jpg",
    },
    {
      name: "Sarah Wijaya, M.M.",
      position: "Direktur Akademik",
      experience: "12 tahun",
      education: "Master Manajemen, PMP Certified",
      image: "/img/team-2.jpg",
    },
    {
      name: "Ahmad Rizki, M.Kom.",
      position: "Head of Technology",
      experience: "10 tahun",
      education: "Master Komputer, CISSP",
      image: "/img/team-3.jpg",
    },
    {
      name: "Maya Sari, S.Psi.",
      position: "Head of HR & Development",
      experience: "8 tahun",
      education: "Sarjana Psikologi, CHRP",
      image: "/img/team-4.jpg",
    },
  ];

  const achievements: Achievement[] = [
    {
      icon: "🏆",
      title: "Sertifikasi BNSP",
      description: "Terakreditasi sebagai Tempat Uji Kompetensi (TUK) oleh Badan Nasional Sertifikasi Profesi",
    },
    {
      icon: "🎓",
      title: "ISO 9001:2015",
      description: "Sistem manajemen mutu yang diakui internasional untuk layanan pelatihan profesional",
    },
    {
      icon: "🤝",
      title: "Partnership",
      description: "Bermitra dengan 50+ perusahaan dan institusi untuk program pelatihan korporat",
    },
    {
      icon: "⭐",
      title: "Excellence Award",
      description: "Penghargaan Best Training Provider 2023 dari Indonesia Training Association",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Budi Santoso",
      position: "IT Manager, PT. Teknologi Maju",
      rating: 5,
      testimonial: "Pelatihan di CertiGuardia sangat profesional dan materi yang diberikan sangat aplikatif. Sertifikat yang saya peroleh membantu meningkatkan kredibilitas di perusahaan.",
    },
    {
      name: "Linda Kusuma",
      position: "Marketing Director, CV. Kreatif Solusi",
      rating: 5,
      testimonial: "Pelatihan berpengalaman dan metode pembelajaran yang interaktif membuat saya mudah memahami materi. Highly recommended untuk profesional yang ingin upgrade skill!",
    },
    {
      name: "Eko Prasetyo",
      position: "Project Manager, PT. Inovasi Digital",
      rating: 5,
      testimonial: "Fasilitas lengkap, kurikulum up-to-date, dan networking yang baik. CertiGuardia benar-benar membantu saya mencapai target karir yang diimpikan.",
    },
  ];

  // Company statistics
  const stats = {
    foundingYear: 2019,
    totalAlumni: 1500,
    totalPrograms: 25,
    satisfactionRate: 98,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AboutHero />

      {/* Company Story Section */}
      <AboutStory foundingYear={stats.foundingYear} totalAlumni={stats.totalAlumni} totalPrograms={stats.totalPrograms} satisfactionRate={stats.satisfactionRate} />

      {/* Vision Mission Section */}
      <AboutVisionMission />

      {/* Team Section */}
      <AboutTeam teamMembers={teamMembers} />

      {/* Achievements Section */}
      <AboutAchievements achievements={achievements} />

      {/* Testimonials Section */}
      <AboutTestimonials testimonials={testimonials} />

      {/* CTA Section */}
      <AboutCTA />
    </div>
  );
}
