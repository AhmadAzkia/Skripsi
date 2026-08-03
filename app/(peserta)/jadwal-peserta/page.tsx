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

const COURSE_TIME_ZONE = "Asia/Jakarta";

function getTodayDateInCourseTimeZone() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: COURSE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function getDateOnly(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

// Fungsi untuk menentukan status berdasarkan tanggal kalender Indonesia.
function getStatusByDate(
  tanggalMulai: string | null,
  tanggalSelesai: string | null,
  statusDatabase: string,
  today = getTodayDateInCourseTimeZone(),
): string {
  if (statusDatabase === "dibatalkan" || statusDatabase === "menunggu_pembayaran") {
    return statusDatabase;
  }

  const startDate = getDateOnly(tanggalMulai);
  const endDate = getDateOnly(tanggalSelesai);

  if (endDate && today > endDate) {
    return "selesai";
  }

  if (startDate && today >= startDate && (!endDate || today <= endDate)) {
    return "sedang_belajar";
  }

  if (startDate && today < startDate) {
    return "terdaftar";
  }

  return statusDatabase;
}

async function getJadwalStats(userId: string): Promise<JadwalStats> {
  const supabase = await createSupabaseServerClient();
  const today = getTodayDateInCourseTimeZone();

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
    const statusAktual = getStatusByDate(pelatihanData?.tanggal_mulai, pelatihanData?.tanggal_selesai, item.status, today);

    if (statusAktual === "selesai") {
      jadwalSelesai++;
    } else if (statusAktual === "sedang_belajar") {
      jadwalBerlangsung++;
    } else if (statusAktual === "terdaftar") {
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

async function getJadwalList(userId: string): Promise<JadwalPelatihan[]> {
  const supabase = await createSupabaseServerClient();
  const today = getTodayDateInCourseTimeZone();

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
      const tanggalMulai = getDateOnly(pelatihanData?.tanggal_mulai || item.tanggal_daftar);
      const tanggalSelesai = getDateOnly(pelatihanData?.tanggal_selesai || item.tanggal_selesai);
      const statusAktual = getStatusByDate(tanggalMulai, tanggalSelesai, item.status, today);

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
