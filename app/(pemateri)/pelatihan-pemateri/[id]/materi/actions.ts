"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateMateriData {
  judul: string;
  deskripsi?: string;
  kursus_id: string;
  tipe_materi: "pdf" | "ppt";
  file_url?: string;
  zoom_link?: string;
  urutan?: number;
}

export async function createMateri(data: CreateMateriData) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
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

    // Verify kursus ownership
    const { data: kursus, error: kursusError } = await supabase.from("kursus").select("id").eq("id", data.kursus_id).eq("instruktur_id", profile.id).single();

    if (kursusError || !kursus) {
      return {
        success: false,
        error: "Kursus tidak ditemukan atau bukan milik Anda",
      };
    }

    // Validate required fields
    if (!data.judul?.trim()) {
      return {
        success: false,
        error: "Judul materi harus diisi",
      };
    }

    // Prepare data for insertion
    const materiData = {
      judul: data.judul.trim(),
      deskripsi: data.deskripsi?.trim() || null,
      kursus_id: data.kursus_id,
      tipe_materi: data.tipe_materi,
      file_url: data.file_url?.trim() || null,
      zoom_link: data.zoom_link?.trim() || null,
      urutan: data.urutan || null,
    };

    // Insert materi data
    const { data: insertedMateri, error: insertError } = await supabase.from("materi_kursus").insert([materiData]).select().single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return {
        success: false,
        error: "Gagal menyimpan data materi ke database",
      };
    }

    // Revalidate pages
    revalidatePath(`/pelatihan-pemateri/${data.kursus_id}/materi`);
    revalidatePath("/materi-pemateri");

    return {
      success: true,
      data: insertedMateri,
      message: "Materi berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Unexpected error in createMateri:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}

export async function updateMateri(id: string, data: Partial<CreateMateriData>) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
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

    // Verify materi ownership through kursus
    const { data: materi, error: materiError } = await supabase.from("materi_kursus").select("kursus_id, kursus(instruktur_id)").eq("id", id).single();

    if (materiError || !materi || materi.kursus.instruktur_id !== profile.id) {
      return {
        success: false,
        error: "Materi tidak ditemukan atau bukan milik Anda",
      };
    }

    // Prepare update data
    const updateData = {
      ...data,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    // Update materi data
    const { data: updatedMateri, error: updateError } = await supabase.from("materi_kursus").update(updateData).eq("id", id).select().single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return {
        success: false,
        error: "Gagal memperbarui data materi",
      };
    }

    // Revalidate pages
    revalidatePath(`/pelatihan-pemateri/${materi.kursus_id}/materi`);
    revalidatePath("/materi-pemateri");

    return {
      success: true,
      data: updatedMateri,
      message: "Materi berhasil diperbarui",
    };
  } catch (error) {
    console.error("Unexpected error in updateMateri:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}

export async function deleteMateri(id: string) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
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

    // Verify materi ownership through kursus
    const { data: materi, error: materiError } = await supabase.from("materi_kursus").select("kursus_id, kursus(instruktur_id)").eq("id", id).single();

    if (materiError || !materi || materi.kursus.instruktur_id !== profile.id) {
      return {
        success: false,
        error: "Materi tidak ditemukan atau bukan milik Anda",
      };
    }

    // Delete materi
    const { error: deleteError } = await supabase.from("materi_kursus").delete().eq("id", id);

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return {
        success: false,
        error: "Gagal menghapus materi",
      };
    }

    // Revalidate pages
    revalidatePath(`/pelatihan-pemateri/${materi.kursus_id}/materi`);
    revalidatePath("/materi-pemateri");

    return {
      success: true,
      message: "Materi berhasil dihapus",
    };
  } catch (error) {
    console.error("Unexpected error in deleteMateri:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}
