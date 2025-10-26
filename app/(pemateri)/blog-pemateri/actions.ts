"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "@/../types/database";
import { revalidatePath } from "next/cache";

export type ArtikelBlog = Tables<"artikel_blog">;

export interface ArtikelBlogWithAuthor extends ArtikelBlog {
  penulis: {
    nama_lengkap: string;
    foto_profil_url: string | null;
  };
}

export interface BlogStats {
  totalArtikel: number;
  artikelPublished: number;
  artikelDraft: number;
  artikelReview: number;
  viewsBulanIni: number;
}

// Fungsi untuk mengambil artikel blog milik pemateri
export async function getArtikelPemateri(userId: string): Promise<{
  success: boolean;
  data?: ArtikelBlog[];
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // Pertama, dapatkan profil pengguna
    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, nama_lengkap, peran").eq("user_id", userId).single();

    if (profileError || !profile) {
      return {
        success: false,
        error: "Profile not found",
      };
    }

    if (profile.peran !== "instruktur") {
      return {
        success: false,
        error: "Unauthorized: Instructor access required",
      };
    }

    // Ambil semua artikel dari pemateri
    const { data: artikelData, error: artikelError } = await supabase.from("artikel_blog").select("*").eq("penulis_id", profile.id).order("diperbarui_pada", { ascending: false });

    if (artikelError) {
      console.error("Error fetching artikel:", artikelError);
      return {
        success: false,
        error: "Failed to fetch articles",
      };
    }

    return {
      success: true,
      data: artikelData || [],
    };
  } catch (error) {
    console.error("Error in getArtikelPemateri:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
    };
  }
}

// Fungsi untuk menghitung statistik blog
export async function getBlogStats(userId: string): Promise<{
  success: boolean;
  data?: BlogStats;
  error?: string;
}> {
  try {
    const artikelResult = await getArtikelPemateri(userId);

    if (!artikelResult.success || !artikelResult.data) {
      return {
        success: false,
        error: artikelResult.error || "Failed to fetch articles for stats",
      };
    }

    const articles = artikelResult.data;

    const totalArtikel = articles.length;
    const artikelPublished = articles.filter((a) => a.status === "published").length;
    const artikelDraft = articles.filter((a) => a.status === "draft").length;
    const artikelReview = articles.filter((a) => a.status === "review").length;

    // Mock calculation for views this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const publishedThisMonth = articles.filter((a) => {
      if (!a.dipublikasi_pada) return false;
      const publishDate = new Date(a.dipublikasi_pada);
      return publishDate.getMonth() === currentMonth && publishDate.getFullYear() === currentYear;
    }).length;

    const viewsBulanIni = publishedThisMonth * Math.floor(Math.random() * 100) + Math.floor(Math.random() * 500);

    return {
      success: true,
      data: {
        totalArtikel,
        artikelPublished,
        artikelDraft,
        artikelReview,
        viewsBulanIni,
      },
    };
  } catch (error) {
    console.error("Error in getBlogStats:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
    };
  }
}

// Fungsi untuk search dan filter artikel
export async function searchAndFilterArtikel(
  userId: string,
  searchQuery?: string,
  status?: "draft" | "review" | "published" | "ditolak" | "all"
): Promise<{
  success: boolean;
  data?: ArtikelBlog[];
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // Pertama, dapatkan profil pengguna
    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, nama_lengkap, peran").eq("user_id", userId).single();

    if (profileError || !profile) {
      return {
        success: false,
        error: "Profile not found",
      };
    }

    if (profile.peran !== "instruktur") {
      return {
        success: false,
        error: "Unauthorized: Instructor access required",
      };
    }

    // Build query dengan filter
    let query = supabase.from("artikel_blog").select("*").eq("penulis_id", profile.id);

    // Apply status filter
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Apply search query
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`judul.ilike.%${searchQuery}%,ringkasan.ilike.%${searchQuery}%,konten.ilike.%${searchQuery}%`);
    }

    const { data: artikelData, error: artikelError } = await query.order("diperbarui_pada", { ascending: false });

    if (artikelError) {
      console.error("Error searching artikel:", artikelError);
      return {
        success: false,
        error: "Failed to search articles",
      };
    }

    return {
      success: true,
      data: artikelData || [],
    };
  } catch (error) {
    console.error("Error in searchAndFilterArtikel:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
    };
  }
}

