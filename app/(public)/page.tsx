// app/(public)/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "@/../types/database";
import { HomeContainer } from "./components";

type PelatihanFeatured = Tables<"pelatihan">;

async function getFeaturedCourses(): Promise<PelatihanFeatured[]> {
  const supabase = await createSupabaseServerClient();
  const { data: courses, error } = await supabase
    .from("pelatihan")
    .select("*")
    .eq("status", "published") // Ambil hanya yang sudah published
    .order("dibuat_pada", { ascending: false }) // Urutkan dari yg terbaru
    .limit(3); // Ambil maksimal 3

  if (error) {
    console.error("Gagal mengambil pelatihan unggulan:", error);
    return [];
  }
  return courses;
}

export default async function Home() {
  const featuredCourses = await getFeaturedCourses();

  return <HomeContainer featuredCourses={featuredCourses} />;
}