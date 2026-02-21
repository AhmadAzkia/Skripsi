import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PemateriBlogDetail from "./PemateriBlogDetail";
import { getBlogDetailPemateri } from "./actions";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  try {

    const { slug } = await params;

    const supabase = await createSupabaseServerClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    // Get user profile
    const { data: profile } = await supabase.from("profil_pengguna").select("*").eq("user_id", user.id).single();

    if (!profile || profile.peran !== "instruktur") {
      redirect("/auth/login");
    }

    // Get blog detail data using server action
    const result = await getBlogDetailPemateri(user.id, slug);

    if (!result.success || !result.data) {
      redirect("/blog-pemateri");
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-navy/5 via-white to-gold/5">
        <PemateriBlogDetail data={result.data} />
      </div>
    );
  } catch (error) {
    console.error("Error loading blog detail:", error);
    redirect("/blog-pemateri");
  }
}
