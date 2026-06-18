"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { createPelatihan, updatePelatihan } from "../actions";

interface FormData {
  judul: string;
  deskripsi: string;
  kategori: string;
  tipe_kursus: "online" | "offline" | "hybrid";
  harga: number;
  maksimal_peserta: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  thumbnail_url: string;
  status: "draft" | "published";
}

const initialFormData: FormData = {
  judul: "",
  deskripsi: "",
  kategori: "",
  tipe_kursus: "online",
  harga: 0,
  maksimal_peserta: 0,
  tanggal_mulai: "",
  tanggal_selesai: "",
  thumbnail_url: "",
  status: "draft",
};

interface TambahPelatihanFormProps {
  mode?: "create" | "edit";
  courseId?: string;
  initialData?: FormData;
}

export default function TambahPelatihanForm({ mode = "create", courseId, initialData }: TambahPelatihanFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "harga" || name === "maksimal_peserta" ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.judul.trim()) newErrors.judul = "Judul pelatihan harus diisi";
    if (!formData.deskripsi.trim()) newErrors.deskripsi = "Deskripsi harus diisi";
    if (!formData.kategori.trim()) newErrors.kategori = "Kategori harus diisi";
    if (formData.harga < 0) newErrors.harga = "Harga tidak boleh negatif";
    if (formData.maksimal_peserta <= 0) newErrors.maksimal_peserta = "Maksimal peserta harus lebih dari 0";
    if (!formData.tanggal_mulai) newErrors.tanggal_mulai = "Tanggal mulai harus diisi";
    if (!formData.tanggal_selesai) newErrors.tanggal_selesai = "Tanggal selesai harus diisi";

    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      if (new Date(formData.tanggal_selesai) <= new Date(formData.tanggal_mulai)) {
        newErrors.tanggal_selesai = "Tanggal selesai harus setelah tanggal mulai";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = mode === "edit" && courseId ? await updatePelatihan(courseId, formData) : await createPelatihan(formData);

      if (result.success) {
        router.push("/pelatihan-admin");
        router.refresh();
      } else {
        setErrors({ submit: result.error || "Terjadi kesalahan saat menyimpan data" });
      }
    } catch (error) {
      setErrors({ submit: "Terjadi kesalahan yang tidak terduga" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollReveal>
      <div className="bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-navy border-b border-navy/10 pb-3">Informasi Dasar</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Judul Pelatihan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.judul ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                  placeholder="Contoh: Pelatihan Keamanan Siber"
                />
                {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.kategori ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                  placeholder="Contoh: Teknologi, Keamanan, Manajemen"
                />
                {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 resize-none ${errors.deskripsi ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                placeholder="Jelaskan secara detail tentang pelatihan ini..."
              />
              {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">URL Gambar Thumbnail</label>
              <input
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-silver/30 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>

          </div>

          {/* Configuration */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-navy border-b border-navy/10 pb-3">Konfigurasi Pelatihan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tipe Kursus */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Tipe Pelatihan <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipe_kursus"
                  value={formData.tipe_kursus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-silver/30 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Harga */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Harga (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.harga ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                  placeholder="500000"
                />
                {errors.harga && <p className="text-red-500 text-sm mt-1">{errors.harga}</p>}
                <p className="text-xs text-silver mt-1">Masukkan 0 untuk pelatihan gratis</p>
              </div>

              {/* Maksimal Peserta */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Maksimal Peserta <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maksimal_peserta"
                  value={formData.maksimal_peserta}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.maksimal_peserta ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                  placeholder="25"
                />
                {errors.maksimal_peserta && <p className="text-red-500 text-sm mt-1">{errors.maksimal_peserta}</p>}
              </div>

              {/* Tanggal Mulai */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_mulai"
                  value={formData.tanggal_mulai}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.tanggal_mulai ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                />
                {errors.tanggal_mulai && <p className="text-red-500 text-sm mt-1">{errors.tanggal_mulai}</p>}
              </div>

              {/* Tanggal Selesai */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_selesai"
                  value={formData.tanggal_selesai}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.tanggal_selesai ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                />
                {errors.tanggal_selesai && <p className="text-red-500 text-sm mt-1">{errors.tanggal_selesai}</p>}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-navy border-b border-navy/10 pb-3">Status Publikasi</h3>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full max-w-xs px-4 py-3 border border-silver/30 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <p className="text-xs text-silver mt-1">Draft: Hanya dapat dilihat oleh admin. Published: Dapat dilihat oleh semua pengguna.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-navy/10">
            <button type="button" onClick={handleCancel} className="px-6 py-3 text-navy border border-navy/20 hover:border-navy/30 rounded-lg hover:bg-navy/5 transition-all duration-300 font-medium" disabled={loading}>
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {mode === "edit" ? "Simpan Perubahan" : "Simpan Pelatihan"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ScrollReveal>
  );
}
