import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface BlogDetailData {
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
    status: string;
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

export async function getBlogDetailPemateri(userId: string, slug: string): Promise<{ success: boolean; data?: BlogDetailData; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get user profile first
    const { data: profile } = await supabase.from("profil_pengguna").select("id").eq("user_id", userId).single();

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    // Get article with author details
    const { data: article, error: articleError } = await supabase
      .from("artikel_blog")
      .select(
        `
        *,
        penulis:profil_pengguna!artikel_blog_penulis_id_fkey(
          id,
          nama_lengkap,
          foto_profil_url,
          bio
        )
      `
      )
      .eq("slug", slug)
      .eq("penulis_id", profile.id) // Only allow viewing own articles
      .single();

    if (articleError || !article) {
      return { success: false, error: "Article not found" };
    }

    // Get related articles (same author, different article)
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
        penulis:profil_pengguna!artikel_blog_penulis_id_fkey(
          nama_lengkap,
          foto_profil_url
        )
      `
      )
      .eq("penulis_id", profile.id)
      .neq("id", article.id)
      .order("dipublikasi_pada", { ascending: false })
      .limit(6);

    // Get other articles by the same author
    const { data: authorArticles = [] } = await supabase
      .from("artikel_blog")
      .select("id, judul, ringkasan, slug, gambar_utama_url, dipublikasi_pada")
      .eq("penulis_id", profile.id)
      .neq("id", article.id)
      .order("dipublikasi_pada", { ascending: false })
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
    console.error("Error getting blog detail:", error);
    return { success: false, error: "Failed to get blog detail" };
  }
}
