import { getUserWithRole } from "@/lib/user";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/contexts/AuthContext";

export default async function RiwayatPesertaPage() {
  // Ambil data user DAN profil (termasuk peran) dari helper
  const userData = await getUserWithRole();

  // Pengaman jika user tidak ditemukan (meskipun layout sudah melindungi)
  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login"); // Arahkan ke login jika tidak sesuai
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-navy via-navy to-blue-900 py-12 md:py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-gold rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-silver rounded-full animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold rounded-full animate-bounce-gentle" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white-text mb-2">
              Riwayat <span className="text-gold">Transaksi</span>
            </h1>
            <p className="text-silver text-lg max-w-2xl mx-auto">Kelola dan lihat riwayat semua transaksi pembayaran pelatihan Anda</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
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
    </div>
  );
}
