

import Link from "next/link";
import type { PostWithAuthor } from "../page";

// Helper dari FeaturedPost (bisa dipindah ke file 'utils' nanti)
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Segera";
  return new Date(dateString).toLocaleDateString("id-ID", { month: 'long', day: 'numeric' });
};
const calculateReadTime = (content: string | null) => {
  if (!content) return "1 min";
  const wordsPerMinute = 200;
  const textLength = content.split(" ").length;
  const readTime = Math.ceil(textLength / wordsPerMinute);
  return `${readTime} min`;
};

export default function ArticleCard({ post }: { post: PostWithAuthor }) {
  const category = post.tags && post.tags.length > 0 ? post.tags[0] : "Umum";
  const authorName = post.profil_pengguna?.nama_lengkap || "Penulis";

  return (
    <article className="bg-white border border-silver/20 rounded-lg overflow-hidden hover-lift hover-glow transition-all duration-300">
      <img src={post.gambar_utama_url || 'https://placehold.co/600x400'} alt={post.judul} className="w-full h-48 object-cover" />

      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <span className="bg-gold/10 text-gold px-2 py-1 rounded text-xs font-medium">{category}</span>
          <span className="text-silver text-xs">{calculateReadTime(post.konten)} read</span>
        </div>

        <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2 text-balance">{post.judul}</h3>
        <p className="text-silver text-sm mb-4 line-clamp-3 text-pretty">{post.ringkasan}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar placeholder */}
            <div className="w-8 h-8 bg-gradient-to-br from-gold/20 to-silver/20 rounded-full flex items-center justify-center">...</div>
            <div>
              <div className="text-xs font-medium text-navy">{authorName}</div>
              <div className="text-xs text-silver">{formatDate(post.dipublikasi_pada)}</div>
            </div>
          </div>
          <Link href={`/blog/${post.slug}`} className="text-gold hover:text-gold/80 font-medium text-sm transition-colors">
            Baca →
          </Link>
        </div>
      </div>
    </article>
  );
}