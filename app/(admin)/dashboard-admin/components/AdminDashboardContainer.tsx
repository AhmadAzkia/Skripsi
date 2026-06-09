import AdminDashboardHero from "./AdminDashboardHero";
import AdminDashboardStats, { AdminDashboardStatsData } from "./AdminDashboardStats";
import AdminDashboardRecentActivities, { AdminRecentActivity } from "./AdminDashboardRecentActivities";
import { SessionUser } from "@/contexts/AuthContext";

type AdminDashboardContainerProps = {
  user: SessionUser;
  stats: AdminDashboardStatsData;
  activities: AdminRecentActivity[];
};

export default function AdminDashboardContainer({ user, stats, activities }: AdminDashboardContainerProps) {
  return (
    <>
      {/* Hero Section with personalized greeting */}
      <AdminDashboardHero user={user} />

      {/* Platform Statistics Section */}
      <AdminDashboardStats stats={stats} />

      {/* Recent Activities Section */}
      <AdminDashboardRecentActivities activities={activities} />
    </>
  );
}
