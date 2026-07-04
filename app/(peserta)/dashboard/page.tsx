// app/(peserta)/dashboard/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import DashboardContainer from "./components/DashboardContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type DashboardStats = {
  totalPelatihanDiikuti: number;
  sertifikatCount: number;
  jadwalBerlangsung: number;
};

async function getDashboardStats(profileId: string): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];

  // 1. Total Pelatihan Diikuti (semua pendaftaran)
  const { count: totalPelatihanDiikuti, error: errorTotal } = await supabase
    .from("pendaftaran_pelatihan")
    .select("*", { count: "exact", head: true })
    .eq("pengguna_id", profileId);

  // 2. Hitung Sertifikat yang Terbit
  const { count: sertifikatCount, error: errorSertifikat } = await supabase
    .from("sertifikat")
    .select("*", { count: "exact", head: true })
    .eq("peserta_id", profileId)
    .eq("status", "terbit");

  // 3. Jadwal Berlangsung (pelatihan yang sedang dalam periode)
  const { count: jadwalBerlangsung, error: errorJadwal } = await supabase
    .from("pendaftaran_pelatihan")
    .select(
      `*, pelatihan!inner(tanggal_mulai, tanggal_selesai)`,
      { count: "exact", head: true }
    )
    .eq("pengguna_id", profileId)
    .in("status", ["terdaftar", "sedang_belajar"])
    .lte("pelatihan.tanggal_mulai", today)
    .gte("pelatihan.tanggal_selesai", today);

  if (errorTotal) console.error("Error fetching total pelatihan:", errorTotal.message);
  if (errorSertifikat) console.error("Error fetching certificates:", errorSertifikat.message);
  if (errorJadwal) console.error("Error fetching ongoing schedule:", errorJadwal.message);

  return {
    totalPelatihanDiikuti: totalPelatihanDiikuti ?? 0,
    sertifikatCount: sertifikatCount ?? 0,
    jadwalBerlangsung: jadwalBerlangsung ?? 0,
  };
}

export default async function DashboardPesertaPage() {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  const stats = userData.profile?.id
    ? await getDashboardStats(userData.profile.id)
    : {
        totalPelatihanDiikuti: 0,
        sertifikatCount: 0,
        jadwalBerlangsung: 0,
      };

  return <DashboardContainer user={userData.user as SessionUser} stats={stats} />;
}
