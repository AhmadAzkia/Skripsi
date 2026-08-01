"use server";

import { createHash } from "crypto";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ensureCertificateForCourse } from "@/lib/certificate-generator";
import { getUserWithRole } from "@/lib/user";
import type { ImportPreview, ImportPreviewRow } from "./types";

const REQUIRED_COLUMNS = [
  "pendaftaran_id",
  "nama_peserta",
  "email",
  "jumlah_pertemuan",
  "jumlah_hadir",
  "nilai_ujian",
] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type RawRow = Record<string, unknown>;
type Registration = {
  id: string;
  pengguna_id: string;
  profil_pengguna: { nama_lengkap: string; email: string } | { nama_lengkap: string; email: string }[] | null;
};

async function getAdminContext() {
  const userData = await getUserWithRole();
  if (!userData?.user || userData.role !== "admin" || !userData.profile) throw new Error("Akses admin diperlukan.");
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Admin client tidak tersedia.");
  return { db: admin as any, profileId: userData.profile.id };
}

function numericValue(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

async function parseAndValidate(file: File, pelatihanId: string): Promise<ImportPreview> {
  if (!file || !file.name.toLowerCase().endsWith(".xlsx")) throw new Error("File harus berformat .xlsx.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran file maksimal 5 MB.");

  const buffer = Buffer.from(await file.arrayBuffer());
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "buffer" });
  } catch {
    throw new Error("File Excel tidak dapat dibaca.");
  }
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("File Excel tidak memiliki worksheet.");
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: "", raw: true });
  const headers = (XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" })[0] || []).map((item) => String(item).trim());
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missing.length) throw new Error(`Kolom wajib tidak ditemukan: ${missing.join(", ")}.`);
  if (!rows.length) throw new Error("File Excel tidak berisi data peserta.");

  const { db } = await getAdminContext();
  const { data, error } = await db
    .from("pendaftaran_pelatihan")
    .select("id, pengguna_id, profil_pengguna!inner(nama_lengkap, email)")
    .eq("pelatihan_id", pelatihanId);
  if (error) throw new Error(`Gagal memeriksa pendaftaran: ${error.message}`);
  const registrations = new Map<string, Registration>((data || []).map((item: Registration) => [item.id, item]));
  const seen = new Set<string>();

  const previewRows: ImportPreviewRow[] = rows.map((row, index) => {
    const pendaftaranId = String(row.pendaftaran_id || "").trim();
    const namaPeserta = String(row.nama_peserta || "").trim();
    const email = String(row.email || "").trim().toLowerCase();
    const jumlahPertemuan = numericValue(row.jumlah_pertemuan);
    const jumlahHadir = numericValue(row.jumlah_hadir);
    const nilaiUjian = numericValue(row.nilai_ujian);
    const errors: string[] = [];
    const registration = registrations.get(pendaftaranId);
    const profile = Array.isArray(registration?.profil_pengguna) ? registration.profil_pengguna[0] : registration?.profil_pengguna;

    if (!pendaftaranId) errors.push("pendaftaran_id wajib diisi");
    else if (!registration) errors.push("Pendaftaran tidak ditemukan pada pelatihan ini");
    else if (seen.has(pendaftaranId)) errors.push("pendaftaran_id duplikat dalam file");
    if (!namaPeserta) errors.push("nama_peserta wajib diisi");
    if (!email) errors.push("email wajib diisi");
    if (profile && namaPeserta.localeCompare(profile.nama_lengkap, "id", { sensitivity: "base" }) !== 0) errors.push("Nama tidak sesuai data peserta");
    if (profile && email !== profile.email.toLowerCase()) errors.push("Email tidak sesuai data peserta");
    if (jumlahPertemuan === null || !Number.isInteger(jumlahPertemuan) || jumlahPertemuan <= 0) errors.push("jumlah_pertemuan harus bilangan bulat lebih dari 0");
    if (jumlahHadir === null || !Number.isInteger(jumlahHadir) || jumlahHadir < 0) errors.push("jumlah_hadir harus bilangan bulat minimal 0");
    if (jumlahPertemuan !== null && jumlahHadir !== null && jumlahHadir > jumlahPertemuan) errors.push("jumlah_hadir melebihi jumlah_pertemuan");
    if (nilaiUjian === null || nilaiUjian < 0 || nilaiUjian > 100) errors.push("nilai_ujian harus bernilai 0 sampai 100");
    if (pendaftaranId) seen.add(pendaftaranId);

    return {
      rowNumber: index + 2,
      pendaftaranId,
      namaPeserta,
      email,
      jumlahPertemuan,
      jumlahHadir,
      nilaiUjian,
      persentaseKehadiran: jumlahPertemuan && jumlahHadir !== null ? Math.round((jumlahHadir / jumlahPertemuan) * 10000) / 100 : null,
      statusKelulusan: null,
      errors,
    };
  });

  const { data: course, error: courseError } = await db
    .from("pelatihan")
    .select("minimal_kehadiran_persen, minimal_nilai_ujian")
    .eq("id", pelatihanId)
    .single();
  if (courseError || !course) throw new Error("Pelatihan tidak ditemukan.");
  for (const row of previewRows) {
    if (!row.errors.length && row.persentaseKehadiran !== null && row.nilaiUjian !== null) {
      row.statusKelulusan = row.persentaseKehadiran >= course.minimal_kehadiran_persen && row.nilaiUjian >= course.minimal_nilai_ujian ? "lulus" : "tidak_lulus";
    }
  }
  const validCount = previewRows.filter((row) => !row.errors.length).length;
  return { rows: previewRows, validCount, invalidCount: previewRows.length - validCount };
}

