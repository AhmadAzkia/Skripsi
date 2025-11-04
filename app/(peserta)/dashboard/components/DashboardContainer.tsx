import DashboardHero from "./DashboardHero";
import DashboardStats from "./DashboardStats";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardRecentActivities from "./DashboardRecentActivities";
import { SessionUser } from "@/contexts/AuthContext";

type RecentActivity = {
  id: string;
  title: string;
  type: "pelatihan" | "sertifikat" | "jadwal";
  date: string;
  status: "completed" | "in-progress" | "upcoming";
};

type DashboardContainerProps = {
  user: SessionUser;
  stats: {
    pelatihanAktifCount: number;
    sertifikatCount: number;
    jadwalBerlangsung: number;
  };
  activities: RecentActivity[];
};

export default function DashboardContainer({ user, stats, activities }: DashboardContainerProps) {
  return (
    <>
      {/* Hero Section with personalized greeting */}
      <DashboardHero user={user} />

      {/* Statistics Section */}
      <DashboardStats stats={stats} />

      {/* Quick Actions Section */}
      <DashboardQuickActions />

      {/* Recent Activities Section */}
      <DashboardRecentActivities activities={activities} />
    </>
  );
}
