import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import ManajemenPenggunaContainer from "./components/ManajemenPenggunaContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

export type PenggunaData = {
  id: string;
  nama_lengkap: string;
  email: string;
  peran: string;
  is_aktif: boolean;
  nomor_hp: string | null;
  foto_profil_url: string | null;
  dibuat_pada: string;
  diperbarui_pada: string | null;
  user_id: string;
  bio: string | null;
};

export type PenggunaStats = {
  totalPengguna: number;
  totalAdmin: number;
  totalInstruktur: number;
  totalPeserta: number;
  penggunaAktif: number;
  penggunaTidakAktif: number;
};

async function getPenggunaStats(): Promise<PenggunaStats> {
  const supabase = await createSupabaseServerClient();

  // Get all users count
  const { count: totalCount, error: totalError } = await supabase.from("profil_pengguna").select("*", { count: "exact", head: true });

  // Get users by role
  const { data: roleData, error: roleError } = await supabase.from("profil_pengguna").select("peran, is_aktif");

  if (totalError || roleError) {
    console.error("Error fetching user stats:", totalError?.message || roleError?.message);
    return {
      totalPengguna: 0,
      totalAdmin: 0,
      totalInstruktur: 0,
      totalPeserta: 0,
      penggunaAktif: 0,
      penggunaTidakAktif: 0,
    };
  }

  const totalPengguna = totalCount || 0;
  const totalAdmin = roleData?.filter((user) => user.peran === "admin").length || 0;
  const totalInstruktur = roleData?.filter((user) => user.peran === "instruktur").length || 0;
  const totalPeserta = roleData?.filter((user) => user.peran === "peserta").length || 0;
  const penggunaAktif = roleData?.filter((user) => user.is_aktif === true).length || 0;
  const penggunaTidakAktif = roleData?.filter((user) => user.is_aktif === false).length || 0;

  return {
    totalPengguna,
    totalAdmin,
    totalInstruktur,
    totalPeserta,
    penggunaAktif,
    penggunaTidakAktif,
  };
}

async function getPenggunaList(): Promise<PenggunaData[]> {
  const supabase = await createSupabaseServerClient();

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