export async function previewEvaluationExcel(pelatihanId: string, file: File) {
  try {
    await getAdminContext();
    return { success: true as const, data: await parseAndValidate(file, pelatihanId) };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Gagal membaca file Excel." };
  }
}

export async function applyEvaluationExcel(pelatihanId: string, file: File) {
  try {
    const { db, profileId } = await getAdminContext();
    const preview = await parseAndValidate(file, pelatihanId);
    if (!preview.validCount) return { success: false as const, error: "Tidak ada baris valid yang dapat diproses." };
    const bytes = Buffer.from(await file.arrayBuffer());
    const now = new Date().toISOString();
    const { data: course } = await db.from("pelatihan").select("harga, minimal_kehadiran_persen, minimal_nilai_ujian").eq("id", pelatihanId).single();
    if (!course) throw new Error("Pelatihan tidak ditemukan.");
    const { data: batch, error: batchError } = await db.from("impor_hasil_pelatihan").insert({
      pelatihan_id: pelatihanId,
      nama_file: file.name,
      hash_file: createHash("sha256").update(bytes).digest("hex"),
      ukuran_file: file.size,
      status: preview.invalidCount ? "sebagian_gagal" : "diproses",
      diunggah_oleh: profileId,
      jumlah_baris: preview.rows.length,
      jumlah_berhasil: preview.validCount,
      jumlah_gagal: preview.invalidCount,
      pesan_error: preview.invalidCount ? `${preview.invalidCount} baris gagal validasi` : null,
      diproses_pada: now,
    }).select("id").single();
    if (batchError || !batch) throw new Error(`Gagal menyimpan audit impor: ${batchError?.message || "data kosong"}`);

    const validRegistrationIds = new Set(preview.rows.filter((row) => !row.errors.length).map((row) => row.pendaftaranId));
    const auditPayload = preview.rows.map((row) => ({
      impor_id: batch.id,
      nomor_baris: row.rowNumber,
      pendaftaran_id: validRegistrationIds.has(row.pendaftaranId) ? row.pendaftaranId : null,
      email_sumber: row.email || null,
      nama_sumber: row.namaPeserta || null,
      jumlah_pertemuan_sumber: row.jumlahPertemuan,
      jumlah_hadir_sumber: row.jumlahHadir,
      nilai_ujian_sumber: row.nilaiUjian,
      data_asli: {
        pendaftaran_id: row.pendaftaranId,
        nama_peserta: row.namaPeserta,
        email: row.email,
        jumlah_pertemuan: row.jumlahPertemuan,
        jumlah_hadir: row.jumlahHadir,
        nilai_ujian: row.nilaiUjian,
      },
      status_proses: row.errors.length ? "gagal" : "berhasil",
      kode_error: row.errors.length ? "VALIDASI" : null,
      pesan_error: row.errors.length ? row.errors.join("; ") : null,
      diproses_pada: now,
    }));
    const { data: auditRows, error: auditError } = await db.from("impor_hasil_pelatihan_baris").insert(auditPayload).select("id, nomor_baris");
    if (auditError) throw new Error(`Gagal menyimpan detail audit: ${auditError.message}`);
    const auditIds = new Map<number, string>((auditRows || []).map((row: { id: string; nomor_baris: number }) => [row.nomor_baris, row.id]));
    const validRows = preview.rows.filter((row) => !row.errors.length);

    const { error: resultError } = await db.from("hasil_pelatihan").upsert(validRows.map((row) => ({
      pendaftaran_id: row.pendaftaranId,
      jumlah_pertemuan: row.jumlahPertemuan,
      jumlah_hadir: row.jumlahHadir,
      nilai_ujian: row.nilaiUjian,
      minimal_kehadiran_snapshot: course.minimal_kehadiran_persen,
      minimal_nilai_snapshot: course.minimal_nilai_ujian,
      sumber: "impor_excel",
      impor_baris_id: auditIds.get(row.rowNumber),
      alasan_perubahan: null,
      dievaluasi_oleh: profileId,
      dievaluasi_pada: now,
      diperbarui_pada: now,
    })), { onConflict: "pendaftaran_id" });
    if (resultError) throw new Error(`Gagal menyimpan evaluasi: ${resultError.message}`);
    const { error: registrationError } = await db.from("pendaftaran_pelatihan").update({ status: "selesai", tanggal_selesai: now, diperbarui_pada: now }).in("id", validRows.map((row) => row.pendaftaranId));
    if (registrationError) throw new Error(`Gagal memperbarui pendaftaran: ${registrationError.message}`);

    const passedRegistrationIds = validRows.filter((row) => row.statusKelulusan === "lulus").map((row) => row.pendaftaranId);
    const { data: registrations } = course.harga > 0 && passedRegistrationIds.length
      ? await db.from("pendaftaran_pelatihan").select("id, pengguna_id").in("id", passedRegistrationIds)
      : { data: [] };
    const certificateErrors: string[] = [];
    for (const registration of registrations || []) {
      try {
        await ensureCertificateForCourse(registration.pengguna_id, pelatihanId, db);
      } catch (error) {
        certificateErrors.push(error instanceof Error ? error.message : "Gagal membuat sertifikat");
      }
    }
    revalidatePath(`/pelatihan-admin/${pelatihanId}/peserta`);
    return { success: true as const, imported: validRows.length, rejected: preview.invalidCount, certificateErrors };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Gagal menerapkan hasil evaluasi." };
  }
}

