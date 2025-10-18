"use client";

import { useState, useMemo } from "react";
import type { PostWithAuthor } from "../page";
import ArticleCard from "./ArticleCard";

interface BlogFeedProps {
  initialPosts: PostWithAuthor[];
  categories: string[];
}

export default function BlogFeed({ initialPosts, categories }: BlogFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "semua") return initialPosts;
    return initialPosts.filter((post) => post.tags && post.tags.includes(activeCategory));
  }, [activeCategory, initialPosts]);

  return (
    <>
      {/* Categories Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Tombol "Semua" */}
            <button
              onClick={() => setActiveCategory("semua")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === "semua" ? "bg-gold text-navy" : "bg-white text-silver hover:bg-gold/10 hover:text-gold"}`}
            >
              Semua
            </button>
            {/* Tombol Kategori Dinamis */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category ? "bg-gold text-navy" : "bg-white text-silver hover:bg-gold/10 hover:text-gold"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid Section */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Artikel <span className="text-gold">Terbaru</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && <p className="text-center text-gray-500 mt-8">Tidak ada artikel yang sesuai dengan filter Anda.</p>}
        </div>
      </section>
    </>
  );
}
