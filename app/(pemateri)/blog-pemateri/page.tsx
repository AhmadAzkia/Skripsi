import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ScrollReveal from "../../components/ui/ScrollReveal";
import BlogListClient from "./components/BlogListClient";
import { getArtikelPemateri, getBlogStats } from "./actions";

export default async function BlogPemateriPage() {
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

  // Fetch articles and stats
  const [articlesResult, statsResult] = await Promise.all([getArtikelPemateri(user.id), getBlogStats(user.id)]);

  const articles = articlesResult.success ? articlesResult.data || [] : [];
  const stats = {
    totalArtikel: 0,
    published: 0,
    draft: 0,
    review: 0,
    ...(statsResult.success && statsResult.data ? statsResult.data : {}),
  } as {
    totalArtikel: number;
    published: number;
    draft: number;
    review: number;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy/5 via-white to-gold/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-navy to-gold rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-navy to-gold bg-clip-text text-transparent">Kelola Blog</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Tulis, edit, dan kelola artikel blog untuk berbagi pengetahuan dengan komunitas</p>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Artikel</p>
                  <p className="text-3xl font-bold text-navy">{stats.totalArtikel}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-navy/10 to-gold/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Dipublikasi</p>
                  <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Draft</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-white rounded-xl shadow-lg border border-navy/10 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Review</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.review}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Blog List */}
        <BlogListClient initialArticles={articles} userId={user.id} />
      </div>
    </div>
  );
}
