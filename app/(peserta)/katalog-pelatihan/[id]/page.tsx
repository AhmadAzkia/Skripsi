import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { redirect, notFound } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import DetailPelatihanContainer from "./components/DetailPelatihanContainer";

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
  maksimal_peserta: number | null;
  instruktur: {
    id: string;
    nama_lengkap: string;
    bio: string | null;
    foto_profil_url: string | null;
  } | null;
};

type RegistrationStatus = {
  isRegistered: boolean;
  registrationData?: {
    id: string;
    status: "terdaftar" | "sedang_belajar" | "selesai" | "dibatalkan";
    tanggal_daftar: string;
  };
};

async function getKursusDetail(id: string): Promise<Kursus | null> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
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
        maksimal_peserta,
        instruktur:instruktur_id (
          id,
          nama_lengkap,
          bio,
          foto_profil_url
        )
      `
      )
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return null;
    }

    return data as Kursus;
  } catch (error) {
    console.error("Error fetching course detail:", error);
    return null;
  }
}

async function getRegistrationStatus(kursusId: string, pesertaId: string): Promise<RegistrationStatus> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("pendaftaran_kursus")
      .select(
        `
        id,
        status,
        tanggal_daftar
      `
      )
      .eq("kursus_id", kursusId)
      .eq("pengguna_id", pesertaId)
      .single();

    if (error || !data) {
      return { isRegistered: false };
    }

    return {
      isRegistered: true,
      registrationData: data,
    };
  } catch (error) {
    console.error("Error fetching registration status:", error);
    return { isRegistered: false };
  }
}

async function getJumlahPeserta(kursusId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();

  try {
    const { count, error } = await supabase.from("pendaftaran_kursus").select("*", { count: "exact", head: true }).eq("kursus_id", kursusId).in("status", ["terdaftar", "sedang_belajar", "selesai"]);

    if (error) {
      console.error("Error fetching participant count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error fetching participant count:", error);
    return 0;
  }
}

export default async function DetailPelatihanPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params untuk Next.js 15
  const { id } = await params;

  // Ambil data user dan profil
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan atau bukan peserta
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  // Ambil detail kursus
  const kursus = await getKursusDetail(id);

  if (!kursus) {
    notFound();
  }

  // Ambil data pendukung secara paralel
  const [registrationStatus, jumlahPeserta] = await Promise.all([getRegistrationStatus(id, userData.profile.id), getJumlahPeserta(id)]);

  return <DetailPelatihanContainer user={userData.user as SessionUser} profile={userData.profile} kursus={kursus} registrationStatus={registrationStatus} jumlahPeserta={jumlahPeserta} />;
}
