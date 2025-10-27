import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import TambahPelatihanForm from "./components/TambahPelatihanForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default async function TambahPelatihanPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Keamanan: Cek User & Role
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Optional: Verifikasi role admin
  // const userRole = await getUserRole(user.id);
  // if (userRole !== 'admin') {
  //   redirect('/unauthorized');
  // }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-gray-50">
      {/* Header Section */}
      <ScrollReveal>
        <div className="bg-white border-b border-navy/10 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Title & Description */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                  Tambah <span className="text-gold">Pelatihan Baru</span>
                </h1>
                <p className="text-silver text-lg max-w-2xl">Buat pelatihan baru dengan mengisi informasi yang diperlukan. Pastikan semua data telah terisi dengan benar.</p>
              </div>

              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-silver">
                <Link href="/pelatihan-admin" className="hover:text-navy transition-colors duration-200">
                  Manajemen Pelatihan
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-navy font-medium">Tambah Pelatihan</span>
              </nav>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <TambahPelatihanForm />
      </div>
    </div>
  );
}
