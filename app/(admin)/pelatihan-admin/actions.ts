"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePelatihan(id: string) {
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

    // Get user profile to check if they're admin
    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("peran").eq("user_id", user.id).single();

    if (profileError || !profile || profile.peran !== "admin") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Check if pelatihan exists
    const { data: existingPelatihan, error: checkError } = await supabase.from("pelatihan").select("id, judul").eq("id", id).single();

    if (checkError || !existingPelatihan) {
      return {
        success: false,
        error: "Pelatihan tidak ditemukan",
      };
    }

    // Delete pelatihan
    const { error: deleteError } = await supabase.from("pelatihan").delete().eq("id", id);

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return {
        success: false,
        error: "Gagal menghapus pelatihan",
      };
    }

    // Revalidate the admin pelatihan page
    revalidatePath("/admin/pelatihan-admin");

    return {
      success: true,
      message: `Pelatihan "${existingPelatihan.judul}" berhasil dihapus`,
    };
  } catch (error) {
    console.error("Unexpected error in deletePelatihan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}
