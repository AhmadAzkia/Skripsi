"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMateri } from "../../../actions";

interface MateriData {
  id: string;
  judul: string;
  deskripsi: string | null;
  tipe_materi: "pdf" | "ppt" | "video" | "zoom_recording";
  file_url: string | null;
  urutan: number | null;
  is_gratis: boolean | null;
  ukuran_file: number | null;
  kursus_id: string;
}

interface Props {
  kursusId: string;
  materi: MateriData;
}

const tipeMateriOptions = [
  { value: "pdf", label: "PDF Document" },
  { value: "ppt", label: "PowerPoint" },
  { value: "video", label: "Video File" },
  { value: "zoom_recording", label: "Zoom Recording" },
];

export default function EditMateriFormComponent({ kursusId, materi }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    judul: materi.judul || "",
    deskripsi: materi.deskripsi || "",
    tipe_materi: materi.tipe_materi || "pdf",
    file_url: materi.file_url || "",
    urutan: materi.urutan?.toString() || "",
    is_gratis: materi.is_gratis || false,
    ukuran_file: materi.ukuran_file?.toString() || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data
      const updateData = {
        judul: formData.judul,
        deskripsi: formData.deskripsi || undefined,
        tipe_materi: formData.tipe_materi,
        file_url: formData.file_url || undefined,
        urutan: formData.urutan ? parseInt(formData.urutan) : undefined,
        is_gratis: formData.is_gratis,
        ukuran_file: formData.ukuran_file ? parseInt(formData.ukuran_file) : undefined,
      };

      const result = await updateMateri(materi.id, updateData);

      if (result.success) {
        setSuccess(result.message || "Materi berhasil diperbarui");
        // Redirect after short delay
        setTimeout(() => {
          router.push(`/pelatihan-pemateri/${kursusId}/materi`);
        }, 1500);
      } else {
        setError(result.error || "Gagal memperbarui materi");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/pelatihan-pemateri/${kursusId}/materi`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {/* Success Message */}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">{success}</div>}

      {/* Judul */}
      <div>
        <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
          Judul Materi <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="judul"
          name="judul"
          required
          value={formData.judul}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="Masukkan judul materi"
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={4}
          value={formData.deskripsi}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="Masukkan deskripsi materi (opsional)"
        />
      </div>

      {/* Tipe Materi */}
      <div>
        <label htmlFor="tipe_materi" className="block text-sm font-medium text-gray-700 mb-2">
          Tipe Materi <span className="text-red-500">*</span>
        </label>
        <select
          id="tipe_materi"
          name="tipe_materi"
          required
          value={formData.tipe_materi}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
        >
          {tipeMateriOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* File URL */}
      <div>
        <label htmlFor="file_url" className="block text-sm font-medium text-gray-700 mb-2">
          URL File
        </label>
        <input
          type="url"
          id="file_url"
          name="file_url"
          value={formData.file_url}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="https://example.com/file.pdf"
        />
        <p className="text-sm text-gray-500 mt-1">Link ke file materi (Google Drive, Dropbox, atau hosting lainnya)</p>
      </div>

      {/* Row for Urutan and Ukuran File */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urutan */}
        <div>
          <label htmlFor="urutan" className="block text-sm font-medium text-gray-700 mb-2">
            Urutan
          </label>
          <input
            type="number"
            id="urutan"
            name="urutan"
            min="1"
            value={formData.urutan}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="1"
          />
          <p className="text-sm text-gray-500 mt-1">Urutan tampil materi dalam kursus</p>
        </div>

        {/* Ukuran File */}
        <div>
          <label htmlFor="ukuran_file" className="block text-sm font-medium text-gray-700 mb-2">
            Ukuran File (KB)
          </label>
          <input
            type="number"
            id="ukuran_file"
            name="ukuran_file"
            min="1"
            value={formData.ukuran_file}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="1024"
          />
          <p className="text-sm text-gray-500 mt-1">Ukuran file dalam kilobytes</p>
        </div>
      </div>

      {/* Is Gratis */}
      <div className="flex items-center">
        <input type="checkbox" id="is_gratis" name="is_gratis" checked={formData.is_gratis} onChange={handleInputChange} className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded" />
        <label htmlFor="is_gratis" className="ml-2 block text-sm text-gray-700">
          Materi gratis (dapat diakses tanpa membeli kursus)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <button type="submit" disabled={isLoading} className="flex-1 bg-navy hover:bg-navy/90 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Menyimpan..." : "Update Materi"}
        </button>
        <button type="button" onClick={handleCancel} disabled={isLoading} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Batal
        </button>
      </div>
    </form>
  );
}
