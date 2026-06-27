import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";
import MateriContainer from "./components/MateriContainer";

type MateriPelatihan = {
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

type PelatihanDetail = {
  id: string;
  judul: string;
  deskripsi: string;
  tipe_pelatihan: string;
};

async function getPelatihanDetail(pelatihanId: string, userId: string): Promise<PelatihanDetail | null> {
  const supabase = await createSupabaseServerClient();

  try {
    // First, verify user is registered for this course
    const { data: pendaftaranData, error: pendaftaranError } = await supabase.from("pendaftaran_pelatihan").select("id").eq("pelatihan_id", pelatihanId).eq("pengguna_id", userId).single();

    if (pendaftaranError || !pendaftaranData) {
      console.error("User not registered for this course:", pendaftaranError);
      return null;
    }

    // Get course details directly
    const { data: pelatihanData, error: pelatihanError } = await supabase
      .from("pelatihan")
      .select(
        `
        id,
        judul,
        deskripsi,
        tipe_pelatihan
      `
      )
      .eq("id", pelatihanId)
      .single();

    if (pelatihanError || !pelatihanData) {
      console.error("Error fetching course details:", pelatihanError);
      return null;
    }

    return {
      id: pelatihanData.id,
      judul: pelatihanData.judul,
      deskripsi: pelatihanData.deskripsi ?? "",
      tipe_pelatihan: pelatihanData.tipe_pelatihan,
    };
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
}

async function getMateriList(pelatihanId: string): Promise<MateriPelatihan[]> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: materiData, error } = await supabase
      .from("materi_pelatihan")
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
      .eq("pelatihan_id", pelatihanId)
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

export default async function MateriPelatihanPage({ params }: PageProps) {
  const { id: pelatihanId } = await params;

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
  const pelatihanDetail = await getPelatihanDetail(pelatihanId, profileId);
  const materiList = await getMateriList(pelatihanId);

  if (!pelatihanDetail) {
    redirect("/jadwal-peserta");
  }

  return <MateriContainer user={userData.user as SessionUser} pelatihanDetail={pelatihanDetail} materiList={materiList} />;
}
