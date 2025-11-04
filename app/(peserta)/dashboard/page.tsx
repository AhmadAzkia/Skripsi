// app/(peserta)/dashboard/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import DashboardContainer from "./components/DashboardContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type DashboardStats = {
  pelatihanAktifCount: number;
  sertifikatCount: number;
  jadwalBerlangsung: number; // Ganti dari jadwalHariIniCount ke jadwalBerlangsung
};

type RecentActivity = {
  id: string;
  title: string;
  type: "pelatihan" | "sertifikat" | "jadwal";
  date: string;
  status: "completed" | "in-progress" | "upcoming";
};

async function getDashboardStats(profileId: string): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];

  // 1. Hitung Pelatihan Aktif - menggunakan logic yang sama dengan jadwal-peserta
  // Pelatihan aktif = jadwal berlangsung dari halaman jadwal-peserta
  const { count: pelatihanAktifCount, error: errorAktif } = await supabase
    .from("pendaftaran_kursus")
    .select(
      `
      *,
      kursus!inner(
        tanggal_mulai,
        tanggal_selesai
      )
    `,
      { count: "exact", head: true }
    )
    .eq("pengguna_id", profileId)
    .in("status", ["terdaftar", "sedang_belajar"])
    .lte("kursus.tanggal_mulai", today)
    .gte("kursus.tanggal_selesai", today);

  // 2. Hitung Sertifikat yang Terbit
  const { count: sertifikatCount, error: errorSertifikat } = await supabase.from("sertifikat").select("*", { count: "exact", head: true }).eq("peserta_id", profileId).eq("status", "terbit");

  // 3. Hitung Jadwal Berlangsung - sama dengan "sedang berlangsung" di halaman jadwal-peserta
  const { count: jadwalBerlangsung, error: errorJadwal } = await supabase
    .from("pendaftaran_kursus")
    .select(
      `
      *,
      kursus!inner(
        tanggal_mulai,
        tanggal_selesai
      )
    `,
      { count: "exact", head: true }
    )
    .eq("pengguna_id", profileId)
    .in("status", ["terdaftar", "sedang_belajar"])
    .lte("kursus.tanggal_mulai", today)
    .gte("kursus.tanggal_selesai", today);

  // Debug logging
  console.log("Dashboard Stats:", {
    profileId,
    pelatihanAktifCount,
    sertifikatCount,
    jadwalBerlangsung,
    today,
  });

  if (errorAktif) console.error("Error fetching active courses:", errorAktif.message);
  if (errorSertifikat) console.error("Error fetching certificates:", errorSertifikat.message);
  if (errorJadwal) console.error("Error fetching ongoing schedule:", errorJadwal.message);

  return {
    pelatihanAktifCount: pelatihanAktifCount ?? 0,
    sertifikatCount: sertifikatCount ?? 0,
    jadwalBerlangsung: jadwalBerlangsung ?? 0,
  };
}

async function getRecentActivities(profileId: string): Promise<RecentActivity[]> {
  const supabase = await createSupabaseServerClient();
  const activities: RecentActivity[] = [];

  try {
    // 1. Ambil Pelatihan Terbaru dengan Status yang Akurat
    const { data: pelatihanData, error: pelatihanError } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        status,
        tanggal_daftar,
        kursus:kursus_id (
          judul,
          tanggal_mulai,
          tanggal_selesai
        )
      `
      )
      .eq("pengguna_id", profileId)
      .in("status", ["terdaftar", "sedang_belajar", "selesai"])
      .order("tanggal_daftar", { ascending: false })
      .limit(5);

    if (pelatihanData && !pelatihanError) {
      const currentDate = new Date();

      pelatihanData.forEach((item) => {
        const kursusData = item.kursus as any;
        let status: "completed" | "in-progress" | "upcoming" = "upcoming";

        // Logic status berdasarkan status pendaftaran dan tanggal
        if (item.status === "selesai") {
          status = "completed";
        } else if (item.status === "sedang_belajar") {
          status = "in-progress";
        } else if (item.status === "terdaftar") {
          // Cek apakah kursus sudah dimulai
          if (kursusData?.tanggal_mulai) {
            const tanggalMulai = new Date(kursusData.tanggal_mulai);
            status = tanggalMulai <= currentDate ? "in-progress" : "upcoming";
          }
        }

        activities.push({
          id: `pelatihan-${item.id}`,
          title: kursusData?.judul || "Pelatihan",
          type: "pelatihan",
          date: item.tanggal_daftar,
          status: status,
        });
      });
    }

    // 2. Ambil Sertifikat yang Sudah Terbit
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
      .eq("peserta_id", profileId)
      .eq("status", "terbit") // Hanya yang sudah terbit
      .order("tanggal_terbit", { ascending: false })
      .limit(3);

    if (sertifikatData && !sertifikatError) {
      sertifikatData.forEach((item) => {
        activities.push({
          id: `sertifikat-${item.id}`,
          title: `Sertifikat: ${(item.kursus as any)?.judul || item.nomor_sertifikat}`,
          type: "sertifikat",
          date: item.tanggal_terbit,
          status: "completed", // Sertifikat selalu completed
        });
      });
    }

    // 3. Ambil Jadwal Mendatang (kursus yang akan dimulai dalam 7 hari ke depan)
    const currentDate = new Date();
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
      .eq("pengguna_id", profileId)
      .eq("status", "terdaftar") // Hanya yang masih terdaftar (belum mulai)
      .limit(10);

    if (jadwalData && !jadwalError) {
      const filteredJadwal = jadwalData
        .filter((item) => {
          const kursusData = item.kursus as any;
          if (!kursusData?.tanggal_mulai) return false;

          const tanggalMulai = new Date(kursusData.tanggal_mulai);
          // Jadwal mendatang: mulai dari besok sampai 7 hari ke depan
          return tanggalMulai > currentDate && tanggalMulai <= nextWeek;
        })
        .sort((a, b) => {
          const dateA = new Date((a.kursus as any)?.tanggal_mulai);
          const dateB = new Date((b.kursus as any)?.tanggal_mulai);
          return dateA.getTime() - dateB.getTime(); // Sort ascending (terdekat dulu)
        })
        .slice(0, 3);

      filteredJadwal.forEach((item) => {
        const kursusData = item.kursus as any;
        activities.push({
          id: `jadwal-${item.id}`,
          title: `Jadwal: ${kursusData.judul}`,
          type: "jadwal",
          date: kursusData.tanggal_mulai,
          status: "upcoming", // Jadwal selalu upcoming
        });
      });
    }

    // 4. Sort berdasarkan tanggal terbaru dan ambil 8 teratas
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Error handling untuk debugging jika diperlukan
    if (pelatihanError) console.error("Error fetching pelatihan:", pelatihanError.message);
    if (sertifikatError) console.error("Error fetching sertifikat:", sertifikatError.message);
    if (jadwalError) console.error("Error fetching jadwal:", jadwalError.message);

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
  // Pastikan profile.id ada sebelum memanggil getDashboardStats
  const stats = userData.profile?.id
    ? await getDashboardStats(userData.profile.id)
    : {
        pelatihanAktifCount: 0,
        sertifikatCount: 0,
        jadwalBerlangsung: 0,
      };

  const activities = userData.profile?.id ? await getRecentActivities(userData.profile.id) : [];

  // 2. Render komponen FE dan kirimkan data user, statistik & aktivitas sebagai props
  return <DashboardContainer user={userData.user as SessionUser} stats={stats} activities={activities} />;
}
