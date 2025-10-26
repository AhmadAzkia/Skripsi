import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MateriManagementClient from "./components/MateriManagementClient";

// Fungsi untuk mengambil data kursus dan memverifikasi kepemilikan
async function getKursusWithMateri(kursusId: string, userId: string) {
  const supabase = await createSupabaseServerClient();

  // Pertama, dapatkan profil pengguna
  const { data: profile, error: profileError } = await supabase.from("profil_pengguna").select("*").eq("user_id", userId).single();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  // Ambil data kursus dan verifikasi kepemilikan
  const { data: kursus, error: kursusError } = await supabase.from("kursus").select("*").eq("id", kursusId).eq("instruktur_id", profile.id).single();

  if (kursusError || !kursus) {
    return null; // Kursus tidak ditemukan atau bukan milik pemateri
  }

  // Ambil materi untuk kursus ini
  const { data: materi, error: materiError } = await supabase.from("materi_kursus").select("*").eq("kursus_id", kursusId).order("urutan", { ascending: true });

  if (materiError) {
    console.error("Error fetching materi:", materiError);
  }

  return {
    kursus,
    materi: materi || [],
    profile,
  };
}

interface PageProps {
  params: { id: string };
}

export default async function MateriKursusPage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient();

  // Verifikasi autentikasi
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  try {
    const data = await getKursusWithMateri(params.id, user.id);

    if (!data) {
      notFound(); // Kursus tidak ditemukan atau bukan milik pemateri
    }

    const { kursus, materi, profile } = data;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-50">
        {/* Header Section */}
        <ScrollReveal>
          <div className="bg-white border-b border-navy/10 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Title & Description */}
                <div>
                  <nav className="flex items-center space-x-2 text-sm text-silver mb-4">
                    <Link href="/pelatihan-pemateri" className="hover:text-navy transition-colors duration-200">
                      Pelatihan Saya
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-navy font-medium">Kelola Materi</span>
                  </nav>

                  <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                    Materi <span className="text-gold">{kursus.judul}</span>
                  </h1>
                  <p className="text-silver text-lg max-w-2xl">Kelola materi pembelajaran untuk pelatihan Anda. Tambah, edit, atau hapus materi sesuai kebutuhan.</p>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-sm text-silver">
                      <div className="w-2 h-2 bg-gradient-to-r from-navy to-gold rounded-full"></div>
                      <span>
                        Total: <span className="font-semibold text-navy">{materi.length}</span> materi
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-silver">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        Durasi: <span className="font-semibold text-navy">{kursus.durasi_jam}</span> jam
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-silver">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>
                        Status: <span className="font-semibold text-navy capitalize">{kursus.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/pelatihan-pemateri/${params.id}/materi/tambah`}
                    className="px-6 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover-lift flex items-center gap-2 text-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tambah Materi
                  </Link>

                  <button className="px-4 py-2 text-navy border border-navy/20 hover:border-navy/30 rounded-lg hover:bg-navy/5 transition-all duration-300 font-medium text-sm">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Import Materi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <MateriManagementClient kursus={kursus} materiData={materi} profile={profile} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in MateriKursusPage:", error);
    notFound();
  }
}
