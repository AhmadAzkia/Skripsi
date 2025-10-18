// lib/user.ts

import { createSupabaseServerClient } from "./supabase/server";
import { Tables } from "@/../types/database"; // Impor tipe dari database.ts

// Definisikan tipe untuk peran agar lebih jelas
type UserRole = Tables<'profil_pengguna'>['peran'];

/**
 * Helper function untuk sisi server (Server Components, Route Handlers, Server Actions).
 * Mengambil data sesi pengguna DAN peran kustom mereka dari tabel profil.
 */
export async function getUserWithRole() {
  const supabase = await createSupabaseServerClient();

  // 1. Ambil sesi autentikasi pengguna
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error getting session:", sessionError.message);
    return { user: null, role: null };
  }

  if (!session) {
    // Tidak ada pengguna yang login
    return { user: null, role: null };
  }

  // 2. Jika ada sesi, ambil peran dari tabel profil
  const { data: profile, error: profileError } = await supabase
    .from('profil_pengguna')
    .select('peran')
    .eq('user_id', session.user.id) // Gunakan 'user_id' untuk mencocokkan
    .single();

  if (profileError) {
    console.error("Error getting user role:", profileError.message);
    // Kembalikan data user, tapi peran null karena gagal diambil
    return { user: session.user, role: null };
  }

  // 3. Kembalikan data lengkap
  return {
    user: session.user,
    role: profile.peran as UserRole, // Kembalikan peran dari tabel profil
  };
}