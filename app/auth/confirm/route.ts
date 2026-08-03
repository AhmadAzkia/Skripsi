import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

const PASSWORD_RECOVERY_COOKIE = "password-recovery";

function getSafeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

function markPasswordRecovery(response: NextResponse) {
  response.cookies.set(PASSWORD_RECOVERY_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next")) || "/";

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${requestUrl.origin}/login?message=Link verifikasi tidak valid.`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    console.error("Confirm OTP error:", error);
    return NextResponse.redirect(`${requestUrl.origin}/login?message=Link verifikasi tidak valid atau sudah kedaluwarsa.`);
  }

  const redirectPath = type === "recovery" ? "/reset-password" : next;
  const response = NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);

  if (type === "recovery") {
    markPasswordRecovery(response);
  }

  return response;
}
