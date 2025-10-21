import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import MateriContainer from "./components/MateriContainer";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

type MateriPelajaran = {
  id: string;
  judul: string;
  deskripsi: string | null;
  durasi_menit: number | null;
  urutan: number;
  video_url: string | null;
  konten: string;
  kursus: {
    id: string;
    judul: string;
  };
  progress: {
    persentase_progress: number | null;
    selesai_pada: string | null;
  } | null;
};

type MateriStats = {
  totalMateriCount: number;
  materiSelesaiCount: number;
  materiSedangBelajarCount: number;
  totalKursusCount: number;
};

type Kursus = {
  id: string;
  judul: string;
};

async function getMateriStats(userId: string): Promise<MateriStats> {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Hitung total kursus yang diikuti peserta
    const { count: totalKursusCount, error: errorKursus } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("pengguna_id", userId).in("status", ["terdaftar", "sedang_belajar", "selesai"]);

    // 2. Hitung total materi dari semua kursus yang diikuti
    const { count: totalMateriCount, error: errorMateri } = await supabase
      .from("materi_pelajaran")
      .select(
        `
        *,
        kursus!inner(
          pendaftaran_kursus!inner(*)
        )
      `,
        { count: "exact", head: true }
      )
      .eq("kursus.pendaftaran_kursus.pengguna_id", userId);

    // 3. Hitung materi yang sudah selesai
    const { count: materiSelesaiCount, error: errorSelesai } = await supabase
      .from("progres_belajar")
      .select(
        `
        *,
        pendaftaran_id!inner(
          pengguna_id
        )
      `,
        { count: "exact", head: true }
      )
      .eq("pendaftaran_id.pengguna_id", userId)
      .not("selesai_pada", "is", null);

    // 4. Hitung materi yang sedang dipelajari
    const { count: materiSedangBelajarCount, error: errorSedangBelajar } = await supabase
      .from("progres_belajar")
      .select(
        `
        *,
        pendaftaran_id!inner(
          pengguna_id
        )
      `,
        { count: "exact", head: true }
      )
      .eq("pendaftaran_id.pengguna_id", userId)
      .is("selesai_pada", null)
      .gt("persentase_progress", 0);

    if (errorKursus) console.error("Error fetching kursus count:", errorKursus.message);
    if (errorMateri) console.error("Error fetching materi count:", errorMateri.message);
    if (errorSelesai) console.error("Error fetching completed materi:", errorSelesai.message);
    if (errorSedangBelajar) console.error("Error fetching in-progress materi:", errorSedangBelajar.message);

    return {
      totalKursusCount: totalKursusCount ?? 0,
      totalMateriCount: totalMateriCount ?? 0,
      materiSelesaiCount: materiSelesaiCount ?? 0,
      materiSedangBelajarCount: materiSedangBelajarCount ?? 0,
    };
  } catch (error) {
    console.error("Error getting materi stats:", error);
    return {
      totalKursusCount: 0,
      totalMateriCount: 0,
      materiSelesaiCount: 0,
      materiSedangBelajarCount: 0,
    };
  }
}

async function getMateriList(userId: string): Promise<MateriPelajaran[]> {
  const supabase = await createSupabaseServerClient();

  try {
    // Ambil semua pendaftaran kursus untuk user
    const { data: pendaftaranData, error: pendaftaranError } = await supabase.from("pendaftaran_kursus").select("id, kursus_id").eq("pengguna_id", userId).in("status", ["terdaftar", "sedang_belajar", "selesai"]);

    if (pendaftaranError || !pendaftaranData || pendaftaranData.length === 0) {
      return [];
    }

    const kursusIds = pendaftaranData.map((p) => p.kursus_id);
    const pendaftaranIds = pendaftaranData.map((p) => p.id);

    // Ambil semua materi dari kursus yang diikuti
    const { data: materiData, error: materiError } = await supabase
      .from("materi_pelajaran")
      .select(
        `
        id,
        judul,
        deskripsi,
        durasi_menit,
        urutan,
        video_url,
        konten,
        kursus_id,
        kursus:kursus_id (
          id,
          judul
        )
      `
      )
      .in("kursus_id", kursusIds)
      .order("kursus_id")
      .order("urutan");

    if (materiError || !materiData) {
      console.error("Error fetching materi:", materiError?.message);
      return [];
    }

    // Ambil progress untuk setiap materi
    const materiIds = materiData.map((m) => m.id);
    const { data: progressData, error: progressError } = await supabase.from("progres_belajar").select("materi_id, persentase_progress, selesai_pada").in("materi_id", materiIds).in("pendaftaran_id", pendaftaranIds);

    if (progressError) {
      console.error("Error fetching progress:", progressError.message);
    }

    // Gabungkan data materi dengan progress
    const result: MateriPelajaran[] = materiData.map((materi) => {
      const progress = progressData?.find((p) => p.materi_id === materi.id);

      return {
        id: materi.id,
        judul: materi.judul,
        deskripsi: materi.deskripsi,
        durasi_menit: materi.durasi_menit,
        urutan: materi.urutan,
        video_url: materi.video_url,
        konten: materi.konten,
        kursus: {
          id: (materi.kursus as any)?.id || materi.kursus_id,
          judul: (materi.kursus as any)?.judul || "Kursus",
        },
        progress: progress
          ? {
              persentase_progress: progress.persentase_progress,
              selesai_pada: progress.selesai_pada,
            }
          : null,
      };
    });

    return result;
  } catch (error) {
    console.error("Error getting materi list:", error);
    return [];
  }
}

async function getKursusOptions(userId: string): Promise<Kursus[]> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        kursus:kursus_id (
          id,
          judul
        )
      `
      )
      .eq("pengguna_id", userId)
      .in("status", ["terdaftar", "sedang_belajar", "selesai"]);

    if (error || !data) {
      console.error("Error fetching kursus options:", error?.message);
      return [];
    }

    return data
      .map((item) => ({
        id: (item.kursus as any)?.id || "",
        judul: (item.kursus as any)?.judul || "Kursus",
      }))
      .filter((kursus) => kursus.id); // Filter out any invalid entries
  } catch (error) {
    console.error("Error getting kursus options:", error);
    return [];
  }
}

export default async function MateriPesertaPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  // 1. Jalankan kode BE di server untuk mendapatkan data materi
  const stats = userData.user.id
    ? await getMateriStats(userData.user.id)
    : {
        totalKursusCount: 0,
        totalMateriCount: 0,
        materiSelesaiCount: 0,
        materiSedangBelajarCount: 0,
      };

  const materiList = userData.user.id ? await getMateriList(userData.user.id) : [];

  const kursusOptions = userData.user.id ? await getKursusOptions(userData.user.id) : [];

  // 2. Render komponen FE dan kirimkan data sebagai props
  return <MateriContainer user={userData.user as SessionUser} stats={stats} materiList={materiList} kursusOptions={kursusOptions} />;
}
