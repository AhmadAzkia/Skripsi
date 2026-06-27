import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { redirect, notFound } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import DetailPelatihanContainer from "./components/DetailPelatihanContainer";

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
  maksimal_peserta: number | null;
};

type RegistrationStatus = {
  isRegistered: boolean;
  registrationData?: {
    id: string;
    status: "terdaftar" | "sedang_belajar" | "selesai" | "dibatalkan";
    tanggal_daftar: string;
  };
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

async function getPelatihanDetail(id: string): Promise<Pelatihan | null> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
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
        thumbnail_url,
        maksimal_peserta
      `,
      )
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return null;
    }

    if (!isPelatihanAktif(data.tanggal_selesai)) {
      return null;
    }

    return data as Pelatihan;
  } catch (error) {
    console.error("Error fetching course detail:", error);
    return null;
  }
}

async function getRegistrationStatus(pelatihanId: string, pesertaId: string): Promise<RegistrationStatus> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from("pendaftaran_pelatihan")
      .select(
        `
        id,
        status,
        tanggal_daftar
      `,
      )
      .eq("pelatihan_id", pelatihanId)
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

async function getJumlahPeserta(pelatihanId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();

  try {
    const { count, error } = await supabase.from("pendaftaran_pelatihan").select("*", { count: "exact", head: true }).eq("pelatihan_id", pelatihanId).in("status", ["terdaftar", "sedang_belajar", "selesai"]);

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

  // Ambil detail pelatihan
  const pelatihan = await getPelatihanDetail(id);

  if (!pelatihan) {
    notFound();
  }

  // Ambil data pendukung secara paralel
  const [registrationStatus, jumlahPeserta] = await Promise.all([getRegistrationStatus(id, userData.profile.id), getJumlahPeserta(id)]);

  return <DetailPelatihanContainer user={userData.user as SessionUser} profile={userData.profile} pelatihan={pelatihan} registrationStatus={registrationStatus} jumlahPeserta={jumlahPeserta} />;
}
