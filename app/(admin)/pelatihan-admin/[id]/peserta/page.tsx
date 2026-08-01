import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserWithRole } from "@/lib/user";
import ParticipantManager from "./ParticipantManager";
import type { ParticipantEvaluation } from "./types";

export default async function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const userData = await getUserWithRole();
  if (!userData?.user || userData.role !== "admin") redirect("/login");
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Admin client tidak tersedia.");
  const db = admin as any;
  const { data: course, error: courseError } = await db.from("pelatihan").select("id, judul, minimal_kehadiran_persen, minimal_nilai_ujian").eq("id", id).single();
  if (courseError || !course) notFound();
  const { data, error } = await db
    .from("pendaftaran_pelatihan")
    .select("id, pengguna_id, status, tanggal_daftar, profil_pengguna!inner(nama_lengkap, email), hasil_pelatihan(jumlah_pertemuan, jumlah_hadir, persentase_kehadiran, nilai_ujian, status_kelulusan, alasan_perubahan, dievaluasi_pada)")
    .eq("pelatihan_id", id)
    .order("tanggal_daftar", { ascending: false });
  if (error) throw new Error(`Gagal mengambil peserta: ${error.message}`);

  const participants: ParticipantEvaluation[] = (data || []).map((registration: any) => {
    const profile = Array.isArray(registration.profil_pengguna) ? registration.profil_pengguna[0] : registration.profil_pengguna;
    const result = Array.isArray(registration.hasil_pelatihan) ? registration.hasil_pelatihan[0] : registration.hasil_pelatihan;
    return {
      pendaftaranId: registration.id,
      penggunaId: registration.pengguna_id,
      nama: profile.nama_lengkap,
      email: profile.email,
      statusPendaftaran: registration.status,
      tanggalDaftar: registration.tanggal_daftar,
      jumlahPertemuan: result?.jumlah_pertemuan ?? null,
      jumlahHadir: result?.jumlah_hadir ?? null,
      persentaseKehadiran: result?.persentase_kehadiran ?? null,
      nilaiUjian: result?.nilai_ujian ?? null,
      statusKelulusan: result?.status_kelulusan ?? null,
      alasanPerubahan: result?.alasan_perubahan ?? null,
      dievaluasiPada: result?.dievaluasi_pada ?? null,
    };
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-gray-50">
      <div className="bg-white border-b border-navy/10 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-silver mb-5">
            <Link href="/pelatihan-admin" className="hover:text-navy">Manajemen Pelatihan</Link>
            <span>/</span><span className="text-navy font-medium">Peserta dan Evaluasi</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy">Peserta dan <span className="text-gold">Evaluasi</span></h1>
              <p className="text-silver mt-2 text-lg">{course.judul}</p>
            </div>
            <a href={`/api/admin/pelatihan/${id}/peserta/template`} className="inline-flex items-center justify-center px-5 py-3 border border-navy/20 bg-white text-navy rounded-lg font-medium hover:bg-navy/5">Unduh Template Excel</a>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ParticipantManager pelatihanId={id} initialParticipants={participants} minimumAttendance={Number(course.minimal_kehadiran_persen)} minimumScore={Number(course.minimal_nilai_ujian)} />
      </main>
    </div>
  );
}
