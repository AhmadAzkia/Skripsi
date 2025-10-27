import DashboardPemateriHero from "./DashboardPemateriHero";
import DashboardPemateriStats from "./DashboardPemateriStats";
import DashboardPemateriQuickActions from "./DashboardPemateriQuickActions";
import DashboardPemateriRecentActivities from "./DashboardPemateriRecentActivities";
import { SessionUser } from "@/contexts/AuthContext";

type RecentActivity = {
  id: string;
  title: string;
  type: "pendaftaran" | "kursus" | "sertifikat" | "pembayaran";
  date: string;
  status: "completed" | "in-progress" | "pending";
  peserta?: string;
};

type DashboardPemateriContainerProps = {
  user: SessionUser;
  stats: {
    totalKursusCount: number;
    kursusAktifCount: number;
    totalPesertaCount: number;
    pendapatanBulanIni: number;
  };
  activities: RecentActivity[];
};

export default function DashboardPemateriContainer({ user, stats, activities }: DashboardPemateriContainerProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      {/* Hero Section with personalized greeting */}
      <DashboardPemateriHero user={user} />

      {/* Statistics Section */}
      <DashboardPemateriStats stats={stats} />

      {/* Quick Actions Section */}
      <DashboardPemateriQuickActions />

      {/* Recent Activities Section */}
      <DashboardPemateriRecentActivities activities={activities} />
    </div>
  );
}
