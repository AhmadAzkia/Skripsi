import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import DashboardPemateriContainer from "./components/DashboardPemateriContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type DashboardPemateriStats = {
  totalKursusCount: number;
  kursusAktifCount: number;
  totalPesertaCount: number;
  pendapatanBulanIni: number;
};

type RecentActivity = {
  id: string;
  title: string;
  type: "pendaftaran" | "kursus" | "sertifikat" | "pembayaran";
  date: string;
  status: "completed" | "in-progress" | "pending";
  peserta?: string;
};

async function getDashboardPemateriStats(userId: string): Promise<DashboardPemateriStats> {
  const supabase = await createSupabaseServerClient();

  // 1. Hitung Total Kursus yang dibuat instruktur
  const { count: totalKursusCount, error: errorTotalKursus } = await supabase.from("kursus").select("*", { count: "exact", head: true }).eq("instruktur_id", userId);

  // 2. Hitung Kursus Aktif (published)
  const { count: kursusAktifCount, error: errorKursusAktif } = await supabase.from("kursus").select("*", { count: "exact", head: true }).eq("instruktur_id", userId).eq("status", "published");

  // 3. Hitung Total Peserta dari semua kursus instruktur
  const { count: totalPesertaCount, error: errorTotalPeserta } = await supabase
    .from("pendaftaran_kursus")
    .select(
      `
      *,
      kursus!inner(*)
    `,
      { count: "exact", head: true }
    )
    .eq("kursus.instruktur_id", userId);

  // 4. Hitung Pendapatan bulan ini (simplified - asumsi harga rata-rata)
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const { data: pembayaranData, error: errorPembayaran } = await supabase
    .from("pembayaran")
    .select(
      `
      jumlah,
      kursus!inner(*)
    `
    )
    .eq("kursus.instruktur_id", userId)
    .eq("status_pembayaran", "berhasil")
    .gte("dibayar_pada", `${currentMonth}-01`)
    .lt("dibayar_pada", `${currentMonth}-32`);

  const pendapatanBulanIni = pembayaranData?.reduce((total, item) => total + item.jumlah, 0) || 0;

  if (errorTotalKursus) console.error("Error fetching total courses:", errorTotalKursus.message);
  if (errorKursusAktif) console.error("Error fetching active courses:", errorKursusAktif.message);
  if (errorTotalPeserta) console.error("Error fetching total students:", errorTotalPeserta.message);
  if (errorPembayaran) console.error("Error fetching payments:", errorPembayaran.message);

  return {
    totalKursusCount: totalKursusCount ?? 0,
    kursusAktifCount: kursusAktifCount ?? 0,
    totalPesertaCount: totalPesertaCount ?? 0,
    pendapatanBulanIni: Math.round((pendapatanBulanIni || 0) / 1000000), // Convert to millions
  };
}

async function getRecentPemateriActivities(userId: string): Promise<RecentActivity[]> {
  const supabase = await createSupabaseServerClient();
  const activities: RecentActivity[] = [];

  try {
    // 1. Ambil Pendaftaran Terbaru untuk kursus instruktur
    const { data: pendaftaranData, error: pendaftaranError } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        tanggal_daftar,
        status,
        kursus:kursus_id!inner (
          judul,
          instruktur_id
        ),
        peserta:pengguna_id (
          nama_lengkap
        )
      `
      )
      .eq("kursus.instruktur_id", userId)
      .order("tanggal_daftar", { ascending: false })
      .limit(5);

    if (pendaftaranData && !pendaftaranError) {
      pendaftaranData.forEach((item) => {
        const kursusData = item.kursus as any;
        const pesertaData = item.peserta as any;

        activities.push({
          id: `pendaftaran-${item.id}`,
          title: `Pendaftaran baru untuk "${kursusData?.judul}"`,
          type: "pendaftaran",
          date: item.tanggal_daftar,
          status: item.status === "terdaftar" ? "pending" : item.status === "sedang_belajar" ? "in-progress" : "completed",
          peserta: pesertaData?.nama_lengkap || "Peserta",
        });
      });
    }

    // 2. Ambil Kursus Terbaru yang dibuat
    const { data: kursusData, error: kursusError } = await supabase
      .from("kursus")
      .select(
        `
        id,
        judul,
        dibuat_pada,
        status
      `
      )
      .eq("instruktur_id", userId)
      .order("dibuat_pada", { ascending: false })
      .limit(3);

    if (kursusData && !kursusError) {
      kursusData.forEach((item) => {
        activities.push({
          id: `kursus-${item.id}`,
          title: `Kursus "${item.judul}" dibuat`,
          type: "kursus",
          date: item.dibuat_pada,
          status: item.status === "published" ? "completed" : item.status === "draft" ? "pending" : "in-progress",
        });
      });
    }

    // 3. Sort berdasarkan tanggal terbaru dan ambil 8 teratas
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return activities.slice(0, 8);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}

export default async function DashboardPemateriPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "instruktur") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // 1. Jalankan kode BE di server untuk mendapatkan statistik dan aktivitas
  const stats = userData.user.id
    ? await getDashboardPemateriStats(userData.user.id)
    : {
        totalKursusCount: 0,
        kursusAktifCount: 0,
        totalPesertaCount: 0,
        pendapatanBulanIni: 0,
      };

  const activities = userData.user.id ? await getRecentPemateriActivities(userData.user.id) : [];

  // 2. Render komponen FE dan kirimkan data user, statistik & aktivitas sebagai props
  return <DashboardPemateriContainer user={userData.user as SessionUser} stats={stats} activities={activities} />;
}
