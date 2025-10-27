import Link from "next/link";
import type { PostWithAuthor } from "../page";

// Helper untuk format
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Segera";
  return new Date(dateString).toLocaleDateString("id-ID", { month: "long", day: "numeric", year: "numeric" });
};

// Helper sederhana untuk estimasi waktu baca
const calculateReadTime = (content: string | null) => {
  if (!content) return "1 min";
  const wordsPerMinute = 200;
  const textLength = content.split(" ").length;
  const readTime = Math.ceil(textLength / wordsPerMinute);
  return `${readTime} min`;
};

export default function FeaturedPost({ post }: { post: PostWithAuthor }) {
  const category = post.tags && post.tags.length > 0 ? post.tags[0] : "Umum";
  const readTime = calculateReadTime(post.konten);
  const authorName = post.profil_pengguna?.nama_lengkap || "Penulis CertiGuardia";
  const authorRole = post.profil_pengguna?.peran || "Instruktur";

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium">Artikel Pilihan</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden">
            <img src={post.gambar_utama_url || "https://placehold.co/800x600"} alt={post.judul} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium">{category}</span>
              <span className="text-silver text-sm">{readTime} read</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 text-balance">{post.judul}</h2>
            <p className="text-silver mb-6 text-pretty">{post.ringkasan}</p>
            <div className="flex items-center space-x-4 mb-6">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 bg-linear-to-br from-gold/20 to-silver/20 rounded-full flex items-center justify-center">...</div>
              <div>
                <div className="font-medium text-navy">{authorName}</div>
                <div className="text-sm text-silver">{authorRole}</div>
              </div>
              <div className="text-silver text-sm">{formatDate(post.dipublikasi_pada)}</div>
            </div>
            <Link href={`/blog/${post.slug}`} className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-6 py-3 rounded-md font-semibold ...">
              Baca Selengkapnya
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
