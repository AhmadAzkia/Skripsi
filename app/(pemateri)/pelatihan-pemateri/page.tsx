import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PelatihanList from "@/components/pelatihan/PelatihanList";

// Fungsi ini hanya mengambil kursus milik pemateri
async function getKursusSaya(supabase: any, userId: string) {
  // Pertama, dapatkan profil_pengguna.id dari user_id
  const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, nama_lengkap, peran").eq("user_id", userId).single();

  if (profileError || !profile) {
    console.error("Profile not found for user:", userId, profileError);
    return [];
  }

  // Kemudian ambil kursus berdasarkan profil_pengguna.id
  const { data, error } = await supabase.from("kursus").select("*").eq("instruktur_id", profile.id);

  if (error) {
    console.error("Error getting kursus:", error);
    return [];
  }

  return data || [];
}

export default async function PemateriKursusPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Keamanan
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  // (Anda bisa tambahkan cek role pemateri di sini)

  // 2. Ambil Data (Hanya milik pemateri)
  const kursus = await getKursusSaya(supabase, user.id);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Kursus Saya (Pemateri)</h1>

      {/* 3. Render Komponen & Teruskan Data + Role */}
      <PelatihanList kursusData={kursus} userRole="instruktur" />
    </div>
  );
}
