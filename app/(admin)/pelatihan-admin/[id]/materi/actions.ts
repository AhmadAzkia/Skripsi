"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserWithRole } from "@/lib/user";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const userData = await getUserWithRole();
  return Boolean(userData?.user && userData.role === "admin");
}

// ── Upload file materi (PDF/PPT) ke Supabase Storage ──
export async function uploadMateriFile(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: "Format file harus PDF atau PPT" };
    }

    // Max 20MB
    if (file.size > 20 * 1024 * 1024) {
      return { url: null, error: "Ukuran file maksimal 20MB" };
    }

    const admin = createSupabaseAdminClient();
    if (!admin) {
      return { url: null, error: "Admin client tidak tersedia" };
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const fileName = `materi-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await admin.storage
      .from("materi-files")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Materi file upload error:", uploadError);
      return { url: null, error: "Gagal mengupload file: " + uploadError.message };
    }

    const { data: urlData } = admin.storage
      .from("materi-files")
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("Unexpected error in uploadMateriFile:", error);
    return { url: null, error: "Terjadi kesalahan saat mengupload file" };
  }
}

// ── Fetch materi list ──
export async function getMateriList(pelatihanId: string) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("materi_pelatihan")
      .select("*")
      .eq("pelatihan_id", pelatihanId)
      .order("urutan", { ascending: true });

    if (error) {
      console.error("Error fetching materi:", error);
      return { success: false, error: "Gagal mengambil data materi", data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Unexpected error in getMateriList:", error);
    return { success: false, error: "Terjadi kesalahan", data: [] };
  }
}

// ── Create materi ──
export async function createMateri(
  pelatihanId: string,
  data: {
    judul: string;
    deskripsi?: string;
    tipe_materi: "pdf" | "ppt" | "zoom";
    file_url?: string;
    zoom_link?: string;
    urutan: number;
  }
) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    const admin = createSupabaseAdminClient();
    if (!admin) return { success: false, error: "Admin client tidak tersedia" };

    if (!data.judul?.trim()) {
      return { success: false, error: "Judul materi harus diisi" };
    }

    const insertData = {
      pelatihan_id: pelatihanId,
      judul: data.judul.trim(),
      deskripsi: data.deskripsi?.trim() || null,
      tipe_materi: data.tipe_materi,
      file_url: data.file_url || null,
      zoom_link: data.zoom_link || null,
      urutan: data.urutan,
      dibuat_pada: new Date().toISOString(),
    };

    const { error } = await admin.from("materi_pelatihan").insert([insertData]);

    if (error) {
      console.error("Database insert error:", error);
      return { success: false, error: "Gagal menyimpan materi: " + error.message };
    }

    revalidatePath("/pelatihan-admin");
    return { success: true, message: "Materi berhasil ditambahkan" };
  } catch (error) {
    console.error("Unexpected error in createMateri:", error);
    return { success: false, error: "Terjadi kesalahan yang tidak terduga" };
  }
}

// ── Update materi ──
export async function updateMateri(
  materiId: string,
  data: {
    judul?: string;
    deskripsi?: string;
    tipe_materi?: "pdf" | "ppt" | "zoom";
    file_url?: string;
    zoom_link?: string;
    urutan?: number;
  }
) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    const admin = createSupabaseAdminClient();
    if (!admin) return { success: false, error: "Admin client tidak tersedia" };

    const updateData: Record<string, any> = {
      diperbarui_pada: new Date().toISOString(),
    };

    if (data.judul !== undefined) updateData.judul = data.judul.trim();
    if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi?.trim() || null;
    if (data.tipe_materi !== undefined) updateData.tipe_materi = data.tipe_materi;
    if (data.file_url !== undefined) updateData.file_url = data.file_url || null;
    if (data.zoom_link !== undefined) updateData.zoom_link = data.zoom_link || null;
    if (data.urutan !== undefined) updateData.urutan = data.urutan;

    const { error } = await admin
      .from("materi_pelatihan")
      .update(updateData)
      .eq("id", materiId);

    if (error) {
      console.error("Database update error:", error);
      return { success: false, error: "Gagal memperbarui materi" };
    }

    revalidatePath("/pelatihan-admin");
    return { success: true, message: "Materi berhasil diperbarui" };
  } catch (error) {
    console.error("Unexpected error in updateMateri:", error);
    return { success: false, error: "Terjadi kesalahan yang tidak terduga" };
  }
}

// ── Delete materi ──
export async function deleteMateri(materiId: string) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    const admin = createSupabaseAdminClient();
    if (!admin) return { success: false, error: "Admin client tidak tersedia" };

    // Fetch file_url before delete so we can clean up storage
    const { data: materi } = await admin
      .from("materi_pelatihan")
      .select("file_url, judul")
      .eq("id", materiId)
      .single();

    const { error } = await admin
      .from("materi_pelatihan")
      .delete()
      .eq("id", materiId);

    if (error) {
      console.error("Database delete error:", error);
      return { success: false, error: "Gagal menghapus materi" };
    }

    // Try to delete file from storage (best effort)
    if (materi?.file_url) {
      try {
        const admin = createSupabaseAdminClient();
        if (admin) {
          const urlParts = materi.file_url.split("/");
          const fileName = urlParts[urlParts.length - 1];
          await admin.storage.from("materi-files").remove([fileName]);
        }
      } catch (e) {
        console.warn("Failed to delete file from storage:", e);
      }
    }

    revalidatePath("/pelatihan-admin");
    return { success: true, message: `Materi "${materi?.judul || "ini"}" berhasil dihapus` };
  } catch (error) {
    console.error("Unexpected error in deleteMateri:", error);
    return { success: false, error: "Terjadi kesalahan yang tidak terduga" };
  }
}
