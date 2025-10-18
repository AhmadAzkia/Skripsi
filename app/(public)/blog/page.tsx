// app/(public)/blog/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "@/../types/database";
import { ScrollReveal } from "@/components/ui";
import { BlogHero, BlogStats, FeaturedPost, BlogCategories, BlogArticlesSection, BlogTestimonials, BlogNewsletter, BlogPopularTags, BlogCTA } from "./components";

export type PostWithAuthor = Tables<"artikel_blog"> & {
  profil_pengguna: Pick<Tables<"profil_pengguna">, "nama_lengkap" | "peran"> | null;
};

async function getBlogPosts(): Promise<PostWithAuthor[]> {
  const supabase = await createSupabaseServerClient();

  const { data: posts, error } = await supabase
    .from("artikel_blog")
    .select(
      `
      *,
      profil_pengguna ( nama_lengkap, peran )
    `
    )
    .eq("status", "published")
    .order("dipublikasi_pada", { ascending: false });

  if (error) {
    console.error("Gagal mengambil artikel blog:", error);
    return [];
  }
  return posts;
}

export default async function BlogPage() {
  // Server-side data fetching
  const allPosts = await getBlogPosts();

  // Data processing
  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  const otherPosts = allPosts.length > 1 ? allPosts.slice(1) : [];
  const allTags = allPosts.flatMap((post) => post.tags || []);
  const uniqueTags = [...new Set(allTags)];

  // Statistics calculation
  const stats = {
    totalPosts: allPosts.length,
    totalCategories: uniqueTags.length,
    activeReaders: Math.floor(allPosts.length * 2.5),
    satisfactionRating: 95,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <BlogHero />

      {/* Statistics Section */}
      <BlogStats totalPosts={stats.totalPosts} totalCategories={stats.totalCategories} activeReaders={stats.activeReaders} satisfactionRating={stats.satisfactionRating} />

      {/* Featured Article Section */}
      {featuredPost && (
        <ScrollReveal delay={200}>
          <FeaturedPost post={featuredPost} />
        </ScrollReveal>
      )}

      {/* Categories Filter Section */}
      <BlogCategories categories={uniqueTags} />

      {/* Articles Section */}
      <BlogArticlesSection posts={otherPosts} categories={uniqueTags} />

      {/* Testimonials Section */}
      <BlogTestimonials />

      {/* Newsletter Section */}
      <BlogNewsletter />

      {/* Popular Tags Section */}
      <BlogPopularTags tags={uniqueTags} />

      {/* CTA Section */}
      <BlogCTA />
    </div>
  );
}
