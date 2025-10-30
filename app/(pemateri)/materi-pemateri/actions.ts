"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface MateriData {
  id: string;
  judul: string;
  deskripsi: string | null;
  tipe_materi: "pdf" | "ppt" | "video" | "zoom_recording";
  file_url: string | null;
  kursus_id: string;
  kursus: {
    id: string;
    judul: string;
    thumbnail_url: string | null;
  };
}

export interface KursusOption {
  id: string;
  judul: string;
}

// Fungsi untuk mengambil data materi milik pemateri
export async function getMateriPemateri(userId: string): Promise<{
  success: boolean;
  data?: MateriData[];
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

    // Ambil semua materi dari kursus yang dimiliki pemateri
    const { data: materiData, error: materiError } = await supabase
      .from("materi_kursus")
      .select(
        `
        id,
        judul,
        deskripsi,
        tipe_materi,
        file_url,
        kursus_id,
        kursus!inner (
          id,
          judul,
          thumbnail_url,
          instruktur_id
        )
      `
      )
      .eq("kursus.instruktur_id", profile.id)
      .order("judul", { ascending: true });

    if (materiError) {
      console.error("Error fetching materi:", materiError);
      return {
        success: false,
        error: "Failed to fetch materials",
      };
    }

    return {
      success: true,
      data: materiData || [],
    };
  } catch (error) {
    console.error("Error in getMateriPemateri:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
    };
  }
}

// Fungsi untuk mengambil daftar kursus milik pemateri (untuk filter)
export async function getKursusPemateriOptions(userId: string): Promise<{
  success: boolean;
  data?: KursusOption[];
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

    // Ambil daftar kursus yang dimiliki pemateri
    const { data: kursusData, error: kursusError } = await supabase.from("kursus").select("id, judul").eq("instruktur_id", profile.id).order("judul", { ascending: true });

    if (kursusError) {
      console.error("Error fetching kursus:", kursusError);
      return {
        success: false,
        error: "Failed to fetch courses",
      };
    }

    return {
      success: true,
      data: kursusData || [],
    };
  } catch (error) {
    console.error("Error in getKursusPemateriOptions:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
    };
  }
}

// Fungsi untuk search dan filter materi
export async function searchAndFilterMateri(
  userId: string,
  searchQuery?: string,
  kursusId?: string,
  tipeMateri?: string
): Promise<{
  success: boolean;
  data?: MateriData[];
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
    let query = supabase
      .from("materi_kursus")
      .select(
        `
        id,
        judul,
        deskripsi,
        tipe_materi,
        file_url,
        kursus_id,
        kursus!inner (
          id,
          judul,
          thumbnail_url,
          instruktur_id
        )
      `
      )
      .eq("kursus.instruktur_id", profile.id);

    // Apply filters
    if (kursusId && kursusId !== "all") {
      query = query.eq("kursus_id", kursusId);
    }

    if (tipeMateri && tipeMateri !== "all") {
      const validTypes = ["pdf", "ppt"];
      if (validTypes.includes(tipeMateri)) {
        query = query.eq("tipe_materi", tipeMateri as "pdf" | "ppt");
      }
    }

    // Apply search query
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`judul.ilike.%${searchQuery}%,deskripsi.ilike.%${searchQuery}%`);
    }

    const { data: materiData, error: materiError } = await query.order("judul", { ascending: true });

    if (materiError) {
      console.error("Error searching materi:", materiError);
      return {
        success: false,
        error: "Failed to search materials",
      };
    }

    return {
      success: true,
      data: materiData || [],
    };
  } catch (error) {
    console.error("Error in searchAndFilterMateri:", error);
    return {
      success: false,
      error: "Unexpected error occurred",
    };
  }
}
