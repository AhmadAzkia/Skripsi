
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createSupabaseServerClient();
  const Headers = await headers();
  const origin = Headers.get("origin");

  if (!email) {
    return { error: "Email tidak boleh kosong." };
  }

  const redirectTo = `${origin}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });

  if (error) {
    console.error("Password Reset Error:", error);
    return { error: "Gagal mengirim email reset. Coba lagi nanti." };
  }

  return { error: null };
}