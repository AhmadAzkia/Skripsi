import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SessionUser } from "@/contexts/AuthContext";
import { Tables } from "@/../types/database";
import BlogPemateriHero from "./BlogPemateriHero";
import BlogPemateriStats from "./BlogPemateriStats";
import BlogPemateriQuickActions from "./BlogPemateriQuickActions";
import BlogPemateriList from "./BlogPemateriList";

type ArtikelItem = {
  id: string;
  judul: string;
  ringkasan: string | null;
  konten: string | null;
  status: "draft" | "review" | "published" | "ditolak";
  slug: string;
  tags: string[] | null;
  gambar_utama_url: string | null;
  dibuat_pada: string;
  diperbarui_pada: string | null;
  dipublikasi_pada: string | null;
  penulis_id: string;
};

async function getBlogPemateriData(userId: string) {
  const supabase = await createSupabaseServerClient();

  try {
    // Get articles created by this instructor
    const { data: articles, error: articlesError } = await supabase
      .from("artikel_blog")
      .select(
        `
        id,
        judul,
        ringkasan,
        konten,
        status,
        slug,
        tags,
        gambar_utama_url,
        dibuat_pada,
        diperbarui_pada,
        dipublikasi_pada,
        penulis_id
      `
      )
      .eq("penulis_id", userId)
      .order("diperbarui_pada", { ascending: false });

    if (articlesError) {
      console.error("Error fetching articles:", articlesError);
    }

    // Transform the data to match our component interface
    const transformedArticles: ArtikelItem[] = (articles || []).map((article: any) => ({
      id: article.id,
      judul: article.judul || "Untitled",
      ringkasan: article.ringkasan,
      konten: article.konten,
      status: article.status as "draft" | "review" | "published" | "ditolak",
      slug: article.slug,
      tags: article.tags,
      gambar_utama_url: article.gambar_utama_url,
      dibuat_pada: article.dibuat_pada,
      diperbarui_pada: article.diperbarui_pada,
      dipublikasi_pada: article.dipublikasi_pada,
      penulis_id: article.penulis_id,
    }));

    // Calculate statistics
    const totalArtikel = transformedArticles.length;
    const artikelPublished = transformedArticles.filter((a) => a.status === "published").length;
    const artikelDraft = transformedArticles.filter((a) => a.status === "draft").length;

    // Mock views data for now (you might want to add a views table later)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const publishedThisMonth = transformedArticles.filter((a) => {
      if (!a.dipublikasi_pada) return false;
      const publishDate = new Date(a.dipublikasi_pada);
      return publishDate.getMonth() === currentMonth && publishDate.getFullYear() === currentYear;
    }).length;

    // Mock calculation for views (multiply published articles this month by random factor)
    const viewsBulanIni = publishedThisMonth * Math.floor(Math.random() * 100) + Math.floor(Math.random() * 500);

    const stats = {
      totalArtikel,
      artikelPublished,
      artikelDraft,
      viewsBulanIni,
    };

    return {
      articles: transformedArticles,
      stats,
    };
  } catch (error) {
    console.error("Error in getBlogPemateriData:", error);
    return {
      articles: [],
      stats: {
        totalArtikel: 0,
        artikelPublished: 0,
        artikelDraft: 0,
        viewsBulanIni: 0,
      },
    };
  }
}

interface BlogPemateriContainerProps {
  user: SessionUser;
}

export default async function BlogPemateriContainer({ user }: BlogPemateriContainerProps) {
  const { articles, stats } = await getBlogPemateriData(user.profile?.id || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-50">
      <BlogPemateriHero user={user} />
      <BlogPemateriStats stats={stats} />
      <BlogPemateriQuickActions />
      <BlogPemateriList articles={articles} />
    </div>
  );
}
