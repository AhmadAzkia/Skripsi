"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const privacySections = [
  {
    id: "pengumpulan-data",
    title: "Pengumpulan Informasi",
    content: [
      "Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami ketika mendaftar akun, mengikuti pelatihan, atau berkomunikasi dengan kami.",
      "Informasi yang kami kumpulkan meliputi nama, alamat email, nomor telepon, informasi pendidikan, dan data lain yang relevan dengan layanan pelatihan kami.",
      "Kami juga dapat mengumpulkan informasi secara otomatis ketika Anda menggunakan platform kami, seperti alamat IP, jenis perangkat, dan aktivitas browsing.",
    ],
  },
  {
    id: "penggunaan-data",
    title: "Penggunaan Informasi",
    content: [
      "Kami menggunakan informasi yang dikumpulkan untuk menyediakan, memelihara, dan meningkatkan layanan pelatihan kami.",
      "Informasi digunakan untuk berkomunikasi dengan Anda mengenai pelatihan, sertifikasi, dan pembaruan penting lainnya.",
      "Data juga digunakan untuk analisis dan peningkatan kualitas platform serta pengalaman pengguna.",
    ],
  },
  {
    id: "berbagi-data",
    title: "Berbagi Informasi",
    content: [
      "Kami tidak menjual, menyewakan, atau memberikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.",
      "Informasi hanya dibagikan dengan partner resmi untuk keperluan penerbitan sertifikat yang sah dan diakui.",
      "Dalam situasi tertentu, kami dapat membagikan informasi jika diwajibkan oleh hukum atau untuk melindungi hak dan keamanan.",
    ],
  },
  {
    id: "keamanan-data",
    title: "Keamanan Informasi",
    content: [
      "Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi informasi pribadi Anda.",
      "Data disimpan dalam server yang aman dengan enkripsi dan akses yang terbatas hanya untuk personel yang berwenang.",
      "Kami secara rutin meninjau dan memperbarui prosedur keamanan untuk memastikan perlindungan data yang optimal.",
    ],
  },
  {
    id: "hak-pengguna",
    title: "Hak Anda",
    content: [
      "Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi yang kami simpan tentang Anda.",
      "Anda dapat meminta salinan data pribadi Anda atau membatasi pemrosesan informasi tertentu.",
      "Untuk menggunakan hak-hak tersebut, silakan hubungi kami melalui kontak yang tersedia di website ini.",
    ],
  },
  {
    id: "cookies",
    title: "Penggunaan Cookies",
    content: [
      "Website kami menggunakan cookies untuk meningkatkan pengalaman browsing dan menyediakan fitur yang dipersonalisasi.",
      "Cookies membantu kami memahami bagaimana Anda menggunakan website dan memungkinkan fitur seperti 'ingat saya' saat login.",
      "Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur website mungkin tidak berfungsi dengan optimal.",
    ],
  },
];

export default function PrivacyPolicyContent() {
  return (
    <section id="content" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Pendahuluan</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                PT. CertiGuardia Solusi berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi yang Anda berikan ketika
                menggunakan layanan pelatihan dan platform kami.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          {privacySections.map((section, index) => (
            <ScrollReveal key={section.id} delay={100 * (index + 1)}>
              <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl md:text-2xl font-bold text-navy mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gold font-bold text-sm">{index + 1}</span>
                  </div>
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="mt-16 p-8 bg-linear-to-br from-gold/5 to-gold/10 rounded-xl border border-gold/20">
            <h3 className="text-xl font-bold text-navy mb-4">Kontak</h3>
            <p className="text-gray-600 mb-4">Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak-hak Anda terkait data pribadi, silakan hubungi kami:</p>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong> privacy@certiguardia.com
              </p>
              <p>
                <strong>Telepon:</strong> (021) 1234-5678
              </p>
              <p>
                <strong>Alamat:</strong> Jakarta, Indonesia
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
