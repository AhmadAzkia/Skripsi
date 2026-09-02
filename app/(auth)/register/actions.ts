"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrlFromHeaders } from "@/lib/site-url";
import { headers } from "next/headers";
import { Database } from "@/../types/database";

// Kita buat interface untuk data yang dikirim dari form
interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  agreeToTerms: boolean;
}

export async function signup(data: SignupData) {
  const email = data.email.trim().toLowerCase();
  const fullName = data.fullName.trim();
  const phone = data.phone.trim();

  if (!fullName) return { user: null, error: "Nama lengkap wajib diisi." };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return { user: null, error: "Format email tidak valid." };
  if (!phone) return { user: null, error: "Nomor telepon wajib diisi." };
  if (data.password.length < 8) return { user: null, error: "Password minimal 8 karakter." };
  if (!data.agreeToTerms) return { user: null, error: "Anda harus menyetujui syarat dan ketentuan." };

  const supabase = await createSupabaseServerClient();
  const Headers = await headers();
  const siteUrl = getSiteUrlFromHeaders(Headers);

  // Panggil Supabase Auth dari sisi Server
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password: data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm`,
      data: {
        // Data ini akan diteruskan ke trigger 'handle_new_user' Anda
        nama_lengkap: fullName,
        nomor_hp: phone,
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

  // Jangan login otomatis. Akun baru harus dikonfirmasi melalui email dahulu.
  return { user: authData.user, error: null };
}
