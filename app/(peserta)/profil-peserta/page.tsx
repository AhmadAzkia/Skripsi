import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import ProfilContainer from "./components/ProfilContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import type { Tables } from "@/../types/database";

type ProfilStats = {
  totalPelatihan: number;
  pelatihanSelesai: number;
  totalSertifikat: number;
  waktuBelajar: number;
};

type ProfileData = Pick<Tables<'profil_pengguna'>, 'id' | 'nama_lengkap' | 'email' | 'nomor_hp' | 'bio' | 'dibuat_pada' | 'diperbarui_pada' | 'is_aktif'>;

async function getProfilStats(userId: string): Promise<ProfilStats> {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Hitung Total Pelatihan yang Pernah Didaftar
    const { count: totalPelatihan, error: errorTotal } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("pengguna_id", userId);

    // 2. Hitung Pelatihan yang Selesai
    const { count: pelatihanSelesai, error: errorSelesai } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("pengguna_id", userId).eq("status", "selesai");

    // 3. Hitung Total Sertifikat
    const { count: totalSertifikat, error: errorSertifikat } = await supabase.from("sertifikat").select("*", { count: "exact", head: true }).eq("peserta_id", userId).eq("status", "terbit");

    // 4. Hitung Waktu Belajar (estimasi dari durasi kursus yang diikuti)
    const { data: kursusData, error: errorKursus } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        kursus:kursus_id (
          durasi_jam
        )
      `
      )
      .eq("pengguna_id", userId)
      .eq("status", "selesai");

    let waktuBelajar = 0;
    if (kursusData && !errorKursus) {
      waktuBelajar = kursusData.reduce((total, item) => {
        const kursus = item.kursus as any;
        return total + (kursus?.durasi_jam || 0);
      }, 0);
    }

    if (errorTotal) console.error("Error fetching total courses:", errorTotal.message);
    if (errorSelesai) console.error("Error fetching completed courses:", errorSelesai.message);
    if (errorSertifikat) console.error("Error fetching certificates:", errorSertifikat.message);
    if (errorKursus) console.error("Error fetching course duration:", errorKursus.message);

    return {
      totalPelatihan: totalPelatihan ?? 0,
      pelatihanSelesai: pelatihanSelesai ?? 0,
      totalSertifikat: totalSertifikat ?? 0,
      waktuBelajar: waktuBelajar,
    };
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    return {
      totalPelatihan: 0,
      pelatihanSelesai: 0,
      totalSertifikat: 0,
      waktuBelajar: 0,
    };
  }
}

async function getProfileData(userId: string): Promise<ProfileData | null> {
  const supabase = await createSupabaseServerClient();
  const { data: profile, error } = await supabase
    .from('profil_pengguna')
    .select('id, nama_lengkap, email, nomor_hp, bio, dibuat_pada, diperbarui_pada, is_aktif') // Select all needed fields
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
  return profile;
}

export default async function ProfilPesertaPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // 1. Jalankan kode BE di server untuk mendapatkan statistik profil
  const stats = userData.user.id
    ? await getProfilStats(userData.user.id)
    : {
        totalPelatihan: 0,
        pelatihanSelesai: 0,
        totalSertifikat: 0,
        waktuBelajar: 0,
      };

  // 2. Render komponen FE dan kirimkan data user & statistik sebagai props
  return <ProfilContainer user={userData.user as SessionUser} stats={stats} />;
}
