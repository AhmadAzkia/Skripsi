
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const supabase = await createSupabaseServerClient();
  const Headers = await headers();
  const origin = Headers.get("origin");

  if (!email) {
    return { error: "Email tidak boleh kosong." };
  }

  if (!origin) {
    return { error: "Konfigurasi URL aplikasi belum tersedia." };
  }

  const redirectTo = `${origin}/auth/callback?next=/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });

  if (error) {
    console.error("Password Reset Error:", error);
    return { error: `Gagal mengirim email reset: ${error.message}` };
  }

  return { error: null };
}
