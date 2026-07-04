import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MateriManager from "./components/MateriManager";

type MateriPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MateriPelatihanPage({ params }: MateriPageProps) {
  const { id } = await params;
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "admin") {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  // Fetch pelatihan info
  const { data: pelatihan, error } = await supabase
    .from("pelatihan")
    .select("id, judul")
    .eq("id", id)
    .single();

  if (error || !pelatihan) {
    notFound();
  }

  // Fetch materi list
  const { data: materiList } = await supabase
    .from("materi_pelatihan")
    .select("*")
    .eq("pelatihan_id", id)
    .order("urutan", { ascending: true });

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-gray-50">
      <ScrollReveal>
        <div className="bg-white border-b border-navy/10 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                  Kelola <span className="text-gold">Materi</span>
                </h1>
                <p className="text-silver text-lg max-w-2xl">
                  Kelola materi untuk pelatihan &quot;{pelatihan.judul}&quot;
                </p>
              </div>

              <nav className="flex items-center space-x-2 text-sm text-silver">
                <Link href="/pelatihan-admin" className="hover:text-navy transition-colors duration-200">
                  Manajemen Pelatihan
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href={`/pelatihan-admin/edit/${id}`} className="hover:text-navy transition-colors duration-200">
                  Edit Pelatihan
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-navy font-medium">Kelola Materi</span>
              </nav>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <MateriManager pelatihanId={id} initialMateriList={materiList || []} />
      </div>
    </div>
  );
}
