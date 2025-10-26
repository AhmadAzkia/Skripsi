import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditMateriFormComponent from "./components/EditMateriFormComponent";

interface Props {
  params: {
    id: string;
    materi_id: string;
  };
}

async function getMateriData(kursusId: string, materiId: string) {
  const supabase = await createSupabaseServerClient();

  // Verify user authentication
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, peran").eq("user_id", user.id).single();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (profile.peran !== "instruktur") {
    redirect("/");
  }

  // Get kursus data with ownership verification
  const { data: kursus, error: kursusError } = await supabase.from("kursus").select("id, judul, deskripsi").eq("id", kursusId).eq("instruktur_id", profile.id).single();

  if (kursusError || !kursus) {
    redirect("/pelatihan-pemateri");
  }

  // Get materi data
  const { data: materi, error: materiError } = await supabase.from("materi_kursus").select("*").eq("id", materiId).eq("kursus_id", kursusId).single();

  if (materiError || !materi) {
    redirect(`/pelatihan-pemateri/${kursusId}/materi`);
  }

  return { kursus, materi };
}

export default async function EditMateriPage({ params }: Props) {
  const { kursus, materi } = await getMateriData(params.id, params.materi_id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="/pelatihan-pemateri" className="hover:text-navy transition-colors">
              Pelatihan Saya
            </a>
            <span>/</span>
            <a href={`/pelatihan-pemateri/${params.id}/materi`} className="hover:text-navy transition-colors">
              {kursus.judul}
            </a>
            <span>/</span>
            <span className="text-navy font-medium">Edit Materi</span>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2">Edit Materi</h1>
          <p className="text-gray-600">
            Edit materi: <strong>{materi.judul}</strong>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <EditMateriFormComponent kursusId={params.id} materi={materi} />
        </div>
      </div>
    </div>
  );
}
