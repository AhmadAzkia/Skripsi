import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AdminPelatihanClient from "./components/AdminPelatihanClient";
import { getUserWithRole } from "@/lib/user";

// Fungsi untuk ambil data kursus (bisa juga ditaruh di lib/database.ts)
async function getSemuaKursus(supabase: any) {
  const { data, error } = await supabase.from("kursus").select("*");
  if (error) return [];
  return data;
}

export default async function AdminKursusPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Keamanan: Cek User & Role
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // 2. Ambil Data
  const kursus = await getSemuaKursus(supabase);

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
                  Manajemen <span className="text-gold">Pelatihan</span>
                </h1>
                <p className="text-silver text-lg max-w-2xl">Kelola semua pelatihan dan kursus dalam platform. Tambah, edit, atau hapus pelatihan sesuai kebutuhan.</p>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm text-silver">
                    <div className="w-2 h-2 bg-linear-to-r from-navy to-gold rounded-full"></div>
                    <span>
                      Total: <span className="font-semibold text-navy">{kursus.length}</span> pelatihan
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-silver">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      Published: <span className="font-semibold text-navy">{kursus.filter((k: any) => k.status === "published").length}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-silver">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span>
                      Draft: <span className="font-semibold text-navy">{kursus.filter((k: any) => k.status === "draft").length}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Primary CTA */}
                <Link
                  href="/pelatihan-admin/tambah"
                  className="px-6 py-3 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover-lift flex items-center gap-2 text-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Pelatihan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Render Komponen & Teruskan Data + Role */}
        <AdminPelatihanClient kursusData={kursus} />
      </div>
    </div>
  );
}
