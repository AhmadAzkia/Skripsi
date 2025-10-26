import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MateriListClient from "./components/MateriListClient";
import { getMateriPemateri, getKursusPemateriOptions } from "./actions";

export default async function MateriPemateriPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Get user profile data
  const { data: userData, error: profileError } = await supabase.from("profil_pengguna").select("*").eq("user_id", user.id).single();

  if (profileError || !userData || userData.peran !== "instruktur") {
    redirect("/dashboard");
  }

  // Ambil data materi dan kursus options
  const [materiResult, kursusResult] = await Promise.all([getMateriPemateri(user.id), getKursusPemateriOptions(user.id)]);

  if (!materiResult.success) {
    console.error("Error fetching materi:", materiResult.error);
    redirect("/dashboard");
  }

  if (!kursusResult.success) {
    console.error("Error fetching kursus options:", kursusResult.error);
    redirect("/dashboard");
  }

  const materiList = materiResult.data || [];
  const kursusOptions = kursusResult.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-2">Materi Saya</h1>
                <p className="text-gray-600">Daftar semua materi yang telah Anda upload untuk pelatihan</p>
              </div>
              <div className="text-sm text-gray-500">
                Total: <span className="font-semibold text-navy">{materiList.length}</span> materi
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Client Component dengan Search & Filter */}
        <MateriListClient initialMateri={materiList} kursusOptions={kursusOptions} userId={user.id} />
      </div>
    </div>
  );
}
