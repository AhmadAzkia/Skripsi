
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getSupabaseWithSession() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server action — ignore
          }
        },
      },
    }
  );
}

export async function exchangeCode(code: string) {
  const supabase = await getSupabaseWithSession();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("exchangeCodeForSession error:", error);
    return { error: error.message };
  }
  return { error: null };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = await getSupabaseWithSession();

  if (!password) {
    return { error: "Password tidak boleh kosong." };
  }

  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  console.log("updatePassword - user:", user?.email || "null", "error:", getUserError?.message || "none");

  if (getUserError || !user) {
    return { error: "Sesi tidak ditemukan. Silakan minta link reset password baru." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error("Update Password Error:", error);
    return { error: `Gagal memperbarui password: ${error.message}` };
  }

  await supabase.auth.signOut();
  redirect("/login?message=Password Anda telah berhasil diubah. Silakan login kembali.");
}
