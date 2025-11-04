import SertifikatHero from "./SertifikatHero";
import SertifikatStats from "./SertifikatStats";
import SertifikatList from "./SertifikatList";
import { SessionUser } from "@/contexts/AuthContext";
import type { CertificateWithCourse } from "../page";

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
};

export default function SertifikatContainer({ user, certificates, stats }: SertifikatContainerProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      {/* Hero Section with personalized greeting */}
      <SertifikatHero user={user} />

      <div className="flex flex-col items-center justify-center p-12 mt-20 text-center">
        {/* Ikon Konstruksi (SVG Inline) */}
        <div className="p-4 bg-blue-100 rounded-full">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.363-.44A2 2 0 0115 12.571V12a2 2 0 00-2-2h-1V6a2 2 0 00-2-2H8a2 2 0 00-2 2v4H5a2 2 0 00-2 2v.571a2 2 0 01-1.045 1.887l-2.363.44a2 2 0 00-1.022.547A2 2 0 000 17.382V20a2 2 0 002 2h20a2 2 0 002-2v-2.618a2 2 0 00-.572-1.954zM9 6h6v4H9V6z"
            />
          </svg>
        </div>

        {/* Judul Pesan */}
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">Halaman Sedang Disiapkan</h2>

        {/* Isi Pesan */}
        <p className="mt-2 text-gray-600 max-w-md">Fitur ini sedang dalam tahap akhir pengembangan dan akan segera diluncurkan. Terima kasih atas kesabaran Anda.</p>
      </div>

      {/* Statistics Section */}
      {/* <SertifikatStats stats={stats} /> */}

      {/* Certificates List Section */}
      {/* <SertifikatList certificates={certificates} /> */}
    </div>
  );
}
