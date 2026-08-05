// app/(public)/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "@/../types/database";
import { HomeContainer } from "./components";
import { redirect } from "next/navigation";

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

type HomeProps = {
  searchParams: Promise<{
    error?: string;
    error_code?: string;
    error_description?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  if (params.error || params.error_code || params.error_description) {
    const message =
      params.error_code === "otp_expired"
        ? "Link verifikasi email tidak valid atau sudah kedaluwarsa. Silakan daftar ulang atau minta link baru."
        : params.error_description || "Link autentikasi tidak valid.";

    redirect(`/login?message=${encodeURIComponent(message)}`);
  }

  const featuredCourses = await getFeaturedCourses();

  return <HomeContainer featuredCourses={featuredCourses} />;
}
