"use client";

import { useTransition, useState } from "react";
import { uploadTemplate } from "../actions";
import PdfPreview from "./PdfPreview";
import type { useToast } from "@/components/ui/Toast";

type KoordinatField = {
  x: number;
  y: number;
  fontSize?: number;
  size?: number;
};

type TemplateKoordinat = {
  nama: KoordinatField;
  nomor_sertifikat: KoordinatField;
  tanggal: KoordinatField;
  judul_pelatihan: KoordinatField;
  qr_code: KoordinatField;
};

const defaultKoordinat: TemplateKoordinat = {
  nama: { x: 421, y: 340, fontSize: 30 },
  nomor_sertifikat: { x: 185, y: 95, fontSize: 11 },
  tanggal: { x: 185, y: 75, fontSize: 11 },
  judul_pelatihan: { x: 421, y: 250, fontSize: 21 },
  qr_code: { x: 710, y: 108, size: 82 },
};

type Course = {
  id: string;
  judul: string;
};

export default function TemplateUploadForm({ toast, courses }: { toast: ReturnType<typeof useToast>["toast"]; courses: Course[] }) {
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [koordinat, setKoordinat] = useState<TemplateKoordinat>(defaultKoordinat);
  const [selectedKursusId, setSelectedKursusId] = useState<string>("");

  const updateKoordinat = (field: keyof TemplateKoordinat, key: keyof KoordinatField, value: number) => {
    setKoordinat((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }));
  };

  const handleSubmit = (formData: FormData) => {
    formData.set("koordinat", JSON.stringify(koordinat));
    if (selectedKursusId) {
      formData.set("kursus_id", selectedKursusId);
    }
    startTransition(async () => {
      const result = await uploadTemplate(formData);
      if (result.success) {
        toast.success("Template tersimpan", result.message || "Template berhasil diunggah ke sistem.");
      } else {
        toast.error("Gagal upload", result.error || "Terjadi kesalahan saat mengunggah template.");
      }
      if (result.success) {
        setFile(null);
        setKoordinat(defaultKoordinat);
        setSelectedKursusId("");
      }
    });
  };

  return (
    <form action={handleSubmit} className="bg-white border border-navy/10 rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy">Upload Template Baru</h2>
        <p className="text-sm text-gray-600 mt-1">Upload PDF template dan atur posisi koordinat untuk setiap field.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
            <input name="nama" type="text" required placeholder="Contoh: Template Formal" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Untuk Pelatihan</label>
            <select
              value={selectedKursusId}
              onChange={(e) => setSelectedKursusId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-navy focus:border-navy"
            >
              <option value="">-- Pilih Pelatihan (Opsional) --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.judul}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Pilih pelatihan jika template ini khusus untuk pelatihan tertentu.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File PDF</label>
            <input
              name="template"
              type="file"
              accept="application/pdf,.pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Koordinat Field (dalam PDF points)</label>
            <div className="space-y-2">
              {(["nama", "nomor_sertifikat", "tanggal", "judul_pelatihan", "qr_code"] as const).map((field) => {
                const label = { nama: "Nama", nomor_sertifikat: "Nomor", tanggal: "Tanggal", judul_pelatihan: "Judul", qr_code: "QR" }[field];
                const k = koordinat[field];
                return (
                  <div key={field} className="flex items-center gap-2 text-sm">
                    <span className="w-16 text-gray-600 font-medium">{label}</span>
                    <span className="text-gray-400">X:</span>
                    <input type="number" value={k.x} onChange={(e) => updateKoordinat(field, "x", Number(e.target.value))} className="w-20 border border-gray-300 rounded px-2 py-1 text-xs" />
                    <span className="text-gray-400">Y:</span>
                    <input type="number" value={k.y} onChange={(e) => updateKoordinat(field, "y", Number(e.target.value))} className="w-20 border border-gray-300 rounded px-2 py-1 text-xs" />
                    <span className="text-gray-400">{field === "qr_code" ? "Size:" : "Font:"}</span>
                    <input type="number" value={field === "qr_code" ? k.size : k.fontSize} onChange={(e) => updateKoordinat(field, field === "qr_code" ? "size" : "fontSize", Number(e.target.value))} className="w-16 border border-gray-300 rounded px-2 py-1 text-xs" />
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={pending || !file} className="w-full px-5 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 disabled:opacity-60">
            {pending ? "Mengunggah..." : "Simpan Template"}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
          <PdfPreview file={file} koordinat={koordinat} />
        </div>
      </div>
    </form>
  );
}
