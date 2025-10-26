import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ScrollReveal from "../../../components/ui/ScrollReveal";
import ArticleFormClient from "../components/ArticleFormClient";

export default async function TulisArtikelPage() {
  const supabase = await createSupabaseServerClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase.from("profil_pengguna").select("*").eq("user_id", user.id).single();

  // Check if user is pemateri
  if (!profile || profile.peran !== "instruktur") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy/5 via-white to-gold/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-navy to-gold rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-navy to-gold bg-clip-text text-transparent">Tulis Artikel Baru</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Bagikan pengetahuan dan pengalaman Anda melalui artikel blog yang inspiratif</p>
          </div>
        </ScrollReveal>

        {/* Form */}
        <ArticleFormClient userId={user.id} />
      </div>
    </div>
  );
}
