import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import AdminDashboardContainer from "./components/AdminDashboardContainer";
import type { AdminDashboardStatsData } from "./components/AdminDashboardStats";
import type { AdminRecentActivity } from "./components/AdminDashboardRecentActivities";

async function getAdminStats(): Promise<AdminDashboardStatsData> {
  const supabase = await createSupabaseServerClient();

  const [penggunaRes, pelatihanTotalRes, pelatihanPublishedRes, pendaftaranRes, sertifikatRes] = await Promise.all([
    supabase.from("profil_pengguna").select("*", { count: "exact", head: true }),
    supabase.from("kursus").select("*", { count: "exact", head: true }),
    supabase.from("kursus").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }),
    supabase.from("sertifikat").select("*", { count: "exact", head: true }).eq("status", "terbit"),
  ]);

  if (penggunaRes.error) console.error("Error fetching total pengguna:", penggunaRes.error.message);
  if (pelatihanTotalRes.error) console.error("Error fetching total pelatihan:", pelatihanTotalRes.error.message);
  if (pelatihanPublishedRes.error) console.error("Error fetching published pelatihan:", pelatihanPublishedRes.error.message);
  if (pendaftaranRes.error) console.error("Error fetching total pendaftaran:", pendaftaranRes.error.message);
  if (sertifikatRes.error) console.error("Error fetching sertifikat terbit:", sertifikatRes.error.message);

  return {
    totalPengguna: penggunaRes.count ?? 0,
    totalPelatihan: pelatihanTotalRes.count ?? 0,
    pelatihanPublished: pelatihanPublishedRes.count ?? 0,
    totalPendaftaran: pendaftaranRes.count ?? 0,
    sertifikatTerbit: sertifikatRes.count ?? 0,
  };
}

async function getAdminRecentActivities(): Promise<AdminRecentActivity[]> {
  const supabase = await createSupabaseServerClient();
  const activities: AdminRecentActivity[] = [];

  try {
    const [penggunaRes, pendaftaranRes, sertifikatRes] = await Promise.all([
      // 1. Pengguna baru
      supabase.from("profil_pengguna").select("id, nama_lengkap, peran, dibuat_pada").order("dibuat_pada", { ascending: false }).limit(5),
      // 2. Pendaftaran kursus terbaru
      supabase
        .from("pendaftaran_kursus")
        .select(
          `
          id,
          tanggal_daftar,
          pengguna:pengguna_id ( nama_lengkap ),
          kursus:kursus_id ( judul )
        `
        )
        .order("tanggal_daftar", { ascending: false })
        .limit(5),
      // 3. Sertifikat terbit terbaru
      supabase
        .from("sertifikat")
        .select(
          `
          id,
          nomor_sertifikat,
          tanggal_terbit,
          peserta:peserta_id ( nama_lengkap ),
          kursus:kursus_id ( judul )
        `
        )
        .eq("status", "terbit")
        .order("tanggal_terbit", { ascending: false })
        .limit(5),
    ]);

    if (penggunaRes.data && !penggunaRes.error) {
      penggunaRes.data.forEach((item) => {
        activities.push({
          id: `pengguna-${item.id}`,
          title: item.nama_lengkap || "Pengguna Baru",
          subtitle: `Bergabung sebagai ${item.peran}`,
          type: "pengguna",
          date: item.dibuat_pada,
        });
      });
    }

    if (pendaftaranRes.data && !pendaftaranRes.error) {
      pendaftaranRes.data.forEach((item) => {
        const namaPengguna = (item.pengguna as any)?.nama_lengkap || "Peserta";
        const judulKursus = (item.kursus as any)?.judul || "sebuah pelatihan";
        activities.push({
          id: `pendaftaran-${item.id}`,
          title: `${namaPengguna} mendaftar pelatihan`,
          subtitle: judulKursus,
          type: "pendaftaran",
          date: item.tanggal_daftar,
        });
      });
    }

    if (sertifikatRes.data && !sertifikatRes.error) {
      sertifikatRes.data.forEach((item) => {
        const namaPeserta = (item.peserta as any)?.nama_lengkap || "Peserta";
        const judulKursus = (item.kursus as any)?.judul || item.nomor_sertifikat;
        activities.push({
          id: `sertifikat-${item.id}`,
          title: `Sertifikat untuk ${namaPeserta}`,
          subtitle: judulKursus,
          type: "sertifikat",
          date: item.tanggal_terbit,
        });
      });
    }

    if (penggunaRes.error) console.error("Error fetching pengguna activities:", penggunaRes.error.message);
    if (pendaftaranRes.error) console.error("Error fetching pendaftaran activities:", pendaftaranRes.error.message);
    if (sertifikatRes.error) console.error("Error fetching sertifikat activities:", sertifikatRes.error.message);

    // Urutkan semua aktivitas berdasarkan tanggal terbaru, ambil 8 teratas
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return activities.slice(0, 8);
  } catch (error) {
    console.error("Error fetching admin recent activities:", error);
    return [];
  }
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

  const [stats, activities] = await Promise.all([getAdminStats(), getAdminRecentActivities()]);

  return <AdminDashboardContainer user={sessionUser} stats={stats} activities={activities} />;
}
