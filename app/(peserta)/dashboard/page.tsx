// app/(peserta)/dashboard/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import DashboardContainer from "./components/DashboardContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type DashboardStats = {
  pelatihanAktifCount: number;
  sertifikatCount: number;
  jadwalHariIniCount: number;
};

type RecentActivity = {
  id: string;
  title: string;
  type: "pelatihan" | "sertifikat" | "jadwal";
  date: string;
  status: "completed" | "in-progress" | "upcoming";
};

async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();

  // 1. Hitung Pelatihan Aktif
  const { count: pelatihanAktifCount, error: errorAktif } = await supabase
    .from("pendaftaran_kursus")
    .select("*", { count: "exact", head: true })
    .eq("pengguna_id", userId) // Pastikan kolom Foreign Key benar
    .eq("status", "sedang_belajar"); // Asumsi status 'sedang_belajar'

  // 2. Hitung Sertifikat yang Terbit
  const { count: sertifikatCount, error: errorSertifikat } = await supabase
    .from("sertifikat")
    .select("*", { count: "exact", head: true })
    .eq("peserta_id", userId) // Pastikan kolom Foreign Key benar (mungkin id dari profil_pengguna)
    .eq("status", "terbit"); // Asumsi status 'terbit'

  if (errorAktif) console.error("Error fetching active courses:", errorAktif.message);
  if (errorSertifikat) console.error("Error fetching certificates:", errorSertifikat.message);

  // 3. Hitung Jadwal Hari Ini - kursus yang dimulai hari ini
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  const { count: jadwalHariIniCount, error: errorJadwal } = await supabase.from("pendaftaran_kursus").select("kursus!inner(*)", { count: "exact", head: true }).eq("pengguna_id", userId).eq("kursus.tanggal_mulai", today);

  if (errorJadwal) console.error("Error fetching today's schedule:", errorJadwal.message);

  return {
    pelatihanAktifCount: pelatihanAktifCount ?? 0,
    sertifikatCount: sertifikatCount ?? 0,
    jadwalHariIniCount: jadwalHariIniCount ?? 0,
  };
}

async function getRecentActivities(userId: string): Promise<RecentActivity[]> {
  const supabase = await createSupabaseServerClient();
  const activities: RecentActivity[] = [];

  try {
    // 1. Ambil Pelatihan Terbaru yang Didaftar/Sedang Belajar
    const { data: pelatihanData, error: pelatihanError } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        status,
        tanggal_daftar,
        kursus:kursus_id (
          judul
        )
      `
      )
      .eq("pengguna_id", userId)
      .in("status", ["terdaftar", "sedang_belajar", "selesai"])
      .order("tanggal_daftar", { ascending: false })
      .limit(5);

    if (pelatihanData && !pelatihanError) {
      pelatihanData.forEach((item) => {
        let status: "completed" | "in-progress" | "upcoming" = "upcoming";
        if (item.status === "sedang_belajar") status = "in-progress";
        if (item.status === "selesai") status = "completed";

        activities.push({
          id: `pelatihan-${item.id}`,
          title: (item.kursus as any)?.judul || "Pelatihan",
          type: "pelatihan",
          date: item.tanggal_daftar,
          status: status,
        });
      });
    }

    // 2. Ambil Sertifikat Terbaru
    const { data: sertifikatData, error: sertifikatError } = await supabase
      .from("sertifikat")
      .select(
        `
        id,
        nomor_sertifikat,
        tanggal_terbit,
        status,
        kursus:kursus_id (
          judul
        )
      `
      )
      .eq("peserta_id", userId)
      .order("tanggal_terbit", { ascending: false })
      .limit(3);

    if (sertifikatData && !sertifikatError) {
      sertifikatData.forEach((item) => {
        activities.push({
          id: `sertifikat-${item.id}`,
          title: `Sertifikat: ${(item.kursus as any)?.judul || item.nomor_sertifikat}`,
          type: "sertifikat",
          date: item.tanggal_terbit,
          status: "completed",
        });
      });
    }

    // 3. Ambil Jadwal Mendatang (kursus yang akan dimulai dalam 7 hari ke depan)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const { data: jadwalData, error: jadwalError } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        status,
        kursus:kursus_id (
          judul,
          tanggal_mulai
        )
      `
      )
      .eq("pengguna_id", userId)
      .eq("status", "terdaftar")
      .gte("kursus.tanggal_mulai", new Date().toISOString().split("T")[0])
      .lte("kursus.tanggal_mulai", nextWeek.toISOString().split("T")[0])
      .order("kursus.tanggal_mulai", { ascending: true })
      .limit(3);

    if (jadwalData && !jadwalError) {
      jadwalData.forEach((item) => {
        const kursusData = item.kursus as any;
        if (kursusData?.tanggal_mulai) {
          activities.push({
            id: `jadwal-${item.id}`,
            title: `Jadwal: ${kursusData.judul}`,
            type: "jadwal",
            date: kursusData.tanggal_mulai,
            status: "upcoming",
          });
        }
      });
    }

    // 4. Sort berdasarkan tanggal terbaru dan ambil 8 teratas
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return activities.slice(0, 8);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}

export default async function DashboardPesertaPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // 1. Jalankan kode BE di server untuk mendapatkan statistik dan aktivitas
  // Pastikan user.id ada sebelum memanggil getDashboardStats
  const stats = userData.user.id
    ? await getDashboardStats(userData.user.id)
    : {
        pelatihanAktifCount: 0,
        sertifikatCount: 0,
        jadwalHariIniCount: 0,
      };

  const activities = userData.user.id ? await getRecentActivities(userData.user.id) : [];

  // 2. Render komponen FE dan kirimkan data user, statistik & aktivitas sebagai props
  return <DashboardContainer user={userData.user as SessionUser} stats={stats} activities={activities} />;
}
