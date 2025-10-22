"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateProfileData = {
  nama_lengkap: string;
  nomor_hp: string;
  bio: string;
};

export type UpdateProfileResult = {
  success: boolean;
  message: string;
  data?: any;
};

export async function updateProfile(userId: string, profileData: UpdateProfileData): Promise<UpdateProfileResult> {
  try {
    const supabase = await createSupabaseServerClient();

    // Validasi input
    if (!profileData.nama_lengkap.trim()) {
      return {
        success: false,
        message: "Nama lengkap tidak boleh kosong",
      };
    }

    // Update profil di database
    const { data, error } = await supabase
      .from("profil_pengguna")
      .update({
        nama_lengkap: profileData.nama_lengkap.trim(),
        nomor_hp: profileData.nomor_hp.trim() || null,
        bio: profileData.bio.trim() || null,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        message: "Gagal memperbarui profil. Silakan coba lagi.",
      };
    }

    // Revalidate pages yang menggunakan data profil
    revalidatePath("/profil-peserta");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profil berhasil diperbarui!",
      data: data,
    };
  } catch (error) {
    console.error("Unexpected error updating profile:", error);
    return {
      success: false,
      message: "Terjadi kesalahan tidak terduga. Silakan coba lagi.",
    };
  }
}
