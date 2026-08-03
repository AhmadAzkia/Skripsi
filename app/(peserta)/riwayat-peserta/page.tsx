import { getUserWithRole } from "@/lib/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const COURSE_TIME_ZONE = "Asia/Jakarta";

const paymentStatusClass = {
  menunggu: "bg-amber-50 text-amber-700 border-amber-200",
  berhasil: "bg-green-50 text-green-700 border-green-200",
  gagal: "bg-red-50 text-red-700 border-red-200",
  dikembalikan: "bg-gray-50 text-gray-700 border-gray-200",
};

const paymentStatusLabel = {
  menunggu: "Menunggu",
  berhasil: "Berhasil",
  gagal: "Gagal",
  dikembalikan: "Dikembalikan",
};

const registrationStatusClass: Record<string, string> = {
  menunggu_pembayaran: "bg-amber-50 text-amber-700 border-amber-200",
  terdaftar: "bg-navy/10 text-navy border-navy/30",
  sedang_belajar: "bg-gold/10 text-amber-700 border-gold/30",
  selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
  dibatalkan: "bg-red-50 text-red-700 border-red-200",
};

const registrationStatusLabel: Record<string, string> = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  terdaftar: "Mendatang",
  sedang_belajar: "Sedang Berlangsung",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const graduationStatusClass: Record<string, string> = {
  lulus: "bg-green-50 text-green-700 border-green-200",
  tidak_lulus: "bg-red-50 text-red-700 border-red-200",
};

const graduationStatusLabel: Record<string, string> = {
  lulus: "Lulus",
  tidak_lulus: "Tidak Lulus",
};

