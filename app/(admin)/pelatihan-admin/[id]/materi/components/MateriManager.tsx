"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ToastContainer, { useToast } from "@/components/ui/Toast";
import { createMateri, updateMateri, deleteMateri, uploadMateriFile } from "../actions";

type MateriData = {
  id: string;
  judul: string;
  deskripsi: string | null;
  tipe_materi: "pdf" | "ppt" | "zoom";
  file_url: string | null;
  zoom_link: string | null;
  urutan: number | null;
  pelatihan_id: string;
};

interface MateriManagerProps {
  pelatihanId: string;
  initialMateriList: MateriData[];
}

const TIPE_MATERI_OPTIONS = [
  { value: "pdf", label: "PDF", icon: "📄" },
  { value: "ppt", label: "PPT", icon: "📊" },
  { value: "zoom", label: "Zoom / Google Meet", icon: "🎥" },
] as const;

type FormState = {
  judul: string;
  deskripsi: string;
  tipe_materi: "pdf" | "ppt" | "zoom";
  zoom_link: string;
  urutan: number;
};

const emptyForm: FormState = {
  judul: "",
  deskripsi: "",
  tipe_materi: "pdf",
  zoom_link: "",
  urutan: 1,
};

const ALLOWED_FILE_EXTENSIONS = ["pdf", "ppt", "pptx"];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

