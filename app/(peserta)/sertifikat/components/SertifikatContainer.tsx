import SertifikatHero from "./SertifikatHero";
import SertifikatStats from "./SertifikatStats";
import SertifikatList from "./SertifikatList";
import { SessionUser } from "@/contexts/AuthContext";
import type { CertificateWithCourse } from "../page";

type SertifikatStats = {
  totalSertifikat: number;
  sertifikatBulanIni: number;
  kategoriTerlengkap: string;
  rataRataNilai: number;
};

type SertifikatContainerProps = {
  user: SessionUser;
  certificates: CertificateWithCourse[];
  stats: SertifikatStats;
};

export default function SertifikatContainer({ user, certificates, stats }: SertifikatContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-50">
      {/* Hero Section with personalized greeting */}
      <SertifikatHero user={user} />

      {/* Statistics Section */}
      <SertifikatStats stats={stats} />

      {/* Certificates List Section */}
      <SertifikatList certificates={certificates} />
    </div>
  );
}
