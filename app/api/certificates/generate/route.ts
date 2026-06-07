import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateAndUploadCertificate } from "@/lib/certificate-generator";

export const runtime = "nodejs";

type GenerateCertificateRequest = {
  certificateId: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateCertificateRequest;

    if (!body.certificateId) {
      return NextResponse.json({ error: "certificateId wajib dikirim." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("id, peran").eq("user_id", user.id).single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profil pengguna tidak ditemukan." }, { status: 404 });
    }

    const query = supabase.from("sertifikat").select("id, peserta_id").eq("id", body.certificateId);
    const { data: certificate, error: certificateError } = profile.peran === "admin" ? await query.single() : await query.eq("peserta_id", profile.id).single();

    if (certificateError || !certificate) {
      return NextResponse.json({ error: "Sertifikat tidak ditemukan atau tidak dapat diakses." }, { status: 404 });
    }

    const certificateUrl = await generateAndUploadCertificate(certificate.id);

    return NextResponse.json({
      success: true,
      certificateUrl,
    });
  } catch (error: any) {
    console.error("Generate certificate error:", error);
    return NextResponse.json({ error: error.message || "Gagal membuat file sertifikat." }, { status: 500 });
  }
}
