
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrlFromHeaders } from "@/lib/site-url";
import { headers } from "next/headers";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const supabase = await createSupabaseServerClient();
  const Headers = await headers();
  const siteUrl = getSiteUrlFromHeaders(Headers);

  if (!email) {
    return { error: "Email tidak boleh kosong." };
  }

  if (!siteUrl) {
    return { error: "Konfigurasi URL aplikasi belum tersedia." };
  }

  const redirectTo = `${siteUrl}/auth/callback?next=/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });

  if (error) {
    console.error("Password Reset Error:", error);
    return { error: `Gagal mengirim email reset: ${error.message}` };
  }

  return { error: null };
}
