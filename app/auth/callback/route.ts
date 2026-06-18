// app/auth/callback/route.ts

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
// Fungsi untuk menentukan path redirect berdasarkan peran
function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/dashboard-admin';
    case 'peserta':
      return '/dashboard';
    default:
      return '/login?message=Peran tidak dikenal'; // Fallback jika peran tidak ada
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createSupabaseServerClient();
    
    // 1. Tukarkan kode verifikasi dengan sesi login
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Callback Error:", sessionError);
      return NextResponse.redirect(`${origin}/login?message=Gagal verifikasi email.`);
    }

    // 2. Jika berhasil, ambil peran pengguna
    const userId = sessionData.user.id;
    const { data: profile, error: profileError } = await supabase
      .from('profil_pengguna')
      .select('peran')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      console.error("Callback Profile Error:", profileError);
      return NextResponse.redirect(`${origin}/login?message=Gagal mengambil data profil setelah verifikasi.`);
    }

    // 3. Arahkan (redirect) pengguna ke dasbor yang sesuai
    const redirectPath = getRedirectPath(profile.peran);
    return NextResponse.redirect(`${origin}${redirectPath}`);
  }

  // Jika tidak ada kode, arahkan ke halaman error
  return NextResponse.redirect(`${origin}/login?message=Link verifikasi tidak valid.`);
}
