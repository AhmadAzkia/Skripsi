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

export async function generateCertificateByAdmin(certificateId: string, templateId?: string) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  try {
    if (templateId) {
      const admin = createSupabaseAdminClient();
      if (admin) {
        await admin
          .from("sertifikat")
          .update({ template_id: templateId, diperbarui_pada: new Date().toISOString() })
          .eq("id", certificateId);
      }
    }

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

type KoordinatField = {
  x: number;
  y: number;
  fontSize?: number;
  size?: number;
};

type TemplateKoordinat = {
  nama: KoordinatField;
  nomor_sertifikat: KoordinatField;
  tanggal: KoordinatField;
  judul_pelatihan: KoordinatField;
  qr_code: KoordinatField;
};

export async function uploadTemplate(formData: FormData) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  const nama = formData.get("nama") as string;
  const file = formData.get("template") as File;
  const koordinatStr = formData.get("koordinat") as string;

  if (!nama || nama.trim().length === 0) {
    return { success: false, error: "Nama template wajib diisi." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "File template wajib diunggah." };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { success: false, error: "Template harus berformat PDF." };
  }

  let koordinat: TemplateKoordinat;
  try {
    koordinat = JSON.parse(koordinatStr);
  } catch {
    return { success: false, error: "Data koordinat tidak valid." };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { success: false, error: "Gagal mengakses storage." };
  }

  const bucket = process.env.SUPABASE_CERTIFICATE_BUCKET || "certificates";
  const templateId = crypto.randomUUID();
  const filePath = `templates/${templateId}.pdf`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(filePath, bytes, { contentType: "application/pdf", upsert: false });

  if (uploadError) {
    return { success: false, error: `Gagal upload template: ${uploadError.message}` };
  }

  const { error: dbError } = await admin.from("template_sertifikat").insert({
    id: templateId,
    nama: nama.trim(),
    file_path: filePath,
    koordinat,
  });

  if (dbError) {
    await admin.storage.from(bucket).remove([filePath]);
    return { success: false, error: `Gagal menyimpan data template: ${dbError.message}` };
  }

  revalidatePath("/manajemen-sertifikat");
  return { success: true, message: "Template berhasil disimpan." };
}

export async function deleteTemplate(templateId: string) {
  if (!(await ensureAdmin())) {
    return { success: false, error: "Unauthorized: Admin access required" };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { success: false, error: "Gagal mengakses storage." };
  }

  const { data: template, error: fetchError } = await admin
    .from("template_sertifikat")
    .select("id, file_path")
    .eq("id", templateId)
    .single();

  if (fetchError || !template) {
    return { success: false, error: "Template tidak ditemukan." };
  }

  const { error: deleteError } = await admin
    .from("template_sertifikat")
    .delete()
    .eq("id", templateId);

  if (deleteError) {
    return { success: false, error: `Gagal menghapus template: ${deleteError.message}` };
  }

  const bucket = process.env.SUPABASE_CERTIFICATE_BUCKET || "certificates";
  await admin.storage.from(bucket).remove([template.file_path]);

  revalidatePath("/manajemen-sertifikat");
  return { success: true, message: "Template berhasil dihapus." };
}
