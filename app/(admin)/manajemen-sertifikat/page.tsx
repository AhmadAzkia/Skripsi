import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { redirect } from "next/navigation";
import { CertificateAdminTabs, GenerateCertificateButton } from "./CertificateAdminActions";

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ManajemenSertifikatPage() {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "admin") {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  const [certificatesResult, templatesResult] = await Promise.all([
    supabase
      .from("sertifikat")
      .select(
        `
        id,
        nomor_sertifikat,
        status,
        tanggal_terbit,
        sertifikat_url,
        peserta:peserta_id (
          nama_lengkap,
          email
        ),
        kursus:kursus_id (
          judul,
          kategori
        )
      `,
      )
      .order("tanggal_terbit", { ascending: false }),
    supabase
      .from("template_sertifikat")
      .select("id, nama, file_path")
      .order("dibuat_pada", { ascending: false }),
  ]);

  const certificates = certificatesResult.data;
  const error = certificatesResult.error;
  const templates = templatesResult.data || [];

  const total = certificates?.length || 0;
  const terbit = certificates?.filter((certificate) => certificate.status === "terbit").length || 0;
  const punyaFile = certificates?.filter((certificate) => certificate.sertifikat_url).length || 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2">
            Manajemen <span className="text-gold">Sertifikat</span>
          </h1>
          <p className="text-silver text-lg max-w-3xl">Kelola template, pantau dokumen sertifikat digital, dan generate ulang file PDF bila diperlukan.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Sertifikat</p>
            <p className="text-2xl font-bold text-navy">{total}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Status Terbit</p>
            <p className="text-2xl font-bold text-green-700">{terbit}</p>
          </div>
          <div className="bg-white border border-navy/10 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">File Tersedia</p>
            <p className="text-2xl font-bold text-navy">{punyaFile}</p>
          </div>
        </div>

        <CertificateAdminTabs templates={templates} />

        <div className="bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-navy">Daftar Dokumen Sertifikat</h2>
            {error && <p className="text-sm text-red-600 mt-2">Gagal memuat sertifikat: {error.message}</p>}
          </div>

          {!certificates || certificates.length === 0 ? (
            <div className="p-10 text-center text-gray-600">Belum ada sertifikat.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Peserta</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pelatihan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nomor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status File</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {certificates.map((certificate) => {
                    const peserta = Array.isArray(certificate.peserta) ? certificate.peserta[0] : certificate.peserta;
                    const kursus = Array.isArray(certificate.kursus) ? certificate.kursus[0] : certificate.kursus;

                    return (
                      <tr key={certificate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-navy">{peserta?.nama_lengkap || "-"}</p>
                          <p className="text-sm text-gray-500">{peserta?.email || "-"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{kursus?.judul || "-"}</p>
                          <p className="text-sm text-gray-500">{kursus?.kategori || "-"}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{certificate.nomor_sertifikat}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(certificate.tanggal_terbit)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${certificate.sertifikat_url ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                            {certificate.sertifikat_url ? "Tersedia" : "Belum Ada File"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {certificate.sertifikat_url && (
                              <a href={certificate.sertifikat_url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm font-semibold rounded-lg border border-navy/20 text-navy hover:bg-navy/5">
                                Buka
                              </a>
                            )}
                            <GenerateCertificateButton certificateId={certificate.id} templates={templates} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
