import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ValidationPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function CertificateValidationPage({ params }: ValidationPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: certificate, error } = await supabase
    .from("sertifikat")
    .select(
      `
      id,
      nomor_sertifikat,
      tanggal_terbit,
      status,
      peserta:peserta_id (
        nama_lengkap
      ),
      pelatihan:pelatihan_id (
        judul,
        kategori
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !certificate || certificate.status !== "terbit") {
    notFound();
  }

  const peserta = Array.isArray(certificate.peserta) ? certificate.peserta[0] : certificate.peserta;
  const pelatihan = Array.isArray(certificate.pelatihan) ? certificate.pelatihan[0] : certificate.pelatihan;

  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white border border-navy/10 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-navy text-white p-6">
          <p className="text-gold text-sm font-semibold mb-2">Validasi Sertifikat</p>
          <h1 className="text-2xl font-bold">Sertifikat Terverifikasi</h1>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-sm text-gray-500">Nama Peserta</p>
            <p className="text-xl font-bold text-navy">{peserta?.nama_lengkap || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pelatihan</p>
            <p className="text-lg font-semibold text-navy">{pelatihan?.judul || "-"}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nomor Sertifikat</p>
              <p className="font-semibold text-navy">{certificate.nomor_sertifikat}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal Terbit</p>
              <p className="font-semibold text-navy">{formatDate(certificate.tanggal_terbit)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
