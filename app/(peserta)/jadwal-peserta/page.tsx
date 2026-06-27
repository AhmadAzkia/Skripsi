import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import JadwalContainer from "./components/JadwalContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

export type JadwalPelatihan = {
  id: string;
  pelatihan_id: string;
  judul: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  tipe_pelatihan: string;
};

export type JadwalStats = {
  totalJadwal: number;
  jadwalBerlangsung: number;
  jadwalSelesai: number;
  jadwalMendatang: number;
};

async function getJadwalStats(userId: string): Promise<JadwalStats> {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

  // Ambil semua data pendaftaran pelatihan dengan detail pelatihan
  const { data: allJadwal, error: errorFetch } = await supabase
    .from("pendaftaran_pelatihan")
    .select(
      `
      *,
      pelatihan!inner(
        tanggal_mulai,
        tanggal_selesai
      )
    `
    )
    .eq("pengguna_id", userId)
    .not("status", "eq", "dibatalkan"); // Exclude dibatalkan dari perhitungan

  if (errorFetch) {
    console.error("Error fetching schedule data:", errorFetch.message);
    return {
      totalJadwal: 0,
      jadwalBerlangsung: 0,
      jadwalSelesai: 0,
      jadwalMendatang: 0,
    };
  }

  const totalJadwal = allJadwal?.length ?? 0;
  let jadwalBerlangsung = 0;
  let jadwalSelesai = 0;
  let jadwalMendatang = 0;

  // Kategorikan berdasarkan tanggal, bukan status database
  allJadwal?.forEach((item) => {
    const pelatihanData = item.pelatihan as any;
    const tanggalMulai = pelatihanData?.tanggal_mulai;
    const tanggalSelesai = pelatihanData?.tanggal_selesai;

    if (tanggalSelesai && today > tanggalSelesai) {
      // Jika hari ini sudah melewati tanggal selesai -> Selesai
      jadwalSelesai++;
    } else if (tanggalMulai && today >= tanggalMulai && tanggalSelesai && today <= tanggalSelesai) {
      // Jika hari ini antara tanggal mulai dan selesai -> Berlangsung
      jadwalBerlangsung++;
    } else if (tanggalMulai && today < tanggalMulai) {
      // Jika hari ini sebelum tanggal mulai -> Mendatang
      jadwalMendatang++;
    }
  });

  return {
    totalJadwal,
    jadwalBerlangsung,
    jadwalSelesai,
    jadwalMendatang,
  };
}

// Fungsi untuk menentukan status berdasarkan tanggal
function getStatusByDate(tanggalMulai: string, tanggalSelesai: string, statusDatabase: string): string {
  const today = new Date().toISOString().split("T")[0];

  // Jika sudah dibatalkan, tetap dibatalkan
  if (statusDatabase === "dibatalkan") {
    return "dibatalkan";
  }

  if (tanggalSelesai && today > tanggalSelesai) {
    // Jika sudah melewati tanggal selesai -> Selesai
    return "selesai";
  } else if (tanggalMulai && today >= tanggalMulai && tanggalSelesai && today <= tanggalSelesai) {
    // Jika sedang berlangsung -> Sedang belajar
    return "sedang_belajar";
  } else if (tanggalMulai && today < tanggalMulai) {
    // Jika belum dimulai -> Terdaftar
    return "terdaftar";
  }

  // Fallback ke status database jika tidak ada tanggal
  return statusDatabase;
}

async function getJadwalList(userId: string): Promise<JadwalPelatihan[]> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: jadwalData, error } = await supabase
      .from("pendaftaran_pelatihan")
      .select(
        `
        id,
        status,
        tanggal_daftar,
        tanggal_selesai,
        pelatihan:pelatihan_id (
          id,
          judul,
          tanggal_mulai,
          tanggal_selesai,
          tipe_pelatihan
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
      const pelatihanData = item.pelatihan as any;

      // Tentukan status berdasarkan tanggal pelatihan
      const tanggalMulai = pelatihanData?.tanggal_mulai || item.tanggal_daftar;
      const tanggalSelesai = pelatihanData?.tanggal_selesai || item.tanggal_selesai || "";
      const statusAktual = getStatusByDate(tanggalMulai, tanggalSelesai, item.status);

      return {
        id: item.id,
        pelatihan_id: pelatihanData?.id || "",
        judul: pelatihanData?.judul || "Pelatihan Tidak Diketahui",
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        status: statusAktual, // Gunakan status yang sudah dihitung berdasarkan tanggal
        tipe_pelatihan: pelatihanData?.tipe_pelatihan || "online",
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
