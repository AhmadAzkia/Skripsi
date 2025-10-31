import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import MateriContainer from "./components/MateriContainer";

type MateriKursus = {
  id: string;
  judul: string;
  deskripsi: string;
  tipe_materi: string;
  urutan: number;
  konten: string;
  video_url?: string | null;
  file_attachment?: any;
  zoom_link?: string | null;
};

type KursusDetail = {
  id: string;
  judul: string;
  deskripsi: string;
  instruktur_nama: string;
  tipe_kursus: string;
};

async function getKursusDetail(kursusId: string, userId: string): Promise<KursusDetail | null> {
  const supabase = await createSupabaseServerClient();

  try {
    // First, verify user is registered for this course
    const { data: pendaftaranData, error: pendaftaranError } = await supabase.from("pendaftaran_kursus").select("id").eq("kursus_id", kursusId).eq("pengguna_id", userId).single();

    if (pendaftaranError || !pendaftaranData) {
      console.error("User not registered for this course:", pendaftaranError);
      return null;
    }

    // Get course details directly
    const { data: kursusData, error: kursusError } = await supabase
      .from("kursus")
      .select(
        `
        id,
        judul,
        deskripsi,
        tipe_kursus,
        instruktur:instruktur_id (
          nama_lengkap
        )
      `
      )
      .eq("id", kursusId)
      .single();

    if (kursusError || !kursusData) {
      console.error("Error fetching course details:", kursusError);
      return null;
    }

    const instrukturData = kursusData?.instruktur as any;

    return {
      id: kursusData.id,
      judul: kursusData.judul,
      deskripsi: kursusData.deskripsi ?? "",
      instruktur_nama: instrukturData?.nama_lengkap || "Instruktur",
      tipe_kursus: kursusData.tipe_kursus,
    };
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
}

async function getMateriList(kursusId: string): Promise<MateriKursus[]> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: materiData, error } = await supabase
      .from("materi_kursus")
      .select(
        `
        id,
        judul,
        deskripsi,
        tipe_materi,
        file_url,
        zoom_link,
        urutan
      `
      )
      .eq("kursus_id", kursusId)
      .order("urutan", { ascending: true });

    if (error) {
      console.error("Error fetching materi list:", error);
      return [];
    }

    const mappedData = materiData.map((item: any) => ({
      id: item.id,
      judul: item.judul,
      deskripsi: item.deskripsi,
      tipe_materi: item.tipe_materi,
      urutan: item.urutan,
      konten: item.file_url || item.zoom_link, // Use file_url or zoom_link as content reference
      video_url: null, // No longer supporting video type
      file_attachment: item.file_url,
      zoom_link: item.zoom_link,
    }));

    return mappedData;
  } catch (error) {
    console.error("Error fetching materi list:", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MateriKursusPage({ params }: PageProps) {
  const { id: kursusId } = await params;

  // Get user data with role
  const userData = await getUserWithRole();

  // Guard clause for authentication and role
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  // Get profile ID for database queries
  const profileId = userData.profile?.id;

  if (!profileId) {
    console.error("Profile ID not found");
    redirect("/login");
  }

  // Fetch course details and materials
  const kursusDetail = await getKursusDetail(kursusId, profileId);
  const materiList = await getMateriList(kursusId);

  if (!kursusDetail) {
    redirect("/jadwal-peserta");
  }

  return <MateriContainer user={userData.user as SessionUser} kursusDetail={kursusDetail} materiList={materiList} />;
}
