import ScrollReveal from "@/app/components/ui/ScrollReveal";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - PT. CertiGuardia Solusi",
  description: "Baca artikel terbaru tentang tips karir, tren industri, dan panduan pengembangan profesional dari PT. CertiGuardia Solusi.",
};

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: "Panduan Lengkap Mempersiapkan Sertifikasi PMP untuk Project Manager",
    excerpt: "Pelajari strategi dan tips praktis untuk lulus ujian PMP dengan skor tinggi. Dari materi yang harus dipelajari hingga teknik mengerjakan soal.",
    content: "Project Management Professional (PMP) adalah salah satu sertifikasi paling bergengsi di dunia manajemen proyek. Artikel ini akan membahas langkah-langkah sistematis untuk mempersiapkan ujian PMP...",
    author: "Sarah Wijaya, M.M.",
    authorRole: "Direktur Akademik",
    publishDate: "15 Januari 2024",
    readTime: "8 min",
    category: "Sertifikasi",
    image: "/img/blog-featured.jpg",
    tags: ["PMP", "Project Management", "Sertifikasi", "Karir"],
  };

  const blogPosts = [
    {
      id: 2,
      title: "5 Skill Digital Marketing yang Wajib Dikuasai di Era Modern",
      excerpt: "Dunia digital marketing terus berkembang. Simak 5 skill essential yang harus dimiliki untuk sukses di bidang ini.",
      author: "Ahmad Rizki, M.Kom.",
      authorRole: "Head of Technology",
      publishDate: "12 Januari 2024",
      readTime: "6 min",
      category: "Digital Marketing",
      image: "/img/blog-2.jpg",
      tags: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
    },
    {
      id: 3,
      title: "Cara Meningkatkan Produktivitas Kerja dengan Time Management",
      excerpt: "Tips dan trik praktis untuk mengelola waktu lebih efektif dan meningkatkan produktivitas di tempat kerja.",
      author: "Maya Sari, S.Psi.",
      authorRole: "Head of HR & Development",
      publishDate: "10 Januari 2024",
      readTime: "5 min",
      category: "Produktivitas",
      image: "/img/blog-3.jpg",
      tags: ["Produktivitas", "Time Management", "Work-Life Balance"],
    },
    {
      id: 4,
      title: "Tren Teknologi 2024: Apa yang Perlu Dipersiapkan Profesional IT?",
      excerpt: "Eksplorasi teknologi emerging yang akan mendominasi tahun 2024 dan bagaimana mempersiapkan diri.",
      author: "Ahmad Rizki, M.Kom.",
      authorRole: "Head of Technology",
      publishDate: "8 Januari 2024",
      readTime: "7 min",
      category: "Teknologi",
      image: "/img/blog-4.jpg",
      tags: ["AI", "Cloud Computing", "Cybersecurity", "IoT"],
    },
    {
      id: 5,
      title: "Membangun Personal Branding untuk Meningkatkan Karir",
      excerpt: "Strategi membangun personal branding yang kuat untuk membedakan diri di pasar kerja yang kompetitif.",
      author: "Maya Sari, S.Psi.",
      authorRole: "Head of HR & Development",
      publishDate: "5 Januari 2024",
      readTime: "6 min",
      category: "Karir",
      image: "/img/blog-5.jpg",
      tags: ["Personal Branding", "Career Development", "LinkedIn", "Networking"],
    },
    {
      id: 6,
      title: "Pentingnya Data Analytics dalam Pengambilan Keputusan Bisnis",
      excerpt: "Bagaimana data analytics dapat membantu perusahaan membuat keputusan yang lebih tepat dan berbasis fakta.",
      author: "Dr. Bambang Setiawan",
      authorRole: "Direktur Utama",
      publishDate: "3 Januari 2024",
      readTime: "8 min",
      category: "Data Analytics",
      image: "/img/blog-6.jpg",
      tags: ["Data Analytics", "Business Intelligence", "Decision Making"],
    },
    {
      id: 7,
      title: "Soft Skills vs Hard Skills: Mana yang Lebih Penting?",
      excerpt: "Analisis mendalam tentang keseimbangan antara soft skills dan hard skills dalam dunia kerja modern.",
      author: "Sarah Wijaya, M.M.",
      authorRole: "Direktur Akademik",
      publishDate: "1 Januari 2024",
      readTime: "5 min",
      category: "Pengembangan",
      image: "/img/blog-7.jpg",
      tags: ["Soft Skills", "Hard Skills", "Career Development", "Leadership"],
    },
  ];

  const categories = [
    { name: "Semua", count: 7, active: true },
    { name: "Sertifikasi", count: 2, active: false },
    { name: "Digital Marketing", count: 1, active: false },
    { name: "Teknologi", count: 1, active: false },
    { name: "Karir", count: 2, active: false },
    { name: "Produktivitas", count: 1, active: false },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-navy py-16 md:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white-text mb-6 text-balance">
                Blog & <span className="text-gold">Artikel</span>
              </h1>
              <p className="text-xl md:text-2xl text-silver mb-8 max-w-4xl mx-auto text-pretty">Temukan wawasan terbaru tentang pengembangan karir, tips profesional, dan tren industri yang akan membantu meningkatkan kompetensi Anda.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-8">
              <span className="bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium">Artikel Pilihan</span>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-navy/20 to-gold/20 flex items-center justify-center">
                  <svg className="w-24 h-24 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                  </svg>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium">{featuredPost.category}</span>
                  <span className="text-silver text-sm">{featuredPost.readTime} read</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 text-balance">{featuredPost.title}</h2>
                <p className="text-silver mb-6 text-pretty">{featuredPost.excerpt}</p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-silver/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-navy">{featuredPost.author}</div>
                    <div className="text-sm text-silver">{featuredPost.authorRole}</div>
                  </div>
                  <div className="text-silver text-sm">{featuredPost.publishDate}</div>
                </div>
                <Link href={`/blog/${featuredPost.id}`} className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-6 py-3 rounded-md font-semibold transition-all duration-300 inline-flex items-center">
                  Baca Selengkapnya
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category, index) => (
                <button key={index} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${category.active ? "bg-gold text-navy" : "bg-white text-silver hover:bg-gold/10 hover:text-gold"}`}>
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Artikel <span className="text-gold">Terbaru</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 100}>
                <article className="bg-white border border-silver/20 rounded-lg overflow-hidden hover-lift hover-glow transition-all duration-300">
                  <div className="relative h-48 bg-gradient-to-br from-navy/10 to-gold/10 flex items-center justify-center">
                    <svg className="w-16 h-16 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="bg-gold/10 text-gold px-2 py-1 rounded text-xs font-medium">{post.category}</span>
                      <span className="text-silver text-xs">{post.readTime} read</span>
                    </div>

                    <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2 text-balance">{post.title}</h3>

                    <p className="text-silver text-sm mb-4 line-clamp-3 text-pretty">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-gold/20 to-silver/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-navy">{post.author}</div>
                          <div className="text-xs text-silver">{post.publishDate}</div>
                        </div>
                      </div>

                      <Link href={`/blog/${post.id}`} className="text-gold hover:text-gold/80 font-medium text-sm transition-colors">
                        Baca →
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Dapatkan <span className="text-gold">Update Terbaru</span>
              </h2>
              <p className="text-lg text-silver mb-8">Berlangganan newsletter kami untuk mendapatkan artikel terbaru, tips karir, dan informasi pelatihan langsung di inbox Anda.</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Masukkan email Anda" className="flex-1 px-4 py-3 border border-silver/30 rounded-md focus:outline-none focus:border-gold" />
                <button className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-6 py-3 rounded-md font-semibold transition-all duration-300">Berlangganan</button>
              </div>
              <p className="text-xs text-silver mt-4">Kami menghormati privasi Anda. Batal berlangganan kapan saja.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy mb-4">
                Tag <span className="text-gold">Populer</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {[
                "PMP",
                "Digital Marketing",
                "SEO",
                "Project Management",
                "Data Analytics",
                "Personal Branding",
                "Time Management",
                "Cybersecurity",
                "AI",
                "Career Development",
                "Leadership",
                "Soft Skills",
                "Hard Skills",
                "Productivity",
                "Cloud Computing",
                "IoT",
                "Business Intelligence",
              ].map((tag, index) => (
                <Link key={index} href={`/blog/tag/${tag.toLowerCase().replace(" ", "-")}`} className="bg-gray-100 hover:bg-gold/10 text-silver hover:text-gold px-3 py-2 rounded-full text-sm transition-all duration-300">
                  #{tag}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white-text mb-4">
                Siap Mengembangkan <span className="text-gold">Karir Anda?</span>
              </h2>
              <p className="text-lg text-silver mb-8 max-w-2xl mx-auto">Jangan hanya baca artikel, ambil langkah nyata! Daftar pelatihan profesional kami dan raih sertifikasi yang diakui industri.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jadwal-pelatihan" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-8 py-3 rounded-md text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center">
                  Lihat Pelatihan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
                <Link
                  href="/konsultasi"
                  className="border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive px-8 py-3 rounded-md text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                >
                  Konsultasi Gratis
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
