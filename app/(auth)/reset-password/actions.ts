
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PASSWORD_RECOVERY_COOKIE = "password-recovery";

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

async function markPasswordRecoverySession() {
  const cookieStore = await cookies();
  cookieStore.set(PASSWORD_RECOVERY_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
}

async function clearPasswordRecoverySession() {
  const cookieStore = await cookies();
  cookieStore.delete(PASSWORD_RECOVERY_COOKIE);
}

export async function exchangeCode(code: string) {
  const supabase = await getSupabaseWithSession();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("exchangeCodeForSession error:", error);
    return { error: error.message };
  }

  await markPasswordRecoverySession();
  return { error: null };
}

export async function setRecoverySession(input: { accessToken?: string; refreshToken?: string }) {
  const accessToken = input.accessToken?.trim();
  const refreshToken = input.refreshToken?.trim();

  if (!accessToken || !refreshToken) {
    return { error: "Link reset password tidak lengkap." };
  }

  const supabase = await getSupabaseWithSession();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    console.error("setRecoverySession error:", error);
    return { error: error.message };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi reset password tidak valid." };
  }

  await markPasswordRecoverySession();
  return { error: null };
}

export async function verifyRecoverySession() {
  const cookieStore = await cookies();

  if (cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value !== "true") {
    return { error: "Link reset password tidak valid atau sudah kedaluwarsa." };
  }

  const supabase = await getSupabaseWithSession();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "Sesi reset password tidak ditemukan. Silakan minta link baru." };
  }

  return { error: null };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const supabase = await getSupabaseWithSession();

  if (!password) {
    return { error: "Password tidak boleh kosong." };
  }

  if (password !== confirmPassword) {
    return { error: "Password dan konfirmasi password tidak cocok." };
  }

  if (password.length < 8) {
    return { error: "Password minimal harus 8 karakter." };
  }

  const recoverySession = await verifyRecoverySession();
  if (recoverySession.error) {
    return { error: recoverySession.error };
  }

  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

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
  await clearPasswordRecoverySession();
  redirect("/login?message=Password Anda telah berhasil diubah. Silakan login kembali.");
}
