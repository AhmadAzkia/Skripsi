"use server"; // Menandakan ini adalah file Backend

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createSupabaseServerClient();

  // Panggil signOut dari Supabase
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout Error:", error);
    // Mungkin return error atau redirect ke halaman error
    // Untuk logout, redirect ke home biasanya cukup aman
  }

  // Redirect ke halaman utama setelah logout
  redirect("/");
}