// Fungsi untuk membuat artikel baru
export async function createArtikel(
  userId: string,
  data: {
    judul: string;
    ringkasan?: string;
    konten?: string;
    slug: string;
    status?: "draft" | "review" | "published";
    tags?: string[];
    gambar_utama_url?: string;
  }
): Promise<{
  success: boolean;
  data?: ArtikelBlog;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return {
        success: false,
        error: "Unauthorized: User not authenticated",
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, peran").eq("user_id", user.id).single();

    if (profileError || !profile || profile.peran !== "instruktur") {
      return {
        success: false,
        error: "Unauthorized: Instructor access required",
      };
    }

    // Validate required fields
    if (!data.judul?.trim() || !data.slug?.trim()) {
      return {
        success: false,
        error: "Judul dan slug harus diisi",
      };
    }

    // Check if slug is unique
    const { data: existingArticle } = await supabase.from("artikel_blog").select("id").eq("slug", data.slug).single();

    if (existingArticle) {
      return {
        success: false,
        error: "Slug sudah digunakan, silakan gunakan slug yang lain",
      };
    }

    // Prepare data for insertion
    const artikelData = {
      judul: data.judul.trim(),
      ringkasan: data.ringkasan?.trim() || null,
      konten: data.konten?.trim() || null,
      slug: data.slug.trim().toLowerCase(),
      status: data.status || "draft",
      tags: data.tags || null,
      gambar_utama_url: data.gambar_utama_url?.trim() || null,
      penulis_id: profile.id,
      dibuat_pada: new Date().toISOString(),
      diperbarui_pada: new Date().toISOString(),
      dipublikasi_pada: data.status === "published" ? new Date().toISOString() : null,
    };

    // Insert artikel data
    const { data: insertedArtikel, error: insertError } = await supabase.from("artikel_blog").insert([artikelData]).select().single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return {
        success: false,
        error: "Gagal menyimpan artikel ke database",
      };
    }

    // Revalidate pages
    revalidatePath("/blog-pemateri");
    revalidatePath("/blog");

    return {
      success: true,
      data: insertedArtikel,
    };
  } catch (error) {
    console.error("Unexpected error in createArtikel:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}

// Fungsi untuk update artikel
export async function updateArtikel(
  userId: string,
  id: string,
  data: Partial<{
    judul: string;
    ringkasan: string;
    konten: string;
    slug: string;
    status: "draft" | "review" | "published";
    tags: string[];
    gambar_utama_url: string;
  }>
): Promise<{
  success: boolean;
  data?: ArtikelBlog;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return {
        success: false,
        error: "Unauthorized: User not authenticated",
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, peran").eq("user_id", user.id).single();

    if (profileError || !profile || profile.peran !== "instruktur") {
      return {
        success: false,
        error: "Unauthorized: Instructor access required",
      };
    }

    // Verify article ownership
    const { data: artikel, error: artikelError } = await supabase.from("artikel_blog").select("penulis_id, dipublikasi_pada").eq("id", id).single();

    if (artikelError || !artikel || artikel.penulis_id !== profile.id) {
      return {
        success: false,
        error: "Artikel tidak ditemukan atau bukan milik Anda",
      };
    }

    // Check slug uniqueness if slug is being updated
    if (data.slug) {
      const { data: existingArticle } = await supabase.from("artikel_blog").select("id").eq("slug", data.slug).neq("id", id).single();

      if (existingArticle) {
        return {
          success: false,
          error: "Slug sudah digunakan, silakan gunakan slug yang lain",
        };
      }
    }

    // Prepare update data
    const updateData = {
      ...data,
      diperbarui_pada: new Date().toISOString(),
      ...(data.status === "published" && !artikel.dipublikasi_pada ? { dipublikasi_pada: new Date().toISOString() } : {}),
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    // Update artikel data
    const { data: updatedArtikel, error: updateError } = await supabase.from("artikel_blog").update(updateData).eq("id", id).select().single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return {
        success: false,
        error: "Gagal memperbarui artikel",
      };
    }

    // Revalidate pages
    revalidatePath("/blog-pemateri");
    revalidatePath("/blog");

    return {
      success: true,
      data: updatedArtikel,
    };
  } catch (error) {
    console.error("Unexpected error in updateArtikel:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}

// Fungsi untuk delete artikel
export async function deleteArtikel(
  userId: string,
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return {
        success: false,
        error: "Unauthorized: User not authenticated",
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, peran").eq("user_id", user.id).single();

    if (profileError || !profile || profile.peran !== "instruktur") {
      return {
        success: false,
        error: "Unauthorized: Instructor access required",
      };
    }

    // Verify article ownership
    const { data: artikel, error: artikelError } = await supabase.from("artikel_blog").select("penulis_id").eq("id", id).single();

    if (artikelError || !artikel || artikel.penulis_id !== profile.id) {
      return {
        success: false,
        error: "Artikel tidak ditemukan atau bukan milik Anda",
      };
    }

    // Delete artikel
    const { error: deleteError } = await supabase.from("artikel_blog").delete().eq("id", id);

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return {
        success: false,
        error: "Gagal menghapus artikel",
      };
    }

    // Revalidate pages
    revalidatePath("/blog-pemateri");
    revalidatePath("/blog");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error in deleteArtikel:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}
