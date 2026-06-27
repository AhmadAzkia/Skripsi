import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import KatalogContainer from "./components/KatalogContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type KatalogStats = {
  totalPelatihanCount: number;
  kategoriCount: number;
};

type Pelatihan = {
  id: string;
  judul: string;
  deskripsi: string | null;
  harga: number;
  kategori: string;
  tipe_pelatihan: "online" | "offline";
  status: "draft" | "published" | "archived";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  thumbnail_url: string | null;
};

function isPelatihanAktif(tanggalSelesai: string | null) {
  if (!tanggalSelesai) {
    return true;
  }

  const endDate = new Date(tanggalSelesai);
  const today = new Date();
  endDate.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);

  return endDate >= today;
}

async function getKatalogStats(): Promise<KatalogStats> {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Ambil pelatihan published yang belum melewati tanggal selesai
    const { data: pelatihanData, error: errorPelatihan } = await supabase.from("pelatihan").select("kategori, tanggal_selesai").eq("status", "published");

    const pelatihanAktif = pelatihanData ? pelatihanData.filter((item) => isPelatihanAktif(item.tanggal_selesai)) : [];

    // 2. Hitung Jumlah Kategori Unik dari pelatihan aktif
    const kategoriUnik = [...new Set(pelatihanAktif.map((item) => item.kategori))];

    if (errorPelatihan) console.error("Error fetching courses count:", errorPelatihan.message);

    return {
      totalPelatihanCount: pelatihanAktif.length,
      kategoriCount: kategoriUnik.length,
    };
  } catch (error) {
    console.error("Error fetching catalog stats:", error);
    return {
      totalPelatihanCount: 0,
      kategoriCount: 0,
    };
  }
}

async function getPelatihanList(): Promise<{ pelatihanList: Pelatihan[]; kategoriList: string[] }> {
  const supabase = await createSupabaseServerClient();

  try {
    // Ambil semua pelatihan yang published, lalu buang yang sudah lewat tanggal selesai
    const { data: pelatihanData, error: pelatihanError } = await supabase
      .from("pelatihan")
      .select(
        `
        id,
        judul,
        deskripsi,
        harga,
        kategori,
        tipe_pelatihan,
        status,
        tanggal_mulai,
        tanggal_selesai,
        thumbnail_url
      `,
      )
      .eq("status", "published")
      .order("dibuat_pada", { ascending: false });

    if (pelatihanError) {
      console.error("Error fetching courses:", pelatihanError.message);
      return { pelatihanList: [], kategoriList: [] };
    }

    const pelatihanList = (pelatihanData || []).filter((pelatihan) => isPelatihanAktif(pelatihan.tanggal_selesai));
    const kategoriList = [...new Set(pelatihanList.map((pelatihan) => pelatihan.kategori))];

    return {
      pelatihanList: pelatihanList as Pelatihan[],
      kategoriList,
    };
  } catch (error) {
    console.error("Error fetching courses list:", error);
    return { pelatihanList: [], kategoriList: [] };
  }
}

export default async function KatalogPelatihanPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // 1. Jalankan kode BE di server untuk mendapatkan statistik dan daftar pelatihan
  const [stats, { pelatihanList, kategoriList }] = await Promise.all([getKatalogStats(), getPelatihanList()]);

  // 2. Render komponen FE dan kirimkan data sebagai props
  return <KatalogContainer user={userData.user as SessionUser} stats={stats} pelatihanList={pelatihanList} kategoriList={kategoriList} />;
}
