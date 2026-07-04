import AdminDashboardHero from "./AdminDashboardHero";
import AdminDashboardStats, { AdminDashboardStatsData } from "./AdminDashboardStats";
import { SessionUser } from "@/contexts/AuthContext";

type AdminDashboardContainerProps = {
  user: SessionUser;
  stats: AdminDashboardStatsData;
};

export default function AdminDashboardContainer({ user, stats }: AdminDashboardContainerProps) {
  return (
    <>
      {/* Hero Section with personalized greeting */}
      <AdminDashboardHero user={user} />

      {/* Platform Statistics Section */}
      <AdminDashboardStats stats={stats} />
    </>
  );
}
