import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateAndUploadCertificate } from "@/lib/certificate-generator";

export const runtime = "nodejs";

type DownloadCertificateRouteProps = {
  params: Promise<{ id: string }>;
};

function getStoragePathFromUrl(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(markerIndex + marker.length));
}

export async function GET(_request: Request, { params }: DownloadCertificateRouteProps) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const admin = createSupabaseAdminClient();

    if (!admin) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum diisi." }, { status: 500 });
    }

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

    const query = supabase.from("sertifikat").select("id, peserta_id, kursus_id, sertifikat_url").eq("id", id);
    const { data: certificate, error: certificateError } = profile.peran === "admin" ? await query.single() : await query.eq("peserta_id", profile.id).single();

    if (certificateError || !certificate) {
      return NextResponse.json({ error: "Sertifikat tidak ditemukan atau tidak dapat diakses." }, { status: 404 });
    }

    const certificateUrl = certificate.sertifikat_url || (await generateAndUploadCertificate(certificate.id));
    const bucket = process.env.SUPABASE_CERTIFICATE_BUCKET || "certificates";
    const storagePath = getStoragePathFromUrl(certificateUrl, bucket) || `${certificate.peserta_id}/${certificate.kursus_id}/${certificate.id}.pdf`;
    const { data: signedUrlData, error: signedUrlError } = await admin.storage.from(bucket).createSignedUrl(storagePath, 60);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      return NextResponse.json({ error: `Gagal membuat signed URL: ${signedUrlError?.message || "URL kosong"}` }, { status: 500 });
    }

    return NextResponse.redirect(signedUrlData.signedUrl);
  } catch (error: any) {
    console.error("Download certificate error:", error);
    return NextResponse.json({ error: error.message || "Gagal membuka sertifikat." }, { status: 500 });
  }
}
