import Link from "next/link";
import SertifikatHero from "./SertifikatHero";
import SertifikatList from "./SertifikatList";
import CertificateClaimCard from "./CertificateClaimCard";
import { SessionUser } from "@/contexts/AuthContext";
import type { CertificateClaim, CertificateWithCourse } from "../page";

type SertifikatContainerProps = {
  user: SessionUser;
  certificates: CertificateWithCourse[];
  claims: CertificateClaim[];
  selectedClaim: CertificateClaim | null;
};

function ClaimSummary({ claims }: { claims: CertificateClaim[] }) {
  const pendingClaims = claims.filter((claim) => claim.status === "tawarkan_pembelian" || claim.status === "menunggu_pembayaran");

  if (pendingClaims.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy mb-2">Sertifikat Opsional</h2>
          <p className="text-gray-600">Pelatihan gratis yang sudah selesai dan sertifikatnya dapat diklaim atau dibeli.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingClaims.map((claim) => (
            <div key={claim.pelatihanId} className="border border-gold/30 rounded-lg p-5 bg-amber-50/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-1">{claim.status === "menunggu_pembayaran" ? "Menunggu Pembayaran" : "Belum Dibeli"}</p>
                  <h3 className="font-bold text-navy">{claim.judul}</h3>
                  <p className="text-sm text-gray-600 mt-1">{claim.kategori}</p>
                </div>
                <Link href={`/sertifikat?pelatihanId=${claim.pelatihanId}`} className="px-4 py-2 bg-gold text-navy rounded-lg font-semibold text-center hover:bg-gold/90">
                  {claim.status === "menunggu_pembayaran" ? "Lanjutkan" : claim.hargaSertifikat === 0 ? "Klaim Sertifikat" : "Beli Sertifikat"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SertifikatContainer({ user, certificates, claims, selectedClaim }: SertifikatContainerProps) {
  const shouldOfferCertificate = selectedClaim?.status === "tawarkan_pembelian" || selectedClaim?.status === "menunggu_pembayaran";

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <SertifikatHero user={user} />

      {shouldOfferCertificate && (
        <CertificateClaimCard
          pelatihanId={selectedClaim.pelatihanId}
          courseTitle={selectedClaim.judul}
          certificatePrice={selectedClaim.hargaSertifikat}
          paymentStatus={selectedClaim.certificatePaymentStatus}
        />
      )}

      {selectedClaim?.status === "termasuk_pelatihan_berbayar" && (
        <section className="py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-blue-200 bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-navy mb-2">Sertifikat sedang disiapkan</h2>
              <p className="text-gray-700">Anda telah dinyatakan lulus dan sertifikat termasuk dalam pembayaran pelatihan. Muat ulang halaman ini beberapa saat lagi bila sertifikat belum muncul.</p>
            </div>
          </div>
        </section>
      )}

      {selectedClaim?.status === "menunggu_pelatihan_selesai" && (
        <section className="py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-navy mb-2">Pelatihan masih berlangsung</h2>
              <p className="text-gray-700">Sertifikat baru dapat dibeli setelah tanggal selesai pelatihan terlewati dan peserta dinyatakan lulus.</p>
            </div>
          </div>
        </section>
      )}

      {(selectedClaim?.status === "menunggu_evaluasi" || selectedClaim?.status === "tidak_lulus") && (
        <section className="py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-xl border p-6 ${selectedClaim.status === "tidak_lulus" ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
              <h2 className="text-xl font-bold text-navy mb-2">{selectedClaim.status === "tidak_lulus" ? "Belum memenuhi syarat kelulusan" : "Menunggu hasil evaluasi"}</h2>
              <p className="text-gray-700">
                {selectedClaim.status === "tidak_lulus"
                  ? "Sertifikat hanya tersedia bagi peserta yang memenuhi ketentuan kehadiran dan nilai ujian."
                  : "Admin belum memasukkan hasil kehadiran dan nilai ujian untuk pelatihan ini."}
              </p>
            </div>
          </div>
        </section>
      )}

      <ClaimSummary claims={claims} />
      <SertifikatList certificates={certificates} />
    </div>
  );
}
