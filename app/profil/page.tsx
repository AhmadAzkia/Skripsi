import { Suspense } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfilPesertaClient from "@/(peserta)/profil-peserta/components/ProfilPesertaClient";
import AdminNavbar from "@/components/navbars/AdminNavbar";
import PesertaNavbar from "@/components/navbars/PesertaNavbar";
import Footer from "@/components/Footer";

async function ProfilContent() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profil_pengguna")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return <ProfilPesertaClient initialData={null} error="Gagal memuat profil pengguna." />;
  }

  async function getStats(profileId: string) {
    try {
      const { count: enrolledCourses } = await supabase
        .from("pendaftaran_pelatihan")
        .select("*", { count: "exact", head: true })
        .eq("pengguna_id", profileId);

      const { count: completedCourses } = await supabase
        .from("pendaftaran_pelatihan")
        .select("*", { count: "exact", head: true })
        .eq("pengguna_id", profileId)
        .eq("status", "selesai");

      const { count: certificates } = await supabase
        .from("pendaftaran_pelatihan")
        .select("*", { count: "exact", head: true })
        .eq("pengguna_id", profileId)
        .eq("status", "selesai");

      return {
        enrolledCourses: enrolledCourses || 0,
        completedCourses: completedCourses || 0,
        certificates: certificates || 0,
      };
    } catch (error) {
      console.error("Error calculating stats:", error);
      return { enrolledCourses: 0, completedCourses: 0, certificates: 0 };
    }
  }

  const stats = await getStats(profile.id);

  return (
    <ProfilPesertaClient
      initialData={{
        profile,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        stats,
      }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProfilPage() {
  // Determine role to render correct navbar
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profil_pengguna")
      .select("peran")
      .eq("user_id", user.id)
      .single();
    role = profile?.peran || null;
  }

  const Navbar = role === "admin" ? AdminNavbar : PesertaNavbar;

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-gray-50">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingSkeleton />}>
          <ProfilContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
