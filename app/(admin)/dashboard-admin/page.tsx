import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserWithRole } from "@/lib/user";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import AdminDashboardContainer from "./components/AdminDashboardContainer";
import type { AdminDashboardStatsData } from "./components/AdminDashboardStats";

async function getAdminStats(): Promise<AdminDashboardStatsData> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { totalPengguna: 0, totalPelatihan: 0, pelatihanPublished: 0, pendaftaranAktif: 0, totalPendapatan: 0 };

  const [penggunaRes, pelatihanTotalRes, pelatihanPublishedRes, pendaftaranAktifRes, pendapatanRes] = await Promise.all([
    supabase.from("profil_pengguna").select("*", { count: "exact", head: true }),
    supabase.from("pelatihan").select("*", { count: "exact", head: true }),
    supabase.from("pelatihan").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("pendaftaran_pelatihan").select("*", { count: "exact", head: true }).in("status", ["terdaftar", "sedang_belajar"]),
    supabase.from("pembayaran").select("jumlah").eq("status_pembayaran", "berhasil"),
  ]);

  if (penggunaRes.error) console.error("Error fetching total pengguna:", penggunaRes.error.message);
  if (pelatihanTotalRes.error) console.error("Error fetching total pelatihan:", pelatihanTotalRes.error.message);
  if (pelatihanPublishedRes.error) console.error("Error fetching published pelatihan:", pelatihanPublishedRes.error.message);
  if (pendaftaranAktifRes.error) console.error("Error fetching pendaftaran aktif:", pendaftaranAktifRes.error.message);
  if (pendapatanRes.error) console.error("Error fetching pendapatan:", pendapatanRes.error.message);

  const totalPendapatan = pendapatanRes.data?.reduce((sum, p) => sum + (p.jumlah || 0), 0) ?? 0;

  return {
    totalPengguna: penggunaRes.count ?? 0,
    totalPelatihan: pelatihanTotalRes.count ?? 0,
    pelatihanPublished: pelatihanPublishedRes.count ?? 0,
    pendaftaranAktif: pendaftaranAktifRes.count ?? 0,
    totalPendapatan,
  };
}

export default async function DashboardAdminPage() {
  const userWithRole = await getUserWithRole();

  if (!userWithRole?.user || userWithRole.role !== "admin") {
    redirect("/login");
  }

  const sessionUser: SessionUser = {
    ...userWithRole.user,
    profile: userWithRole.profile,
  } as SessionUser;

  const stats = await getAdminStats();

  return <AdminDashboardContainer user={sessionUser} stats={stats} />;
}
