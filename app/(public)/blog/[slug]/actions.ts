import { createSupabaseServerClient } from "../../../lib/supabase/server";

export interface PublicBlogDetailData {
  article: {
    id: string;
    judul: string;
    ringkasan: string | null;
    konten: string | null;
    slug: string;
    gambar_utama_url: string | null;
    tags: string[] | null;
    dipublikasi_pada: string | null;
    diperbarui_pada: string | null;
    penulis: {
      id: string;
      nama_lengkap: string;
      foto_profil_url: string | null;
      bio: string | null;
    };
  };
  relatedArticles: Array<{
    id: string;
    judul: string;
    ringkasan: string | null;
    slug: string;
    gambar_utama_url: string | null;
    dipublikasi_pada: string | null;
    tags: string[] | null;
    penulis: {
      nama_lengkap: string;
      foto_profil_url: string | null;
    };
  }>;
  authorArticles: Array<{
    id: string;
    judul: string;
    ringkasan: string | null;
    slug: string;
    gambar_utama_url: string | null;
    dipublikasi_pada: string | null;
  }>;
}

export async function getPublicBlogDetail(slug: string): Promise<{ success: boolean; data?: PublicBlogDetailData; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get article by slug with author info (public access)
    const { data: article, error: articleError } = await supabase
      .from("artikel_blog")
      .select(
        `
        *,
        penulis:profil_pengguna!artikel_blog_penulis_id_fkey (
          id,
          nama_lengkap,
          foto_profil_url,
          bio
        )
      `
      )
      .eq("slug", slug)
      .eq("status", "published") // Only published articles
      .single();

    if (articleError || !article) {
      return { success: false, error: "Article not found" };
    }

    // Get related articles (same tags or same author, different article)
    const { data: relatedArticles = [] } = await supabase
      .from("artikel_blog")
      .select(
        `
        id,
        judul,
        ringkasan,
        slug,
        gambar_utama_url,
        dipublikasi_pada,
        tags,
        penulis:profil_pengguna!artikel_blog_penulis_id_fkey (
          nama_lengkap,
          foto_profil_url
        )
      `
      )
      .eq("status", "published")
      .neq("id", article.id)
      .order("dipublikasi_pada", { ascending: false })
      .limit(3);

    // Get other articles from same author
    const { data: authorArticles = [] } = await supabase
      .from("artikel_blog")
      .select(
        `
        id,
        judul,
        ringkasan,
        slug,
        gambar_utama_url,
        dipublikasi_pada
      `
      )
      .eq("status", "published")
      .eq("penulis_id", article.penulis_id)
      .neq("id", article.id)
      .limit(5);

    return {
      success: true,
      data: {
        article,
        relatedArticles: relatedArticles || [],
        authorArticles: authorArticles || [],
      },
    };
  } catch (error) {
    console.error("Error getting public blog detail:", error);
    return { success: false, error: "Failed to get blog detail" };
  }
}
