"use client";

import { ScrollReveal } from "@/app/components/ui";
import BlogFeed from "./BlogFeed";
import type { PostWithAuthor } from "../page";

interface BlogArticlesSectionProps {
  posts: PostWithAuthor[];
  categories: string[];
}

export default function BlogArticlesSection({ posts, categories }: BlogArticlesSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <ScrollReveal delay={200}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Artikel Terbaru</h2>
            <p className="text-lg text-silver max-w-2xl mx-auto">Kumpulan artikel pilihan yang akan membantu pengembangan karir dan pengetahuan Anda</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <BlogFeed initialPosts={posts} categories={categories} />
        </ScrollReveal>
      </div>
    </section>
  );
}
