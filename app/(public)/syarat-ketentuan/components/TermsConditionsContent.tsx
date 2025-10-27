"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const termsSections = [
  {
    id: "penerimaan-ketentuan",
    title: "Penerimaan Ketentuan",
    content: [
      "Dengan mengakses dan menggunakan layanan PT. CertiGuardia Solusi, Anda setuju untuk terikat dengan syarat dan ketentuan yang ditetapkan dalam dokumen ini.",
      "Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan layanan kami.",
      "Kami berhak untuk mengubah ketentuan ini kapan saja dengan pemberitahuan yang wajar kepada pengguna.",
    ],
  },
  {
    id: "layanan-pelatihan",
    title: "Layanan Pelatihan",
    content: [
      "PT. CertiGuardia Solusi menyediakan layanan pelatihan profesional dan sertifikasi kompetensi sesuai dengan standar industri.",
      "Semua materi pelatihan adalah hak kekayaan intelektual PT. CertiGuardia Solusi dan tidak boleh disebarluaskan tanpa izin tertulis.",
      "Peserta wajib mengikuti seluruh sesi pelatihan yang telah dijadwalkan untuk mendapatkan sertifikat.",
    ],
  },
  {
    id: "kewajiban-peserta",
    title: "Kewajiban Peserta",
    content: [
      "Peserta wajib memberikan informasi yang akurat dan lengkap saat mendaftar program pelatihan.",
      "Peserta bertanggung jawab untuk menjaga kerahasiaan akun dan password mereka.",
      "Peserta diharapkan berpartisipasi aktif dalam seluruh kegiatan pelatihan dan menghormati peserta lain serta instruktur.",
    ],
  },
  {
    id: "pembayaran-refund",
    title: "Pembayaran dan Refund",
    content: [
      "Pembayaran program pelatihan harus dilakukan sesuai dengan ketentuan yang telah ditetapkan sebelum pelatihan dimulai.",
      "Permintaan refund dapat diajukan maksimal 7 hari sebelum pelatihan dimulai dengan potongan biaya administrasi 10%.",
      "Tidak ada refund untuk pembatalan yang dilakukan kurang dari 7 hari sebelum pelatihan atau setelah pelatihan dimulai.",
    ],
  },
  {
    id: "sertifikasi",
    title: "Sertifikasi",
    content: [
      "Sertifikat akan diberikan kepada peserta yang telah menyelesaikan seluruh program pelatihan dan lulus ujian kompetensi.",
      "Sertifikat yang diterbitkan adalah resmi dan diakui oleh industri sesuai dengan standar yang berlaku.",
      "PT. CertiGuardia Solusi berhak menolak penerbitan sertifikat jika peserta tidak memenuhi persyaratan yang ditetapkan.",
    ],
  },
  {
    id: "batasan-tanggung-jawab",
    title: "Batasan Tanggung Jawab",
    content: [
      "PT. CertiGuardia Solusi tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang mungkin timbul dari penggunaan layanan kami.",
      "Kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan atau bebas dari kesalahan teknis.",
      "Tanggung jawab kami terbatas pada nilai yang telah dibayarkan oleh peserta untuk program pelatihan yang bersangkutan.",
    ],
  },
  {
    id: "kekayaan-intelektual",
    title: "Hak Kekayaan Intelektual",
    content: [
      "Semua konten, materi pelatihan, dan teknologi yang digunakan dalam platform kami adalah hak milik PT. CertiGuardia Solusi.",
      "Peserta dilarang menyalin, mendistribusikan, atau menggunakan materi pelatihan untuk kepentingan komersial tanpa izin tertulis.",
      "Pelanggaran hak kekayaan intelektual dapat mengakibatkan tindakan hukum sesuai dengan peraturan yang berlaku.",
    ],
  },
];

export default function TermsConditionsContent() {
  return (
    <section id="content" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Ketentuan Umum</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Syarat dan Ketentuan ini mengatur penggunaan layanan pelatihan dan platform yang disediakan oleh PT. CertiGuardia Solusi. Dokumen ini merupakan perjanjian hukum antara Anda sebagai pengguna dengan PT. CertiGuardia Solusi
                sebagai penyedia layanan.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          {termsSections.map((section, index) => (
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
            <h3 className="text-xl font-bold text-navy mb-4 flex items-center">
              <svg className="w-6 h-6 text-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Penting untuk Diketahui
            </h3>
            <p className="text-gray-600 mb-4">Dengan mendaftar dan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum dalam dokumen ini.</p>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Kontak untuk Pertanyaan:</strong>
              </p>
              <p>
                <strong>Email:</strong> legal@certiguardia.com
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
