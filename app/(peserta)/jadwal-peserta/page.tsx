import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import JadwalContainer from "./components/JadwalContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type JadwalPelatihan = {
  id: string;
  judul: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  tipe_kursus: string;
  durasi_jam: number;
  instruktur: string;
  persentase_progress: number;
};

type JadwalStats = {
  totalJadwal: number;
  jadwalBerlangsung: number;
  jadwalSelesai: number;
  jadwalMendatang: number;
};

async function getJadwalStats(userId: string): Promise<JadwalStats> {
  const supabase = await createSupabaseServerClient();

  // Total jadwal (semua pendaftaran)
  const { count: totalJadwal, error: errorTotal } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("pengguna_id", userId);

  // Jadwal berlangsung
  const { count: jadwalBerlangsung, error: errorBerlangsung } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("pengguna_id", userId).eq("status", "sedang_belajar");

  // Jadwal selesai
  const { count: jadwalSelesai, error: errorSelesai } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("pengguna_id", userId).eq("status", "selesai");

  // Jadwal mendatang (terdaftar)
  const { count: jadwalMendatang, error: errorMendatang } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("pengguna_id", userId).eq("status", "terdaftar");

  if (errorTotal) console.error("Error fetching total schedule:", errorTotal.message);
  if (errorBerlangsung) console.error("Error fetching ongoing schedule:", errorBerlangsung.message);
  if (errorSelesai) console.error("Error fetching completed schedule:", errorSelesai.message);
  if (errorMendatang) console.error("Error fetching upcoming schedule:", errorMendatang.message);

  return {
    totalJadwal: totalJadwal ?? 0,
    jadwalBerlangsung: jadwalBerlangsung ?? 0,
    jadwalSelesai: jadwalSelesai ?? 0,
    jadwalMendatang: jadwalMendatang ?? 0,
  };
}

async function getJadwalList(userId: string): Promise<JadwalPelatihan[]> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: jadwalData, error } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        status,
        tanggal_daftar,
        tanggal_selesai,
        persentase_progress,
        kursus:kursus_id (
          id,
          judul,
          tanggal_mulai,
          tanggal_selesai,
          tipe_kursus,
          durasi_jam,
          instruktur:instruktur_id (
            nama_lengkap
          )
        )
      `
      )
      .eq("pengguna_id", userId)
      .order("tanggal_daftar", { ascending: false });

    if (error) {
      console.error("Error fetching schedule list:", error.message);
      return [];
    }

    const jadwalList: JadwalPelatihan[] = jadwalData.map((item) => {
      const kursusData = item.kursus as any;
      const instrukturData = kursusData?.instruktur as any;

      return {
        id: item.id,
        judul: kursusData?.judul || "Kursus Tidak Diketahui",
        tanggal_mulai: kursusData?.tanggal_mulai || item.tanggal_daftar,
        tanggal_selesai: kursusData?.tanggal_selesai || item.tanggal_selesai || "",
        status: item.status,
        tipe_kursus: kursusData?.tipe_kursus || "online",
        durasi_jam: kursusData?.durasi_jam || 0,
        instruktur: instrukturData?.nama_lengkap || "Instruktur",
        persentase_progress: item.persentase_progress || 0,
      };
    });

    return jadwalList;
  } catch (error) {
    console.error("Error fetching schedule list:", error);
    return [];
  }
}

export default async function JadwalPesertaPage() {
  // Ambil data user dengan peran
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan atau bukan peserta
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  // Gunakan profile.id untuk query database, bukan auth user.id
  const profileId = userData.profile?.id;

  if (!profileId) {
    console.error("Profile ID not found");
    redirect("/login");
  }

  // Ambil statistik dan daftar jadwal menggunakan profileId
  const stats = await getJadwalStats(profileId);
  const jadwalList = await getJadwalList(profileId);

  return <JadwalContainer user={userData.user as SessionUser} stats={stats} jadwalList={jadwalList} />;
}
