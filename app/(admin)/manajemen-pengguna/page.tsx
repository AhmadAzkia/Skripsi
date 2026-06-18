import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserWithRole } from "@/lib/user";
import ManajemenPenggunaContainer from "./components/ManajemenPenggunaContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import type { Tables } from "@/../types/database";

// Tipe data pengguna — dari tabel profil_pengguna di DB
export type PenggunaData = Tables<"profil_pengguna">;

export type PenggunaStats = {
  totalPengguna: number;
  totalAdmin: number;
  totalPeserta: number;
  penggunaAktif: number;
  penggunaTidakAktif: number;
};

async function getPenggunaStats(): Promise<PenggunaStats> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    console.error("Admin client not available");
    return { totalPengguna: 0, totalAdmin: 0, totalPeserta: 0, penggunaAktif: 0, penggunaTidakAktif: 0 };
  }

  // Get all users count
  const { count: totalCount, error: totalError } = await supabase.from("profil_pengguna").select("*", { count: "exact", head: true });

  // Get users by role
  const { data: roleData, error: roleError } = await supabase.from("profil_pengguna").select("peran, is_aktif");

  if (totalError || roleError) {
    console.error("Error fetching user stats:", totalError?.message || roleError?.message);
    return {
      totalPengguna: 0,
      totalAdmin: 0,
      totalPeserta: 0,
      penggunaAktif: 0,
      penggunaTidakAktif: 0,
    };
  }

  const totalPengguna = totalCount || 0;
  const totalAdmin = roleData?.filter((user) => user.peran === "admin").length || 0;
  const totalPeserta = roleData?.filter((user) => user.peran === "peserta").length || 0;
  const penggunaAktif = roleData?.filter((user) => user.is_aktif === true).length || 0;
  const penggunaTidakAktif = roleData?.filter((user) => user.is_aktif === false).length || 0;

  return {
    totalPengguna,
    totalAdmin,
    totalPeserta,
    penggunaAktif,
    penggunaTidakAktif,
  };
}

async function getPenggunaList(): Promise<PenggunaData[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    console.error("Admin client not available");
    return [];
  }

  const { data, error } = await supabase.from("profil_pengguna").select("*").order("dibuat_pada", { ascending: false });

  if (error) {
    console.error("Error fetching users list:", error.message);
    return [];
  }

  return data || [];
}

export default async function ManajemenPenggunaPage() {
  const userWithRole = await getUserWithRole();

  if (!userWithRole || !userWithRole.profile) {
    redirect("/auth/login");
  }

  if (userWithRole.profile.peran !== "admin") {
    redirect("/dashboard");
  }

  // Create SessionUser object that extends User and includes profile
  const sessionUser: SessionUser = {
    ...userWithRole.user,
    profile: userWithRole.profile,
  };

  const [stats, penggunaList] = await Promise.all([getPenggunaStats(), getPenggunaList()]);

  return <ManajemenPenggunaContainer user={sessionUser} stats={stats} penggunaList={penggunaList} />;
}
