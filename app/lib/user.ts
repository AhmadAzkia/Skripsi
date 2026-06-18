// lib/user.ts

import { createSupabaseServerClient } from "./supabase/server";
import { Tables } from "@/../types/database"; // Impor tipe dari database.ts

// Definisikan tipe untuk peran agar lebih jelas
type UserRole = Tables<"profil_pengguna">["peran"];

/**
 * Helper function untuk sisi server (Server Components, Route Handlers, Server Actions).
 * Mengambil data sesi pengguna DAN peran kustom mereka dari tabel profil.
 */
export async function getUserWithRole() {
  const supabase = await createSupabaseServerClient();

  // 1. Ambil data user yang terotentikasi (bukan session dari cookie)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error getting user:", userError.message);
    return { user: null, role: null, profile: null };
  }

  if (!user) {
    return { user: null, role: null, profile: null };
  }

  // 2. Ambil profil lengkap dari tabel profil
  const { data: profile, error: profileError } = await supabase
    .from("profil_pengguna")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Error getting user profile:", profileError.message);
    return { user, role: null, profile: null };
  }

  // 3. Kembalikan data lengkap dengan profil
  return {
    user: { ...user, profile },
    role: profile.peran as UserRole,
    profile: profile,
  };
}
