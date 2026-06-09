import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TambahPelatihanForm from "../../tambah/components/TambahPelatihanForm";

type EditPelatihanPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPelatihanPage({ params }: EditPelatihanPageProps) {
  const { id } = await params;
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "admin") {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: kursus, error } = await supabase
    .from("kursus")
    .select("judul, deskripsi, kategori, tipe_kursus, harga, maksimal_peserta, tanggal_mulai, tanggal_selesai, thumbnail_url, status, instruktur_id")
    .eq("id", id)
    .single();

  if (error || !kursus) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-gray-50">
      <ScrollReveal>
        <div className="bg-white border-b border-navy/10 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                  Ubah <span className="text-gold">Data Pelatihan</span>
                </h1>
                <p className="text-silver text-lg max-w-2xl">Perbarui informasi pelatihan, jadwal, harga, kapasitas, dan status publikasi.</p>
              </div>

              <nav className="flex items-center space-x-2 text-sm text-silver">
                <Link href="/pelatihan-admin" className="hover:text-navy transition-colors duration-200">
                  Manajemen Pelatihan
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-navy font-medium">Edit Pelatihan</span>
              </nav>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <TambahPelatihanForm
          mode="edit"
          courseId={id}
          initialData={{
            judul: kursus.judul,
            deskripsi: kursus.deskripsi || "",
            kategori: kursus.kategori,
            tipe_kursus: kursus.tipe_kursus,
            harga: kursus.harga,
            maksimal_peserta: kursus.maksimal_peserta || 1,
            tanggal_mulai: kursus.tanggal_mulai || "",
            tanggal_selesai: kursus.tanggal_selesai || "",
            thumbnail_url: kursus.thumbnail_url || "",
            status: kursus.status === "archived" ? "draft" : kursus.status,
            instruktur_id: kursus.instruktur_id,
          }}
        />
      </div>
    </div>
  );
}