export async function updateEvaluationManual(pelatihanId: string, input: { pendaftaranId: string; jumlahPertemuan: number; jumlahHadir: number; nilaiUjian: number; alasan: string }) {
  try {
    const { db, profileId } = await getAdminContext();
    if (!input.alasan.trim()) throw new Error("Alasan perubahan wajib diisi.");
    if (!Number.isInteger(input.jumlahPertemuan) || input.jumlahPertemuan <= 0) throw new Error("Jumlah pertemuan tidak valid.");
    if (!Number.isInteger(input.jumlahHadir) || input.jumlahHadir < 0 || input.jumlahHadir > input.jumlahPertemuan) throw new Error("Jumlah hadir tidak valid.");
    if (!Number.isFinite(input.nilaiUjian) || input.nilaiUjian < 0 || input.nilaiUjian > 100) throw new Error("Nilai ujian harus 0 sampai 100.");
    const { data: registration } = await db.from("pendaftaran_pelatihan").select("id, pengguna_id").eq("id", input.pendaftaranId).eq("pelatihan_id", pelatihanId).single();
    if (!registration) throw new Error("Pendaftaran peserta tidak ditemukan.");
    const { data: course } = await db.from("pelatihan").select("harga, minimal_kehadiran_persen, minimal_nilai_ujian").eq("id", pelatihanId).single();
    if (!course) throw new Error("Pelatihan tidak ditemukan.");
    const attendance = Math.round((input.jumlahHadir / input.jumlahPertemuan) * 10000) / 100;
    const passed = attendance >= course.minimal_kehadiran_persen && input.nilaiUjian >= course.minimal_nilai_ujian;
    const now = new Date().toISOString();
    const { error } = await db.from("hasil_pelatihan").upsert({
      pendaftaran_id: input.pendaftaranId,
      jumlah_pertemuan: input.jumlahPertemuan,
      jumlah_hadir: input.jumlahHadir,
      nilai_ujian: input.nilaiUjian,
      minimal_kehadiran_snapshot: course.minimal_kehadiran_persen,
      minimal_nilai_snapshot: course.minimal_nilai_ujian,
      sumber: "manual",
      impor_baris_id: null,
      alasan_perubahan: input.alasan.trim(),
      dievaluasi_oleh: profileId,
      dievaluasi_pada: now,
      diperbarui_pada: now,
    }, { onConflict: "pendaftaran_id" });
    if (error) throw new Error(`Gagal menyimpan evaluasi: ${error.message}`);
    await db.from("pendaftaran_pelatihan").update({ status: "selesai", tanggal_selesai: now, diperbarui_pada: now }).eq("id", input.pendaftaranId);
    if (passed && course.harga > 0) await ensureCertificateForCourse(registration.pengguna_id, pelatihanId, db);
    revalidatePath(`/pelatihan-admin/${pelatihanId}/peserta`);
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Gagal memperbarui evaluasi." };
  }
}
