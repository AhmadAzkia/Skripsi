// app/(auth)/login/actions.ts

"use server"; // Menandakan ini adalah file Backend (Server Actions)

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function getRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/dashboard-admin";
    case "peserta":
      return "/dashboard";
    default:
      return "/";
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createSupabaseServerClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    if (signInError.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Email belum diverifikasi. Silakan cek email Anda lalu klik link verifikasi sebelum login." };
    }

    return { error: "Email atau password yang Anda masukkan salah." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Gagal mendapatkan data pengguna setelah login." };
  }

  const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("peran").eq("user_id", user.id).single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: "Profil pengguna tidak ditemukan." };
  }

  const redirectPath = getRedirectPath(profile.peran);

  revalidatePath("/", "layout");
  // Return redirect path instead of calling redirect() supaya client bisa
  // refresh auth state dulu sebelum navigate (mencegah navbar nampilin data lama)
  return { redirectPath };
}
