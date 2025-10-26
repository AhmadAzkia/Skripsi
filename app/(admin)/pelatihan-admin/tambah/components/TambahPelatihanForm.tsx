"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { createPelatihan, getInstruktur } from "../actions";

interface FormData {
  judul: string;
  deskripsi: string;
  kategori: string;
  tipe_kursus: "online" | "offline" | "hybrid";
  durasi_jam: number;
  harga: number;
  maksimal_peserta: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  thumbnail_url: string;
  status: "draft" | "published";
  instruktur_id: string;
}

interface Instruktur {
  id: string;
  nama_lengkap: string;
  email: string;
  foto_profil_url: string | null;
}

const initialFormData: FormData = {
  judul: "",
  deskripsi: "",
  kategori: "",
  tipe_kursus: "online",
  durasi_jam: 0,
  harga: 0,
  maksimal_peserta: 0,
  tanggal_mulai: "",
  tanggal_selesai: "",
  thumbnail_url: "",
  status: "draft",
  instruktur_id: "",
};

export default function TambahPelatihanForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [instrukturList, setInstrukturList] = useState<Instruktur[]>([]);
  const [loadingInstruktur, setLoadingInstruktur] = useState(true);
  const router = useRouter();

  // Load instruktur data when component mounts
  useEffect(() => {
    async function loadInstruktur() {
      try {
        const result = await getInstruktur();
        if (result.success) {
          setInstrukturList(result.data);
        } else {
          setErrors((prev) => ({ ...prev, instruktur: result.error || "Gagal memuat data instruktur" }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, instruktur: "Terjadi kesalahan saat memuat data instruktur" }));
      } finally {
        setLoadingInstruktur(false);
      }
    }

    loadInstruktur();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "durasi_jam" || name === "harga" || name === "maksimal_peserta" ? Number(value) : value,
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
    if (formData.durasi_jam <= 0) newErrors.durasi_jam = "Durasi harus lebih dari 0 jam";
    if (formData.harga < 0) newErrors.harga = "Harga tidak boleh negatif";
    if (formData.maksimal_peserta <= 0) newErrors.maksimal_peserta = "Maksimal peserta harus lebih dari 0";
    if (!formData.tanggal_mulai) newErrors.tanggal_mulai = "Tanggal mulai harus diisi";
    if (!formData.tanggal_selesai) newErrors.tanggal_selesai = "Tanggal selesai harus diisi";
    if (!formData.instruktur_id) newErrors.instruktur_id = "Instruktur harus dipilih";

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
      const result = await createPelatihan(formData);

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

          {/* Instruktur Loading Error */}
          {errors.instruktur && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-orange-700">{errors.instruktur}</span>
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

            {/* Instruktur Selection */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Pilih Instruktur/Pemateri <span className="text-red-500">*</span>
              </label>
              {loadingInstruktur ? (
                <div className="w-full px-4 py-3 border border-silver/30 rounded-lg bg-gray-50 flex items-center">
                  <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin mr-2"></div>
                  <span className="text-silver">Memuat data instruktur...</span>
                </div>
              ) : instrukturList.length > 0 ? (
                <div className="space-y-2">
                  <select
                    name="instruktur_id"
                    value={formData.instruktur_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.instruktur_id ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                  >
                    <option value="">-- Pilih Instruktur --</option>
                    {instrukturList.map((instruktur) => (
                      <option key={instruktur.id} value={instruktur.id}>
                        {instruktur.nama_lengkap} ({instruktur.email})
                      </option>
                    ))}
                  </select>

                  {/* Selected Instructor Preview */}
                  {formData.instruktur_id && (
                    <div className="mt-3 p-3 bg-navy/5 rounded-lg border border-navy/10">
                      {(() => {
                        const selectedInstruktur = instrukturList.find((i) => i.id === formData.instruktur_id);
                        if (!selectedInstruktur) return null;
                        return (
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {selectedInstruktur.foto_profil_url ? (
                                <img src={selectedInstruktur.foto_profil_url} alt={selectedInstruktur.nama_lengkap} className="w-10 h-10 rounded-full object-cover border-2 border-gold/20" />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-navy to-gold rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">{selectedInstruktur.nama_lengkap.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-navy text-sm">{selectedInstruktur.nama_lengkap}</p>
                              <p className="text-silver text-xs">{selectedInstruktur.email}</p>
                            </div>
                            <div className="flex-1 flex justify-end">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Terpilih
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full px-4 py-3 border border-orange-300 rounded-lg bg-orange-50 flex items-center">
                  <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-orange-700">Tidak ada instruktur yang tersedia</span>
                </div>
              )}
              {errors.instruktur_id && <p className="text-red-500 text-sm mt-1">{errors.instruktur_id}</p>}
              <p className="text-xs text-silver mt-1">Instruktur yang akan mengajar pelatihan ini</p>
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

              {/* Durasi */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Durasi (Jam) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="durasi_jam"
                  value={formData.durasi_jam}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 ${errors.durasi_jam ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                  placeholder="8"
                />
                {errors.durasi_jam && <p className="text-red-500 text-sm mt-1">{errors.durasi_jam}</p>}
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
              className="px-8 py-3 bg-gradient-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Simpan Pelatihan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ScrollReveal>
  );
}