export default function MateriManager({ pelatihanId, initialMateriList }: MateriManagerProps) {
  const [materiList, setMateriList] = useState<MateriData[]>(initialMateriList);
  const [showModal, setShowModal] = useState(false);
  const [editingMateri, setEditingMateri] = useState<MateriData | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { toasts, toast, removeToast } = useToast();

  const resetForm = useCallback(() => {
    setForm(emptyForm);
    setFile(null);
    setErrors({});
    setEditingMateri(null);
  }, []);

  const openAddModal = useCallback(() => {
    resetForm();
    setForm((prev) => ({ ...prev, urutan: materiList.length + 1 }));
    setShowModal(true);
  }, [materiList.length, resetForm]);

  const openEditModal = useCallback(
    (materi: MateriData) => {
      setEditingMateri(materi);
      setForm({
        judul: materi.judul,
        deskripsi: materi.deskripsi || "",
        tipe_materi: materi.tipe_materi,
        zoom_link: materi.zoom_link || "",
        urutan: materi.urutan ?? 1,
      });
      setFile(null);
      setErrors({});
      setShowModal(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    resetForm();
  }, [resetForm]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.judul.trim()) e.judul = "Judul materi harus diisi";
    if (form.tipe_materi === "zoom" && !form.zoom_link.trim()) {
      e.zoom_link = "Link Zoom/Google Meet harus diisi";
    }
    if (form.tipe_materi !== "zoom" && !editingMateri && !file) {
      e.file = "File harus diupload";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let fileUrl = editingMateri?.file_url || undefined;

      // Upload file if new file selected
      if (file) {
        setUploading(true);
        const { url, error: uploadError } = await uploadMateriFile(file);
        setUploading(false);

        if (uploadError) {
          toast.error("Gagal upload", uploadError);
          setLoading(false);
          return;
        }
        fileUrl = url || undefined;
      }

      if (editingMateri) {
        // Update
        const payload: Parameters<typeof updateMateri>[1] = {
          judul: form.judul,
          deskripsi: form.deskripsi || undefined,
          tipe_materi: form.tipe_materi,
          urutan: form.urutan,
        };
        if (form.tipe_materi === "zoom") {
          payload.zoom_link = form.zoom_link;
          payload.file_url = undefined;
        } else {
          payload.file_url = fileUrl;
          payload.zoom_link = undefined;
        }

        const result = await updateMateri(editingMateri.id, payload);
        if (result.success) {
          toast.success("Berhasil", result.message || "Materi diperbarui");
          // Update local state
          setMateriList((prev) =>
            prev.map((m) =>
              m.id === editingMateri.id
                ? { ...m, ...payload, file_url: fileUrl || m.file_url, zoom_link: payload.zoom_link ?? m.zoom_link }
                : m
            )
          );
          closeModal();
        } else {
          toast.error("Gagal", result.error || "Terjadi kesalahan");
        }
      } else {
        // Create
        const payload: Parameters<typeof createMateri>[1] = {
          judul: form.judul,
          deskripsi: form.deskripsi || undefined,
          tipe_materi: form.tipe_materi,
          urutan: form.urutan,
        };
        if (form.tipe_materi === "zoom") {
          payload.zoom_link = form.zoom_link;
        } else {
          payload.file_url = fileUrl;
        }

        const result = await createMateri(pelatihanId, payload);
        if (result.success) {
          toast.success("Berhasil", result.message || "Materi ditambahkan");
          router.refresh();
          closeModal();
        } else {
          toast.error("Gagal", result.error || "Terjadi kesalahan");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak terduga";
      toast.error("Error", message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleDelete = async (materi: MateriData) => {
    if (!window.confirm(`Hapus materi "${materi.judul}"?`)) return;

    const result = await deleteMateri(materi.id);
    if (result.success) {
      toast.success("Berhasil", result.message || "Materi dihapus");
      setMateriList((prev) => prev.filter((m) => m.id !== materi.id));
    } else {
      toast.error("Gagal", result.error || "Terjadi kesalahan");
    }
  };

  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case "pdf":
        return "bg-navy/10 text-navy border-navy/20";
      case "ppt":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "zoom":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Materi List */}
      {materiList.length === 0 ? (
        <div className="bg-white rounded-xl border border-navy/10 p-12 text-center">
          <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-navy mb-2">Belum Ada Materi</h4>
          <p className="text-silver mb-6">Klik tombol di bawah untuk menambahkan materi pelatihan.</p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Materi Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
          {/* Table Header with Add Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10 bg-navy/5">
            <span className="text-sm font-medium text-navy">{materiList.length} materi</span>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Materi
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-navy/10">
                <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider w-12">No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider w-36">Tipe</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-navy uppercase tracking-wider w-48">Konten</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-navy uppercase tracking-wider w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {materiList.map((materi, index) => (
                <tr key={materi.id} className="hover:bg-navy/3 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-silver font-medium">{materi.urutan ?? index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-navy">{materi.judul}</div>
                    {materi.deskripsi && (
                      <div className="text-xs text-silver mt-1 line-clamp-1">{materi.deskripsi}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTipeBadge(materi.tipe_materi)}`}>
                      {TIPE_MATERI_OPTIONS.find((o) => o.value === materi.tipe_materi)?.icon}{" "}
                      {materi.tipe_materi.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {materi.tipe_materi === "zoom" ? (
                      <a
                        href={materi.zoom_link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline line-clamp-1"
                      >
                        {materi.zoom_link || "-"}
                      </a>
                    ) : materi.file_url ? (
                      <a
                        href={materi.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline line-clamp-1"
                      >
                        Lihat file
                      </a>
                    ) : (
                      <span className="text-xs text-silver">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(materi)}
                        className="p-2 text-silver hover:text-navy hover:bg-navy/5 rounded-lg transition-colors duration-200"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(materi)}
                        className="p-2 text-silver hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Hapus"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 mx-4 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy">
                {editingMateri ? "Edit Materi" : "Tambah Materi Baru"}
              </h3>
              <button onClick={closeModal} className="p-1 text-silver hover:text-navy rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Judul Materi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 text-sm ${errors.judul ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                  placeholder="Contoh: Pengenalan keamanan siber"
                />
                {errors.judul && <p className="text-red-500 text-xs mt-1">{errors.judul}</p>}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Deskripsi</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm((p) => ({ ...p, deskripsi: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-silver/30 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 text-sm resize-none"
                  placeholder="Deskripsi singkat materi..."
                />
              </div>

              {/* Tipe Materi */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Tipe Materi <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIPE_MATERI_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, tipe_materi: opt.value }))}
                      className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                        form.tipe_materi === opt.value
                          ? "border-gold bg-gold/10 text-navy shadow-sm"
                          : "border-silver/30 text-silver hover:border-gold/30"
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload (untuk PDF/PPT) */}
              {form.tipe_materi !== "zoom" && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    File {editingMateri?.file_url ? "(biarkan kosong jika tidak ingin mengganti)" : ""}
                    <span className="text-red-500"> *</span>
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-silver/30 rounded-lg cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 text-silver mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {file ? (
                        <span className="text-sm text-navy font-medium">{file.name}</span>
                      ) : (
                        <span className="text-xs text-silver">Klik untuk upload file (PDF/PPT/PPTX, max 20MB)</span>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        const extension = f ? getFileExtension(f.name) : "";

                        if (f && !ALLOWED_FILE_EXTENSIONS.includes(extension)) {
                          setFile(null);
                          setErrors((p) => ({ ...p, file: "Format file harus PDF, PPT, atau PPTX" }));
                          e.target.value = "";
                          return;
                        }

                        if (f && f.size > MAX_FILE_SIZE) {
                          setFile(null);
                          setErrors((p) => ({ ...p, file: "Ukuran file maksimal 20MB" }));
                          e.target.value = "";
                          return;
                        }

                        setFile(f);
                        if (errors.file) setErrors((p) => ({ ...p, file: "" }));
                      }}
                    />
                  </label>
                  {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                </div>
              )}

              {/* Zoom Link */}
              {form.tipe_materi === "zoom" && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    Link Zoom / Google Meet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={form.zoom_link}
                    onChange={(e) => setForm((p) => ({ ...p, zoom_link: e.target.value }))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 text-sm ${errors.zoom_link ? "border-red-300 bg-red-50" : "border-silver/30"}`}
                    placeholder="https://zoom.us/j/... atau https://meet.google.com/..."
                  />
                  {errors.zoom_link && <p className="text-red-500 text-xs mt-1">{errors.zoom_link}</p>}
                </div>
              )}

              {/* Urutan */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Urutan</label>
                <input
                  type="number"
                  value={form.urutan}
                  onChange={(e) => setForm((p) => ({ ...p, urutan: Number(e.target.value) }))}
                  min="1"
                  className="w-24 px-4 py-2.5 border border-silver/30 rounded-lg focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all duration-200 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-navy/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-navy border border-navy/20 hover:border-navy/30 rounded-lg hover:bg-navy/5 transition-all duration-200"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 px-4 py-2.5 bg-linear-to-r from-navy to-gold text-white rounded-lg hover:from-navy/90 hover:to-gold/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loading || uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {uploading ? "Mengupload..." : "Menyimpan..."}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {editingMateri ? "Simpan Perubahan" : "Tambah Materi"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
