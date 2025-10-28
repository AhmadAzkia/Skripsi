"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Change user password
export async function changeUserPassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Extract form data
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        error: "Semua field wajib diisi",
        message: "Gagal mengubah password",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "Konfirmasi password tidak sesuai",
        message: "Gagal mengubah password",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: "Password baru minimal 6 karakter",
        message: "Gagal mengubah password",
      };
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: "Password saat ini tidak benar",
        message: "Gagal mengubah password",
      };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error("Error updating password: " + updateError.message);
    }

    return {
      success: true,
      error: null,
      message: "Password berhasil diubah!",
    };
  } catch (error) {
    console.error("Error in changeUserPassword:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Gagal mengubah password",
    };
  }
}

// Get user profile by user ID
export async function getUserProfile(userId?: string) {
  const supabase = await createSupabaseServerClient();

  try {
    // If no userId provided, get current user
    if (!userId) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated");
      }
      userId = user.id;
    }

    const { data: profile, error } = await supabase.from("profil_pengguna").select("*").eq("user_id", userId).single();

    if (error) {
      throw new Error("Error fetching profile: " + error.message);
    }

    return { profile, error: null };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return {
      profile: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Extract form data
    const nama_lengkap = formData.get("nama_lengkap") as string;
    const nomor_hp = formData.get("nomor_hp") as string;
    const bio = formData.get("bio") as string;
    const avatarFile = formData.get("avatar") as File;

    let foto_profil_url = null;

    // Handle avatar upload if provided
    if (avatarFile && avatarFile.size > 0) {
      try {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(avatarFile.type)) {
          throw new Error("Format file harus JPEG, PNG, atau WebP");
        }

        // Validate file size (max 5MB)
        if (avatarFile.size > 5 * 1024 * 1024) {
          throw new Error("Ukuran file maksimal 5MB");
        }

        const fileExt = avatarFile.name.split(".").pop()?.toLowerCase();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        // Get current profile to delete old avatar if exists
        const { data: currentProfile } = await supabase.from("profil_pengguna").select("foto_profil_url").eq("user_id", user.id).single();

        // Upload new avatar to avatars bucket
        const { data: uploadData, error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile, {
          cacheControl: "3600",
          upsert: false,
        });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Gagal mengupload foto profil: " + uploadError.message);
        }

        // Get public URL for uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(fileName);

        foto_profil_url = publicUrl;

        // Delete old avatar file if exists (cleanup)
        if (currentProfile?.foto_profil_url) {
          try {
            const oldFileName = currentProfile.foto_profil_url.split("/").pop();
            if (oldFileName && oldFileName.includes(user.id)) {
              await supabase.storage.from("avatars").remove([oldFileName]);
            }
          } catch (deleteError) {
            console.warn("Failed to delete old avatar:", deleteError);
            // Continue without failing the update
          }
        }
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
        // Return error instead of continuing
        return {
          success: false,
          profile: null,
          error: uploadError instanceof Error ? uploadError.message : "Gagal mengupload foto profil",
          message: "Gagal mengupload foto profil",
        };
      }
    }

    // Update profile data
    const updateData: any = {
      nama_lengkap,
      nomor_hp: nomor_hp || null,
      bio: bio || null,
      diperbarui_pada: new Date().toISOString(),
    };

    if (foto_profil_url) {
      updateData.foto_profil_url = foto_profil_url;
    }

    const { data: profile, error } = await supabase.from("profil_pengguna").update(updateData).eq("user_id", user.id).select().single();

    if (error) {
      throw new Error("Error updating profile: " + error.message);
    }

    return {
      success: true,
      profile,
      error: null,
      message: "Profil berhasil diperbarui!",
    };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return {
      success: false,
      profile: null,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Gagal memperbarui profil",
    };
  }
}

// Create new user profile
export async function createUserProfile(userData: { user_id: string; nama_lengkap: string; email: string; peran: "admin" | "instruktur" | "peserta" }) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: profile, error } = await supabase
      .from("profil_pengguna")
      .insert({
        user_id: userData.user_id,
        nama_lengkap: userData.nama_lengkap,
        email: userData.email,
        peran: userData.peran,
        is_aktif: true,
        dibuat_pada: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error("Error creating profile: " + error.message);
    }

    return {
      success: true,
      profile,
      error: null,
      message: "Profil berhasil dibuat!",
    };
  } catch (error) {
    console.error("Error in createUserProfile:", error);
    return {
      success: false,
      profile: null,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Gagal membuat profil",
    };
  }
}

// Delete user avatar
export async function deleteUserAvatar() {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Get current profile to find avatar URL
    const { data: currentProfile, error: profileError } = await supabase.from("profil_pengguna").select("foto_profil_url").eq("user_id", user.id).single();

    if (profileError) {
      throw new Error("Error fetching profile: " + profileError.message);
    }

    // Delete avatar file from storage if exists
    if (currentProfile?.foto_profil_url) {
      try {
        const fileName = currentProfile.foto_profil_url.split("/").pop();
        if (fileName && fileName.includes(user.id)) {
          const { error: deleteError } = await supabase.storage.from("avatars").remove([fileName]);

          if (deleteError) {
            console.warn("Failed to delete avatar file:", deleteError);
          }
        }
      } catch (deleteError) {
        console.warn("Avatar file deletion failed:", deleteError);
      }
    }

    // Update profile to remove avatar URL
    const { data: profile, error: updateError } = await supabase
      .from("profil_pengguna")
      .update({
        foto_profil_url: null,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      throw new Error("Error updating profile: " + updateError.message);
    }

    return {
      success: true,
      profile,
      error: null,
      message: "Foto profil berhasil dihapus!",
    };
  } catch (error) {
    console.error("Error in deleteUserAvatar:", error);
    return {
      success: false,
      profile: null,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Gagal menghapus foto profil",
    };
  }
}

// Get profile with role mapping
export async function getProfileWithRole(userId?: string) {
  const result = await getUserProfile(userId);

  if (!result.profile) {
    return result;
  }

  // Map database role to frontend role
  const roleMapping: Record<string, "admin" | "pemateri" | "peserta"> = {
    admin: "admin",
    instruktur: "pemateri",
    peserta: "peserta",
  };

  return {
    ...result,
    role: roleMapping[result.profile.peran] || "peserta",
  };
}
