"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { generateAndUploadCertificate } from "@/lib/certificate-generator";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const userData = await getUserWithRole();
  return Boolean(userData?.user && userData.role === "admin");
}

export async function generateCertificateByAdmin(certificateId: string) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    const certificateUrl = await generateAndUploadCertificate(certificateId);
    revalidatePath("/manajemen-sertifikat");
    return { success: true, certificateUrl };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal membuat sertifikat." };
  }
}

export async function uploadCertificateTemplate(formData: FormData) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  const file = formData.get("template");

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "File template wajib diunggah." };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { success: false, error: "Template sertifikat harus berformat PDF." };
  }

  const admin = createSupabaseAdminClient();
  const supabase = await createSupabaseServerClient();
  const bucket = process.env.SUPABASE_CERTIFICATE_BUCKET || "certificates";
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = admin
    ? await admin.storage.from(bucket).upload("templates/certificate-template.pdf", bytes, { contentType: "application/pdf", upsert: true })
    : await supabase.storage.from(bucket).upload("templates/certificate-template.pdf", bytes, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    return { success: false, error: `Gagal upload template: ${uploadError.message}` };
  }

  revalidatePath("/manajemen-sertifikat");
  return { success: true, message: "Template sertifikat berhasil disimpan." };
}
