// app/(public)/jadwal-pelatihan/page.tsx

import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import JadwalContainer from "./components/JadwalContainer";
import { Tables } from "@/types/database";

export type JadwalWithInstructor = Tables<"kursus"> & {
  profil_pengguna: Pick<Tables<"profil_pengguna">, "nama_lengkap"> | null;
};

async function getJadwalPelatihan(): Promise<JadwalWithInstructor[]> {
  const supabase = await createSupabaseServerClient();

  const { data: jadwal, error } = await supabase
    .from("kursus")
    .select(
      `
      *,
      profil_pengguna ( nama_lengkap )
    `
    )
    .eq("status", "published")
    .order("tanggal_mulai", { ascending: true });

  if (error) {
    console.error("Gagal mengambil jadwal pelatihan:", error);
    return [];
  }
  return jadwal;
}

export default async function JadwalPelatihanPage() {
  const jadwal = await getJadwalPelatihan();

  return (
    <div className="min-h-screen bg-white">
      <JadwalContainer initialJadwal={jadwal} />
    </div>
  );
}
