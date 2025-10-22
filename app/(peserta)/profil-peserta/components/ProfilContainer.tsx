import ProfilHero from "./ProfilHero";
import ProfilInfo from "./ProfilInfo";
import ProfilStats from "./ProfilStats";
import { SessionUser } from "@/contexts/AuthContext";

type ProfilStats = {
  totalPelatihan: number;
  pelatihanSelesai: number;
  totalSertifikat: number;
  waktuBelajar: number;
};

type ProfilContainerProps = {
  user: SessionUser;
  stats: ProfilStats;
};

export default function ProfilContainer({ user, stats }: ProfilContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      {/* Hero Section with profile greeting */}
      <ProfilHero user={user} />

      {/* Profile Information Section */}
      <ProfilInfo user={user} />

      {/* Statistics Section */}
      <ProfilStats stats={stats} />
    </div>
  );
}
