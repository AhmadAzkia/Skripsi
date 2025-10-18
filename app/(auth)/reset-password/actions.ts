
"use server";

import { createSupabaseServerClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = await createSupabaseServerClient();

  if (!password) {
    return { error: "Password tidak boleh kosong." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error("Update Password Error:", error);
    return { error: "Gagal memperbarui password. Link mungkin sudah kedaluwarsa." };
  }

  await supabase.auth.signOut();
  redirect("/login?message=Password Anda telah berhasil diubah. Silakan login kembali.");
}