function firstRelation<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getTodayDateInCourseTimeZone() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: COURSE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function getDateOnly(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function getActualTrainingStatus(statusDatabase: string, tanggalMulai?: string | null, tanggalSelesai?: string | null) {
  if (["dibatalkan", "menunggu_pembayaran", "selesai"].includes(statusDatabase)) {
    return statusDatabase;
  }

  const today = getTodayDateInCourseTimeZone();
  const startDate = getDateOnly(tanggalMulai);
  const endDate = getDateOnly(tanggalSelesai);

  if (endDate && today > endDate) {
    return "selesai";
  }

  if (startDate && today >= startDate && (!endDate || today <= endDate)) {
    return "sedang_belajar";
  }

  if (startDate && today < startDate) {
    return "terdaftar";
  }

  return statusDatabase;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPaymentType(value?: string | null) {
  if (value === "klaim_sertifikat") return "Klaim Sertifikat";
  return "Pembayaran Pelatihan";
}

export default async function RiwayatPesertaPage() {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  const profileId = userData.profile.id;
  const supabase = await createSupabaseServerClient();
  const [paymentsResult, registrationsResult, certificatesResult] = await Promise.all([
    supabase
      .from("pembayaran")
      .select(
        `
        id,
        jumlah,
        status_pembayaran,
        metode_pembayaran,
        id_pembayaran_eksternal,
        tipe_pembayaran,
        pelatihan_id,
        dibuat_pada,
        pelatihan:pelatihan_id (
          judul,
          kategori
        )
      `,
      )
      .eq("pengguna_id", profileId)
      .order("dibuat_pada", { ascending: false }),
    supabase
      .from("pendaftaran_pelatihan")
      .select(
        `
        id,
        status,
        tanggal_daftar,
        tanggal_selesai,
        pelatihan:pelatihan_id (
          id,
          judul,
          kategori,
          tipe_pelatihan,
          tanggal_mulai,
          tanggal_selesai,
          harga
        ),
        hasil_pelatihan (
          status_kelulusan,
          persentase_kehadiran,
          nilai_ujian
        )
      `,
      )
      .eq("pengguna_id", profileId)
      .order("tanggal_daftar", { ascending: false }),
    supabase
      .from("sertifikat")
      .select("id, pelatihan_id, status")
      .eq("peserta_id", profileId)
      .eq("status", "terbit"),
  ]);

  const payments = paymentsResult.data || [];
  const registrations = registrationsResult.data || [];
  const certificates = certificatesResult.data || [];
  const certificatesByCourseId = new Map(certificates.map((certificate) => [certificate.pelatihan_id, certificate]));
  const paymentsByCourseId = new Map(payments.map((payment) => [payment.pelatihan_id, payment]));
  const completedTrainings = registrations.filter((registration) => {
    const course = firstRelation(registration.pelatihan);
    return getActualTrainingStatus(registration.status, course?.tanggal_mulai, course?.tanggal_selesai) === "selesai";
  }).length;
  const successfulPayments = payments.filter((payment) => payment.status_pembayaran === "berhasil").length;

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2">
              Riwayat <span className="text-gold">Transaksi & Pelatihan</span>
            </h1>
            <p className="text-silver text-lg max-w-2xl mx-auto">Pantau perjalanan pelatihan, hasil evaluasi, sertifikat, dan status pembayaran Anda.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Pelatihan</p>
            <p className="text-2xl font-bold text-navy">{registrations.length}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pelatihan Selesai</p>
            <p className="text-2xl font-bold text-emerald-700">{completedTrainings}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-2xl font-bold text-navy">{payments.length}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pembayaran Berhasil</p>
            <p className="text-2xl font-bold text-green-700">{successfulPayments}</p>
          </div>
        </div>

        <div className="bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-navy">Riwayat Pelatihan</h2>
            {registrationsResult.error && <p className="text-sm text-red-600 mt-2">Gagal memuat riwayat pelatihan: {registrationsResult.error.message}</p>}
          </div>

          {registrations.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-lg font-semibold text-navy mb-2">Belum ada pelatihan</h3>
              <p className="text-gray-600 mb-6">Daftar pelatihan untuk mulai membangun riwayat belajar Anda.</p>
              <Link href="/katalog-pelatihan" className="inline-flex px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90">
                Lihat Katalog Pelatihan
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {registrations.map((registration) => {
                const course = firstRelation(registration.pelatihan);
                const result = firstRelation(registration.hasil_pelatihan);
                const status = getActualTrainingStatus(registration.status, course?.tanggal_mulai, course?.tanggal_selesai);
                const certificate = course?.id ? certificatesByCourseId.get(course.id) : null;
                const payment = course?.id ? paymentsByCourseId.get(course.id) : null;

                return (
                  <div key={registration.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${registrationStatusClass[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                            {registrationStatusLabel[status] || status}
                          </span>
                          {course?.kategori && <span className="px-3 py-1 rounded-full bg-navy/10 text-navy text-xs font-semibold">{course.kategori}</span>}
                          {course?.tipe_pelatihan && <span className="px-3 py-1 rounded-full bg-gold/10 text-amber-700 text-xs font-semibold uppercase">{course.tipe_pelatihan}</span>}
                        </div>

                        <h3 className="font-bold text-navy text-lg">{course?.judul || "Pelatihan CertiGuardia"}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Periode: {formatDate(course?.tanggal_mulai)} - {formatDate(course?.tanggal_selesai)}
                        </p>
                        <p className="text-sm text-gray-500">Terdaftar pada {formatDate(registration.tanggal_daftar)}</p>

                        {result ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${graduationStatusClass[result.status_kelulusan] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                              {graduationStatusLabel[result.status_kelulusan] || result.status_kelulusan}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold">Kehadiran {result.persentase_kehadiran}%</span>
                            <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold">Nilai {result.nilai_ujian}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-4">Hasil evaluasi belum tersedia.</p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-44">
                        {status === "sedang_belajar" && course?.id && (
                          <Link href={`/materi-kursus/${course.id}`} className="px-4 py-2 bg-gold text-navy rounded-lg font-semibold text-center hover:bg-gold/90">
                            Buka Pelatihan
                          </Link>
                        )}
                        {status === "menunggu_pembayaran" && payment && (
                          <Link href={`/pembayaran/${payment.id}`} className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-semibold text-center hover:bg-amber-100">
                            Selesaikan Pembayaran
                          </Link>
                        )}
                        {certificate && (
                          <Link href={`/api/certificates/${certificate.id}/download`} className="px-4 py-2 border border-navy/20 text-navy rounded-lg font-semibold text-center hover:bg-navy/5">
                            Unduh Sertifikat
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-navy">Riwayat Transaksi</h2>
            {paymentsResult.error && <p className="text-sm text-red-600 mt-2">Gagal memuat riwayat transaksi: {paymentsResult.error.message}</p>}
          </div>

          {payments.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-lg font-semibold text-navy mb-2">Belum ada transaksi</h3>
              <p className="text-gray-600 mb-6">Pembayaran pelatihan dan klaim sertifikat akan tampil di sini.</p>
              <Link href="/katalog-pelatihan" className="inline-flex px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90">
                Lihat Katalog Pelatihan
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {payments.map((payment) => {
                const pelatihan = firstRelation(payment.pelatihan);

                return (
                  <div key={payment.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${paymentStatusClass[payment.status_pembayaran]}`}>{paymentStatusLabel[payment.status_pembayaran]}</span>
                        <span className="px-3 py-1 rounded-full bg-gold/10 text-amber-700 text-xs font-semibold">{formatPaymentType(payment.tipe_pembayaran)}</span>
                        {pelatihan?.kategori && <span className="px-3 py-1 rounded-full bg-navy/10 text-navy text-xs font-semibold">{pelatihan.kategori}</span>}
                      </div>
                      <h3 className="font-bold text-navy text-lg">{pelatihan?.judul || "Pelatihan CertiGuardia"}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {payment.id_pembayaran_eksternal || "Order belum tersedia"} &bull; {formatDate(payment.dibuat_pada)}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-xl font-bold text-navy mb-3">{formatCurrency(payment.jumlah)}</p>
                      <Link href={`/pembayaran/${payment.id}`} className="inline-flex px-4 py-2 border border-navy/20 text-navy rounded-lg font-semibold hover:bg-navy/5">
                        Detail Pembayaran
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
