import DashboardHero from "./DashboardHero";
import DashboardStats from "./DashboardStats";
import DashboardQuickActions from "./DashboardQuickActions";
import { SessionUser } from "@/contexts/AuthContext";

type DashboardContainerProps = {
  user: SessionUser;
  stats: {
    totalPelatihanDiikuti: number;
    sertifikatCount: number;
    jadwalBerlangsung: number;
  };
};

export default function DashboardContainer({ user, stats }: DashboardContainerProps) {
  return (
    <>
      {/* Hero Section with personalized greeting */}
      <DashboardHero user={user} />

      {/* Statistics Section */}
      <DashboardStats stats={stats} />

      {/* Quick Actions Section */}
      <DashboardQuickActions />
    </>
  );
}
