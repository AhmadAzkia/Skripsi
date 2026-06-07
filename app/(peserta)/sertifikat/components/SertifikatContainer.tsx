import Link from "next/link";
import SertifikatHero from "./SertifikatHero";
import SertifikatStats from "./SertifikatStats";
import SertifikatList from "./SertifikatList";
import CertificateClaimCard from "./CertificateClaimCard";
import { SessionUser } from "@/contexts/AuthContext";
import type { CertificateClaim, CertificateWithCourse } from "../page";

type SertifikatStats = {
  totalSertifikat: number;
  sertifikatBulanIni: number;
  kategoriTerlengkap: string;
  rataRataNilai: number;
};

type SertifikatContainerProps = {
  user: SessionUser;
  certificates: CertificateWithCourse[];
  stats: SertifikatStats;
  claims: CertificateClaim[];
  selectedClaim: CertificateClaim | null;
  certificatePrice: number;
};

function ClaimSummary({ claims }: { claims: CertificateClaim[] }) {
  const pendingClaims = claims.filter((claim) => claim.status === "tawarkan_pembelian" || claim.status === "menunggu_pembayaran");

  if (pendingClaims.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy mb-2">Sertifikat Opsional</h2>
          <p className="text-gray-600">Pelatihan gratis yang sudah selesai dan dapat dibeli sertifikatnya.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingClaims.map((claim) => (
            <div key={claim.kursusId} className="border border-gold/30 rounded-lg p-5 bg-amber-50/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-1">{claim.status === "menunggu_pembayaran" ? "Menunggu Pembayaran" : "Belum Dibeli"}</p>
                  <h3 className="font-bold text-navy">{claim.judul}</h3>
                  <p className="text-sm text-gray-600 mt-1">{claim.kategori}</p>
                </div>
                <Link href={`/sertifikat?kursusId=${claim.kursusId}`} className="px-4 py-2 bg-gold text-navy rounded-lg font-semibold text-center hover:bg-gold/90">
                  {claim.status === "menunggu_pembayaran" ? "Lanjutkan" : "Beli Sertifikat"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SertifikatContainer({ user, certificates, stats, claims, selectedClaim, certificatePrice }: SertifikatContainerProps) {
  const shouldOfferCertificate = selectedClaim?.status === "tawarkan_pembelian" || selectedClaim?.status === "menunggu_pembayaran";

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <SertifikatHero user={user} />

      {shouldOfferCertificate && (
        <CertificateClaimCard
          kursusId={selectedClaim.kursusId}
          courseTitle={selectedClaim.judul}
          certificatePrice={certificatePrice}
          paymentStatus={selectedClaim.certificatePaymentStatus}
        />
      )}

      {selectedClaim?.status === "termasuk_pelatihan_berbayar" && (
        <section className="py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-blue-200 bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-navy mb-2">Sertifikat sedang disiapkan</h2>
              <p className="text-gray-700">Pelatihan ini berbayar, sehingga sertifikat sudah termasuk setelah pembayaran pelatihan lunas. Muat ulang halaman ini beberapa saat lagi bila sertifikat belum muncul.</p>
            </div>
          </div>
        </section>
      )}

      <SertifikatStats stats={stats} />
      <ClaimSummary claims={claims} />
      <SertifikatList certificates={certificates} />
    </div>
  );
}
