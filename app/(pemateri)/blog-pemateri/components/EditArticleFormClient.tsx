"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScrollReveal from "../../../components/ui/ScrollReveal";
import { updateArtikel } from "../actions";

interface EditArticleFormClientProps {
  userId: string;
  articleId: string;
  initialData: {
    judul: string;
    ringkasan: string;
    konten: string;
    tags: string[];
    gambar_utama_url: string;
    status: string;
  };
}

export default function EditArticleFormClient({ userId, articleId, initialData }: EditArticleFormClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    judul: initialData.judul,
    ringkasan: initialData.ringkasan,
    konten: initialData.konten,
    tags: initialData.tags.join(", "),
    gambar_utama_url: initialData.gambar_utama_url,
    status: initialData.status,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: "draft", label: "Simpan sebagai Draft", color: "bg-yellow-500 hover:bg-yellow-600" },
    { value: "review", label: "Kirim untuk Review", color: "bg-blue-500 hover:bg-blue-600" },
    { value: "published", label: "Publikasikan", color: "bg-green-500 hover:bg-green-600" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.judul.trim()) {
      newErrors.judul = "Judul artikel wajib diisi";
    } else if (formData.judul.length < 10) {
      newErrors.judul = "Judul artikel minimal 10 karakter";
    } else if (formData.judul.length > 200) {
      newErrors.judul = "Judul artikel maksimal 200 karakter";
    }

    if (!formData.ringkasan.trim()) {
      newErrors.ringkasan = "Ringkasan artikel wajib diisi";
    } else if (formData.ringkasan.length < 50) {
      newErrors.ringkasan = "Ringkasan artikel minimal 50 karakter";
    } else if (formData.ringkasan.length > 500) {
      newErrors.ringkasan = "Ringkasan artikel maksimal 500 karakter";
    }

    if (!formData.konten.trim()) {
      newErrors.konten = "Konten artikel wajib diisi";
    } else if (formData.konten.length < 100) {
      newErrors.konten = "Konten artikel minimal 100 karakter";
    }

    if (formData.gambar_utama_url && !isValidUrl(formData.gambar_utama_url)) {
      newErrors.gambar_utama_url = "URL gambar tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (status: string) => {
    if (isSubmitting) return;

    const updatedFormData = { ...formData, status };

    if (!validateForm()) {
      alert("Mohon periksa form dan perbaiki kesalahan yang ada");
      return;
    }

    setIsSubmitting(true);

    try {
      // Process tags
      const tagsArray = updatedFormData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags

      // Generate slug from title
      const generateSlug = (title: string): string => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-") // Remove multiple consecutive hyphens
          .trim()
          .substring(0, 100); // Limit length
      };

      // Update artikel data
      const artikelData = {
        judul: updatedFormData.judul.trim(),
        slug: generateSlug(updatedFormData.judul.trim()),
        ringkasan: updatedFormData.ringkasan.trim(),
        konten: updatedFormData.konten.trim(),
        tags: tagsArray,
        gambar_utama_url: updatedFormData.gambar_utama_url.trim() || undefined,
        status: status as "draft" | "review" | "published",
      };

      const result = await updateArtikel(userId, articleId, artikelData);

      if (result.success) {
        alert(`Artikel berhasil ${status === "published" ? "dipublikasikan" : status === "review" ? "dikirim untuk review" : "disimpan sebagai draft"}!`);
        router.push("/blog-pemateri");
      } else {
        alert(result.error || "Terjadi kesalahan saat menyimpan artikel");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (!formData.judul && !formData.konten) return;

    const timeoutId = setTimeout(() => {
      // Auto-save logic could be implemented here
      console.log("Auto-saving...");
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const getCharacterCount = (text: string, max: number) => {
    const remaining = max - text.length;
    const color = remaining < 50 ? "text-red-500" : remaining < 100 ? "text-yellow-500" : "text-gray-500";
    return (
      <span className={`text-sm ${color}`}>
        {text.length}/{max} karakter
      </span>
    );
  };

  return (
    <ScrollReveal>
      <div className="bg-white rounded-xl shadow-lg border border-navy/10 overflow-hidden">
        <div className="p-8">
          <form className="space-y-8">
            {/* Judul */}
            <div>
              <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                Judul Artikel *
              </label>
              <input
                type="text"
                id="judul"
                value={formData.judul}
                onChange={(e) => handleInputChange("judul", e.target.value)}
                placeholder="Masukkan judul artikel yang menarik..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200 ${errors.judul ? "border-red-500" : "border-gray-300"}`}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.judul && <span className="text-sm text-red-500">{errors.judul}</span>}
                <div className="ml-auto">{getCharacterCount(formData.judul, 200)}</div>
              </div>
            </div>

            {/* Ringkasan */}
            <div>
              <label htmlFor="ringkasan" className="block text-sm font-medium text-gray-700 mb-2">
                Ringkasan Artikel *
              </label>
              <textarea
                id="ringkasan"
                value={formData.ringkasan}
                onChange={(e) => handleInputChange("ringkasan", e.target.value)}
                placeholder="Tulis ringkasan singkat tentang artikel ini..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200 resize-none ${errors.ringkasan ? "border-red-500" : "border-gray-300"}`}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.ringkasan && <span className="text-sm text-red-500">{errors.ringkasan}</span>}
                <div className="ml-auto">{getCharacterCount(formData.ringkasan, 500)}</div>
              </div>
            </div>

            {/* Konten */}
            <div>
              <label htmlFor="konten" className="block text-sm font-medium text-gray-700 mb-2">
                Konten Artikel *
              </label>
              <textarea
                id="konten"
                value={formData.konten}
                onChange={(e) => handleInputChange("konten", e.target.value)}
                placeholder="Tulis konten artikel lengkap di sini...

Tips:
- Gunakan paragraf yang terstruktur
- Sertakan contoh konkret
- Tambahkan poin-poin penting
- Gunakan bahasa yang mudah dipahami"
                rows={20}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200 resize-y ${errors.konten ? "border-red-500" : "border-gray-300"}`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.konten && <span className="text-sm text-red-500">{errors.konten}</span>}
                <div className="ml-auto">
                  <span className="text-sm text-gray-500">{formData.konten.length} karakter</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Opsional)
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="Contoh: teknologi, tutorial, tips, pemrograman (pisahkan dengan koma)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200"
              />
              <p className="text-sm text-gray-500 mt-2">Pisahkan tags dengan koma. Maksimal 10 tags. Tags membantu pembaca menemukan artikel Anda.</p>
            </div>

            {/* Gambar Utama URL */}
            <div>
              <label htmlFor="gambar_utama_url" className="block text-sm font-medium text-gray-700 mb-2">
                URL Gambar Utama (Opsional)
              </label>
              <input
                type="url"
                id="gambar_utama_url"
                value={formData.gambar_utama_url}
                onChange={(e) => handleInputChange("gambar_utama_url", e.target.value)}
                placeholder="https://example.com/gambar.jpg"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-200 ${errors.gambar_utama_url ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.gambar_utama_url && <span className="text-sm text-red-500 mt-2 block">{errors.gambar_utama_url}</span>}
              <p className="text-sm text-gray-500 mt-2">Gambar utama akan ditampilkan sebagai thumbnail artikel. Gunakan URL gambar yang valid.</p>
            </div>

            {/* Preview Gambar */}
            {formData.gambar_utama_url && isValidUrl(formData.gambar_utama_url) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview Gambar</label>
                <div className="relative w-full max-w-md h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={formData.gambar_utama_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSubmit(option.value)}
                    disabled={isSubmitting}
                    className={`px-6 py-3 ${option.color} text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      option.label
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </ScrollReveal>
  );
}
