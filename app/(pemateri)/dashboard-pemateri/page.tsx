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
  description: string;
  time: string;
  type: "kursus" | "pendaftaran" | "materi" | "blog" | "sertifikat";
  icon: React.ReactNode;
};

async function getDashboardPemateriStats(profileId: string): Promise<DashboardPemateriStats> {
  const supabase = await createSupabaseServerClient();

  // 1. Hitung Total Kursus yang dibuat instruktur
  const { count: totalKursusCount, error: errorTotalKursus } = await supabase.from("kursus").select("*", { count: "exact", head: true }).eq("instruktur_id", profileId);

  // 2. Hitung Kursus Aktif (published)
  const { count: kursusAktifCount, error: errorKursusAktif } = await supabase.from("kursus").select("*", { count: "exact", head: true }).eq("instruktur_id", profileId).eq("status", "published");

  // 3. Hitung Total Peserta dari semua kursus instruktur
  const { count: totalPesertaCount, error: errorTotalPeserta } = await supabase
    .from("pendaftaran_kursus")
    .select(
      `
      *,
      kursus!inner(*)
    `,
      { count: "exact", head: true },
    )
    .eq("kursus.instruktur_id", profileId);

  // 4. Hitung Pendapatan bulan ini (simplified - asumsi harga rata-rata)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  const startDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;
  const endDate = `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01`;

  const { data: pembayaranData, error: errorPembayaran } = await supabase
    .from("pembayaran")
    .select(
      `
      jumlah,
      kursus!inner(*)
    `,
    )
    .eq("kursus.instruktur_id", profileId)
    .eq("status_pembayaran", "berhasil")
    .gte("dibayar_pada", startDate)
    .lt("dibayar_pada", endDate);

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

async function getRecentActivities(profileId: string): Promise<RecentActivity[]> {
  const supabase = await createSupabaseServerClient();
  const activities: RecentActivity[] = [];

  try {
    // Hitung tanggal seminggu yang lalu
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    // 1. Ambil Kursus Terbaru yang dibuat instruktur (seminggu terakhir)
    const { data: kursusData, error: kursusError } = await supabase
      .from("kursus")
      .select("id, judul, dibuat_pada, status")
      .eq("instruktur_id", profileId)
      .gte("dibuat_pada", oneWeekAgoISO)
      .order("dibuat_pada", { ascending: false })
      .limit(3);

    if (kursusData && !kursusError) {
      kursusData.forEach((kursus) => {
        activities.push({
          id: `kursus-${kursus.id}`,
          title: "Kursus Baru Dibuat",
          description: `Kursus "${kursus.judul}" telah berhasil dibuat`,
          time: formatTimeAgo(kursus.dibuat_pada),
          type: "kursus",
          icon: null, // Will be set in component
        });
      });
    }

    // 2. Ambil Pendaftaran Terbaru untuk kursus instruktur (seminggu terakhir)
    const { data: pendaftaranData, error: pendaftaranError } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        tanggal_daftar,
        status,
        kursus!inner(judul, instruktur_id),
        profil_pengguna!inner(nama_lengkap)
      `,
      )
      .eq("kursus.instruktur_id", profileId)
      .gte("tanggal_daftar", oneWeekAgoISO)
      .order("tanggal_daftar", { ascending: false })
      .limit(3);

    if (pendaftaranData && !pendaftaranError) {
      pendaftaranData.forEach((pendaftaran) => {
        const kursus = pendaftaran.kursus as any;
        const peserta = pendaftaran.profil_pengguna as any;

        activities.push({
          id: `pendaftaran-${pendaftaran.id}`,
          title: "Peserta Baru Bergabung",
          description: `${peserta.nama_lengkap} mendaftar kursus "${kursus.judul}"`,
          time: formatTimeAgo(pendaftaran.tanggal_daftar),
          type: "pendaftaran",
          icon: null, // Will be set in component
        });
      });
    }

    // 3. Ambil Materi Terbaru yang dibuat (seminggu terakhir)
    const { data: materiData, error: materiError } = await supabase
      .from("materi_kursus")
      .select(
        `
        id,
        judul,
        dibuat_pada,
        kursus!inner(judul, instruktur_id)
      `,
      )
      .eq("kursus.instruktur_id", profileId)
      .gte("dibuat_pada", oneWeekAgoISO)
      .order("dibuat_pada", { ascending: false })
      .limit(2);

    if (materiData && !materiError) {
      materiData.forEach((materi) => {
        const kursus = materi.kursus as any;

        activities.push({
          id: `materi-${materi.id}`,
          title: "Materi Baru Ditambahkan",
          description: `Materi "${materi.judul}" ditambahkan ke "${kursus.judul}"`,
          time: formatTimeAgo(materi.dibuat_pada),
          type: "materi",
          icon: null, // Will be set in component
        });
      });
    }

    // 4. Ambil Blog Terbaru yang dipublikasi (seminggu terakhir)
    const { data: blogData, error: blogError } = await supabase
      .from("artikel_blog")
      .select("id, judul, dipublikasi_pada, status")
      .eq("penulis_id", profileId)
      .eq("status", "published")
      .gte("dipublikasi_pada", oneWeekAgoISO)
      .order("dipublikasi_pada", { ascending: false })
      .limit(2);

    if (blogData && !blogError) {
      blogData.forEach((blog) => {
        if (blog.dipublikasi_pada) {
          activities.push({
            id: `blog-${blog.id}`,
            title: "Artikel Blog Dipublikasi",
            description: `Artikel "${blog.judul}" telah dipublikasikan`,
            time: formatTimeAgo(blog.dipublikasi_pada),
            type: "blog",
            icon: null, // Will be set in component
          });
        }
      });
    }

    // Sort berdasarkan tanggal terbaru dan ambil 6 teratas
    activities.sort((a, b) => {
      // Extract time values for comparison
      const timeA = getTimeValue(a.time);
      const timeB = getTimeValue(b.time);
      return timeA - timeB; // Ascending order (newest first)
    });

    return activities.slice(0, 6);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Baru saja";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  } else {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

function getTimeValue(timeString: string): number {
  if (timeString === "Baru saja") return 0;

  const match = timeString.match(/(\d+)\s+(menit|jam|hari)/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case "menit":
        return value;
      case "jam":
        return value * 60;
      case "hari":
        return value * 60 * 24;
      default:
        return 999999;
    }
  }

  return 999999; // For dates (oldest)
}

export default async function DashboardPemateriPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "instruktur") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // Ambil profil_pengguna.id untuk digunakan sebagai instruktur_id
  const supabase = await createSupabaseServerClient();
  const { data: profileData, error: profileError } = await supabase.from("profil_pengguna").select("id").eq("user_id", userData.user.id).single();

  if (profileError || !profileData) {
    console.error("Error getting profile ID:", profileError);
    redirect("/login");
  }

  const profileId = profileData.id; // Ini yang digunakan sebagai instruktur_id

  // 1. Jalankan kode BE di server untuk mendapatkan statistik dan aktivitas
  const stats = await getDashboardPemateriStats(profileId);
  const activities = await getRecentActivities(profileId);

  // 2. Render komponen FE dan kirimkan data user, statistik & aktivitas sebagai props
  return <DashboardPemateriContainer user={userData.user as SessionUser} stats={stats} activities={activities} />;
}
