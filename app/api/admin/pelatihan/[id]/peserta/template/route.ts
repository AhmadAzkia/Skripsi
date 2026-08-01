import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserWithRole } from "@/lib/user";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userData = await getUserWithRole();
  if (!userData?.user || userData.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Admin client tidak tersedia." }, { status: 500 });
  const { id } = await params;
  const db = admin as any;
  const { data: course, error: courseError } = await db.from("pelatihan").select("judul").eq("id", id).single();
  if (courseError || !course) return NextResponse.json({ error: "Pelatihan tidak ditemukan." }, { status: 404 });
  const { data, error } = await db
    .from("pendaftaran_pelatihan")
    .select("id, profil_pengguna!inner(nama_lengkap, email), hasil_pelatihan(jumlah_pertemuan, jumlah_hadir, nilai_ujian)")
    .eq("pelatihan_id", id)
    .order("tanggal_daftar", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data || []).map((registration: any) => {
    const profile = Array.isArray(registration.profil_pengguna) ? registration.profil_pengguna[0] : registration.profil_pengguna;
    const result = Array.isArray(registration.hasil_pelatihan) ? registration.hasil_pelatihan[0] : registration.hasil_pelatihan;
    return {
      pendaftaran_id: registration.id,
      nama_peserta: profile?.nama_lengkap || "",
      email: profile?.email || "",
      jumlah_pertemuan: result?.jumlah_pertemuan ?? "",
      jumlah_hadir: result?.jumlah_hadir ?? "",
      nilai_ujian: result?.nilai_ujian ?? "",
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: ["pendaftaran_id", "nama_peserta", "email", "jumlah_pertemuan", "jumlah_hadir", "nilai_ujian"] });
  worksheet["!cols"] = [{ wch: 38 }, { wch: 28 }, { wch: 30 }, { wch: 20 }, { wch: 16 }, { wch: 14 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Evaluasi Peserta");
  const output = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const safeName = String(course.judul).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  return new NextResponse(output, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="evaluasi-${safeName || id}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
