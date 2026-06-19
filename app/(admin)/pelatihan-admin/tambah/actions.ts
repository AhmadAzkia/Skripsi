"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Upload thumbnail ke Supabase Storage (pakai admin client untuk bypass RLS)
export async function uploadThumbnail(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: "Format file harus JPEG, PNG, atau WebP" };
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: "Ukuran file maksimal 5MB" };
    }

    const admin = createSupabaseAdminClient();
    if (!admin) {
      return { url: null, error: "Admin client tidak tersedia" };
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const fileName = `thumbnail-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await admin.storage.from("pelatihan-thumbnails").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error("Thumbnail upload error:", uploadError);
      return { url: null, error: "Gagal mengupload gambar: " + uploadError.message };
    }

    const { data: urlData } = admin.storage.from("pelatihan-thumbnails").getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("Unexpected error in uploadThumbnail:", error);
    return { url: null, error: "Terjadi kesalahan saat mengupload gambar" };
  }
}

// Delete thumbnail dari Supabase Storage (pakai admin client untuk bypass RLS)
export async function deleteThumbnail(fileName: string): Promise<void> {
  try {
    const admin = createSupabaseAdminClient();
    if (!admin) return;
    await admin.storage.from("pelatihan-thumbnails").remove([fileName]);
  } catch (error) {
    console.warn("Failed to delete thumbnail:", error);
  }
}

interface CreatePelatihanData {
  judul: string;
  deskripsi: string;
  kategori: string;
  tipe_kursus: "online" | "offline" | "hybrid";
  harga: number;
  maksimal_peserta: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  thumbnail_url: string;
  status: "draft" | "published";
}

export async function createPelatihan(data: CreatePelatihanData) {
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

    // Validate required fields
    if (!data.judul?.trim()) {
      return {
        success: false,
        error: "Judul pelatihan harus diisi",
      };
    }

    if (!data.deskripsi?.trim()) {
      return {
        success: false,
        error: "Deskripsi harus diisi",
      };
    }

    if (!data.kategori?.trim()) {
      return {
        success: false,
        error: "Kategori harus diisi",
      };
    }

    if (data.harga < 0) {
      return {
        success: false,
        error: "Harga tidak boleh negatif",
      };
    }

    if (data.maksimal_peserta <= 0) {
      return {
        success: false,
        error: "Maksimal peserta harus lebih dari 0",
      };
    }

    if (!data.tanggal_mulai || !data.tanggal_selesai) {
      return {
        success: false,
        error: "Tanggal mulai dan selesai harus diisi",
      };
    }

    // Validate date logic
    const startDate = new Date(data.tanggal_mulai);
    const endDate = new Date(data.tanggal_selesai);

    if (endDate <= startDate) {
      return {
        success: false,
        error: "Tanggal selesai harus setelah tanggal mulai",
      };
    }

    // Prepare data for insertion
    const pelatihanData = {
      judul: data.judul.trim(),
      deskripsi: data.deskripsi.trim(),
      kategori: data.kategori.trim(),
      tipe_kursus: data.tipe_kursus,
      harga: data.harga,
      maksimal_peserta: data.maksimal_peserta,
      tanggal_mulai: data.tanggal_mulai,
      tanggal_selesai: data.tanggal_selesai,
      thumbnail_url: data.thumbnail_url?.trim() || null,
      status: data.status,
      dibuat_pada: new Date().toISOString(),
      diperbarui_pada: new Date().toISOString(),
    };

    // Insert pelatihan data
    const { data: insertedPelatihan, error: insertError } = await supabase.from("kursus").insert([pelatihanData]).select().single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return {
        success: false,
        error: `Gagal menyimpan data pelatihan ke database: ${insertError.message}`,
      };
    }

    // Revalidate the admin pelatihan page
    revalidatePath("/pelatihan-admin");
    revalidatePath("/pelatihan-admin/tambah");
    revalidatePath("/jadwal-pelatihan");
    revalidatePath("/katalog-pelatihan");

    return {
      success: true,
      data: insertedPelatihan,
      message: "Pelatihan berhasil dibuat",
    };
  } catch (error) {
    console.error("Unexpected error in createPelatihan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}

export async function updatePelatihan(id: string, data: Partial<CreatePelatihanData>) {
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

    // Prepare update data
    const updateData = {
      ...data,
      diperbarui_pada: new Date().toISOString(),
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    // Update pelatihan data
    const { data: updatedPelatihan, error: updateError } = await supabase.from("kursus").update(updateData).eq("id", id).select().single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return {
        success: false,
        error: "Gagal memperbarui data pelatihan",
      };
    }

    // Revalidate the admin pelatihan page
    revalidatePath("/pelatihan-admin");
    revalidatePath("/jadwal-pelatihan");
    revalidatePath("/katalog-pelatihan");

    return {
      success: true,
      data: updatedPelatihan,
      message: "Pelatihan berhasil diperbarui",
    };
  } catch (error) {
    console.error("Unexpected error in updatePelatihan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}

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

    // Delete pelatihan
    const { error: deleteError } = await supabase.from("kursus").delete().eq("id", id);

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return {
        success: false,
        error: "Gagal menghapus pelatihan",
      };
    }

    // Revalidate the admin pelatihan page
    revalidatePath("/pelatihan-admin");
    revalidatePath("/jadwal-pelatihan");
    revalidatePath("/katalog-pelatihan");

    return {
      success: true,
      message: "Pelatihan berhasil dihapus",
    };
  } catch (error) {
    console.error("Unexpected error in deletePelatihan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}
