// app/(peserta)/sertifikat/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user"; // Helper user
import SertifikatContainer from "./components/SertifikatContainer"; // Komponen container baru
import { redirect } from "next/navigation";
import { Tables } from "@/../types/database";
import type { SessionUser } from "@/contexts/AuthContext";

export type CertificateWithCourse = Tables<"sertifikat"> & {
  kursus: Pick<Tables<"kursus">, "judul" | "kategori"> | null; // Ambil 'judul' dan 'kategori' dari kursus
};

type SertifikatStats = {
  totalSertifikat: number;
  sertifikatBulanIni: number;
  kategoriTerlengkap: string;
  rataRataNilai: number;
};

async function getCertificates(userId: string): Promise<CertificateWithCourse[]> {
  const supabase = await createSupabaseServerClient();

  // Pertama, dapatkan ID profil pengguna berdasarkan user_id dari auth
  const { data: profile, error: profileError } = await supabase
    .from("profil_pengguna")
    .select("id") // Ambil ID dari tabel profil_pengguna
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile ID for certificates:", profileError?.message);
    return []; // Kembalikan array kosong jika profil tidak ditemukan
  }

  const profileId = profile.id; // ID dari tabel profil_pengguna

  // Kedua, ambil data sertifikat berdasarkan profileId
  const { data: certificates, error: certError } = await supabase
    .from("sertifikat")
    .select(
      `
      *,
      kursus ( judul, kategori )
    `
    )
    .eq("peserta_id", profileId) // Filter berdasarkan ID profil pengguna
    .eq("status", "terbit") // Ambil hanya sertifikat yang sudah terbit
    .order("tanggal_terbit", { ascending: false }); // Urutkan dari yang terbaru

  if (certError) {
    console.error("Gagal mengambil data sertifikat:", certError);
    return [];
  }

  // Pastikan data yang dikembalikan sesuai tipe CertificateWithCourse
  return certificates as CertificateWithCourse[];
}

async function getSertifikatStats(userId: string, certificates: CertificateWithCourse[]): Promise<SertifikatStats> {
  const supabase = await createSupabaseServerClient();

  // Ambil profile ID untuk user ini
  const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id").eq("user_id", userId).single();

  if (profileError || !profile) {
    return {
      totalSertifikat: 0,
      sertifikatBulanIni: 0,
      kategoriTerlengkap: "Belum Ada",
      rataRataNilai: 0,
    };
  }

  const profileId = profile.id;

  // 1. Total sertifikat (dari data yang sudah diambil)
  const totalSertifikat = certificates.length;

  // 2. Sertifikat bulan ini
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const sertifikatBulanIni = certificates.filter((cert) => {
    const certDate = new Date(cert.tanggal_terbit);
    return certDate.getMonth() === currentMonth && certDate.getFullYear() === currentYear;
  }).length;

  // 3. Kategori terlengkap (kategori dengan sertifikat terbanyak)
  const kategoriCount: { [key: string]: number } = {};
  certificates.forEach((cert) => {
    const kategori = (cert.kursus as any)?.kategori || "Lainnya";
    kategoriCount[kategori] = (kategoriCount[kategori] || 0) + 1;
  });

  const kategoriTerlengkap = Object.keys(kategoriCount).length > 0 ? Object.keys(kategoriCount).reduce((a, b) => (kategoriCount[a] > kategoriCount[b] ? a : b)) : "Belum Ada";

  // 4. Rata-rata nilai (placeholder - bisa diambil dari tabel nilai jika ada)
  // Untuk sementara, kita asumsikan nilai default 85
  const rataRataNilai = totalSertifikat > 0 ? 85 : 0;

  return {
    totalSertifikat,
    sertifikatBulanIni,
    kategoriTerlengkap,
    rataRataNilai,
  };
}

export default async function SertifikatPage() {
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // 1. Jalankan kode BE di server untuk mendapatkan data sertifikat
  const certificates = userData.user.id ? await getCertificates(userData.user.id) : [];

  // 2. Dapatkan statistik sertifikat
  const stats = userData.user.id
    ? await getSertifikatStats(userData.user.id, certificates)
    : {
        totalSertifikat: 0,
        sertifikatBulanIni: 0,
        kategoriTerlengkap: "Belum Ada",
        rataRataNilai: 0,
      };

  // 3. Render komponen FE dan kirimkan data user, sertifikat, dan stats sebagai props
  return <SertifikatContainer user={userData.user as SessionUser} certificates={certificates} stats={stats} />;
}
