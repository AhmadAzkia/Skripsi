"use server";

import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { headers } from "next/headers";
import { Database } from "@/types/database";

// Kita buat interface untuk data yang dikirim dari form
interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export async function signup(data: SignupData) {
  const supabase = await createSupabaseServerClient();
  const Headers = await headers();
  const origin = Headers.get("origin"); // Mendapatkan URL website

  // Panggil Supabase Auth dari sisi Server
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        // Data ini akan diteruskan ke trigger 'handle_new_user' Anda
        nama_lengkap: data.fullName, 
        nomor_hp: data.phone,
      },
    },
  });

  if (error) {
    // Kirim pesan error kembali ke Frontend
    return { user: null, error: error.message };
  }

  // Kirim data user kembali ke Frontend
  return { user: authData.user, error: null };
}