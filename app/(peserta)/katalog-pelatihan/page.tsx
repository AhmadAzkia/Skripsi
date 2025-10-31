import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import KatalogContainer from "./components/KatalogContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type KatalogStats = {
  totalKursusCount: number;
  kategoriCount: number;
  instrukturCount: number;
};

type Kursus = {
  id: string;
  judul: string;
  deskripsi: string | null;
  harga: number;
  kategori: string;
  tipe_kursus: "online" | "offline" | "hybrid";
  status: "draft" | "published" | "archived";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  thumbnail_url: string | null;
  instruktur: {
    nama_lengkap: string;
  } | null;
};

async function getKatalogStats(): Promise<KatalogStats> {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Hitung Total Kursus yang Published
    const { count: totalKursusCount, error: errorKursus } = await supabase.from("kursus").select("*", { count: "exact", head: true }).eq("status", "published");

    // 2. Hitung Jumlah Kategori Unik
    const { data: kategoriData, error: errorKategori } = await supabase.from("kursus").select("kategori").eq("status", "published");

    const kategoriUnik = kategoriData ? [...new Set(kategoriData.map((item) => item.kategori))] : [];

    // 3. Hitung Jumlah Instruktur
    const { count: instrukturCount, error: errorInstruktur } = await supabase.from("profil_pengguna").select("*", { count: "exact", head: true }).eq("peran", "instruktur").eq("is_aktif", true);

    if (errorKursus) console.error("Error fetching courses count:", errorKursus.message);
    if (errorKategori) console.error("Error fetching categories:", errorKategori.message);
    if (errorInstruktur) console.error("Error fetching instructors count:", errorInstruktur.message);

    return {
      totalKursusCount: totalKursusCount ?? 0,
      kategoriCount: kategoriUnik.length,
      instrukturCount: instrukturCount ?? 0,
    };
  } catch (error) {
    console.error("Error fetching catalog stats:", error);
    return {
      totalKursusCount: 0,
      kategoriCount: 0,
      instrukturCount: 0,
    };
  }
}

async function getKursusList(): Promise<{ kursusList: Kursus[]; kategoriList: string[] }> {
  const supabase = await createSupabaseServerClient();

  try {
    // Ambil semua kursus yang published dengan data instruktur
    const { data: kursusData, error: kursusError } = await supabase
      .from("kursus")
      .select(
        `
        id,
        judul,
        deskripsi,
        harga,
        kategori,
        tipe_kursus,
        status,
        tanggal_mulai,
        tanggal_selesai,
        thumbnail_url,
        instruktur:instruktur_id (
          nama_lengkap
        )
      `
      )
      .eq("status", "published")
      .order("dibuat_pada", { ascending: false });

    if (kursusError) {
      console.error("Error fetching courses:", kursusError.message);
      return { kursusList: [], kategoriList: [] };
    }

    const kursusList = kursusData || [];
    const kategoriList = [...new Set(kursusList.map((kursus) => kursus.kategori))];

    return {
      kursusList: kursusList as Kursus[],
      kategoriList,
    };
  } catch (error) {
    console.error("Error fetching courses list:", error);
    return { kursusList: [], kategoriList: [] };
  }
}

export default async function KatalogPelatihanPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // 1. Jalankan kode BE di server untuk mendapatkan statistik dan daftar kursus
  const [stats, { kursusList, kategoriList }] = await Promise.all([getKatalogStats(), getKursusList()]);

  // 2. Render komponen FE dan kirimkan data sebagai props
  return <KatalogContainer user={userData.user as SessionUser} stats={stats} kursusList={kursusList} kategoriList={kategoriList} />;
}
