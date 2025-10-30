"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMateri } from "../../../actions";

interface MateriData {
  id: string;
  judul: string;
  deskripsi: string | null;
  tipe_materi: "pdf" | "ppt";
  file_url: string | null;
  zoom_link?: string | null;
  urutan: number | null;
  kursus_id: string;
}

interface Props {
  kursusId: string;
  materi: MateriData;
}

const tipeMateriOptions = [
  { value: "pdf", label: "PDF Document" },
  { value: "ppt", label: "PowerPoint" },
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
    zoom_link: materi.zoom_link || "",
    urutan: materi.urutan?.toString() || "",
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
        zoom_link: formData.zoom_link || undefined,
        urutan: formData.urutan ? parseInt(formData.urutan) : undefined,
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
          URL File Materi
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

      {/* Zoom Link */}
      <div>
        <label htmlFor="zoom_link" className="block text-sm font-medium text-gray-700 mb-2">
          Link Zoom Meeting (Opsional)
        </label>
        <input
          type="url"
          id="zoom_link"
          name="zoom_link"
          value={formData.zoom_link}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="https://zoom.us/j/123456789"
        />
        <p className="text-sm text-gray-500 mt-1">Link untuk meeting Zoom terkait materi ini</p>
      </div>

      {/* Row for Urutan */}
      <div>
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
