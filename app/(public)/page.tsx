// app/(public)/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "@/../types/database";
import { HomeContainer } from "./components";

type KursusFeatured = Tables<"kursus">;

async function getFeaturedCourses(): Promise<KursusFeatured[]> {
  const supabase = await createSupabaseServerClient();
  const { data: courses, error } = await supabase
    .from("kursus")
    .select("*")
    .eq("status", "published") // Ambil hanya yang sudah published
    .order("dibuat_pada", { ascending: false }) // Urutkan dari yg terbaru
    .limit(3); // Ambil maksimal 3

  if (error) {
    console.error("Gagal mengambil kursus unggulan:", error);
    return [];
  }
  return courses;
}

export default async function Home() {
  const featuredCourses = await getFeaturedCourses();

  return <HomeContainer featuredCourses={featuredCourses} />;
}