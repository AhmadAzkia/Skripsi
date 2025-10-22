import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SessionUser } from "@/contexts/AuthContext";
import { Tables } from "@/../types/database";
import MateriPemateriHero from "./MateriPemateriHero";
import MateriPemateriStats from "./MateriPemateriStats";
import MateriPemateriQuickActions from "./MateriPemateriQuickActions";
import MateriPemateriList from "./MateriPemateriList";

type MateriItem = {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  status: "draft" | "published" | "archived";
  tanggalDibuat: string;
  tanggalUpdate: string;
  jumlahPeserta: number;
  durasi: string;
  tipeMateri: "video" | "pdf" | "presentasi" | "text";
};

async function getMateriPemateriData(userId: string) {
  const supabase = await createSupabaseServerClient();

  try {
    // Get materials created by this instructor
    const { data: materials, error: materialsError } = await supabase
      .from("materi_pelajaran")
      .select(
        `
        id,
        judul,
        deskripsi,
        created_at,
        updated_at,
        durasi_menit,
        konten
      `
      )
      .eq("kursus_id", userId) // Assuming kursus is linked to instructor
      .order("updated_at", { ascending: false });

    if (materialsError) {
      console.error("Error fetching materials:", materialsError);
    }

    // Transform the data to match our component interface
    const transformedMaterials: MateriItem[] = (materials || []).map((material: any) => ({
      id: material.id,
      judul: material.judul || "Untitled",
      deskripsi: material.deskripsi || "No description",
      kategori: "Programming", // Mock category for now
      status: "published" as const,
      tanggalDibuat: material.created_at,
      tanggalUpdate: material.updated_at,
      jumlahPeserta: Math.floor(Math.random() * 50) + 1, // Mock data for now
      durasi: material.durasi_menit ? `${material.durasi_menit} menit` : "Tidak diketahui",
      tipeMateri: "text" as const,
    }));

    // Calculate statistics
    const totalMateri = transformedMaterials.length;
    const materiAktif = transformedMaterials.filter((m) => m.status === "published").length;
    const totalKursus = Math.ceil(totalMateri / 3); // Mock calculation
    const currentMonth = new Date().getMonth();
    const materiTerbaru = transformedMaterials.filter((m) => new Date(m.tanggalDibuat).getMonth() === currentMonth).length;

    const stats = {
      totalMateri,
      materiAktif,
      totalKursus,
      materiTerbaru,
    };

    return {
      materials: transformedMaterials,
      stats,
    };
  } catch (error) {
    console.error("Error in getMateriPemateriData:", error);
    return {
      materials: [],
      stats: {
        totalMateri: 0,
        materiAktif: 0,
        totalKursus: 0,
        materiTerbaru: 0,
      },
    };
  }
}

interface MateriPemateriContainerProps {
  user: SessionUser;
}

export default async function MateriPemateriContainer({ user }: MateriPemateriContainerProps) {
  const { materials, stats } = await getMateriPemateriData(user.profile?.id || user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-50">
      <MateriPemateriHero user={user} />
      <MateriPemateriStats stats={stats} />
      <MateriPemateriQuickActions />
      <MateriPemateriList materials={materials} />
    </div>
  );
}
