"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { Database } from "@/../types/database";

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
      emailRedirectTo: `${origin}/auth/confirm`,
      data: {
        // Data ini akan diteruskan ke trigger 'handle_new_user' Anda
        nama_lengkap: data.fullName, 
        nomor_hp: data.phone,
      },
    },
  });

  if (error) {
    // Kirim pesan error kembali ke Frontend
    if (error.message.toLowerCase().includes("email rate limit exceeded")) {
      return {
        user: null,
        error: "Batas pengiriman email verifikasi Supabase tercapai. Tunggu beberapa saat lalu coba lagi, atau gunakan custom SMTP untuk produksi.",
      };
    }

    return { user: null, error: error.message };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (signInError) {
    return { user: null, error: "Pendaftaran berhasil, namun gagal login otomatis. Silakan login manual." };
  }

  // Kirim data user kembali ke Frontend
  return { user: authData.user, error: null };
}
