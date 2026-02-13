"use client";

import { useState, useEffect } from "react";
import { PenggunaData } from "../page";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<PenggunaData>) => Promise<void>;
  user?: PenggunaData | null;
  mode: "create" | "edit";
}

export default function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    peran: "peserta",
    nomor_hp: "",
    bio: "",
    is_aktif: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        nama_lengkap: user.nama_lengkap || "",
        email: user.email || "",
        peran: user.peran || "peserta",
        nomor_hp: user.nomor_hp || "",
        bio: user.bio || "",
        is_aktif: user.is_aktif ?? true,
      });
    } else {
      setFormData({
        nama_lengkap: "",
        email: "",
        peran: "peserta",
        nomor_hp: "",
        bio: "",
        is_aktif: true,
      });
    }
    setErrors({});
  }, [mode, user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.peran) {
      newErrors.peran = "Peran wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy">{mode === "create" ? "Tambah Pengguna Baru" : "Edit Pengguna"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={loading}>
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${errors.nama_lengkap ? "border-red-500" : "border-gray-300"}`}
              placeholder="Masukkan nama lengkap"
              disabled={loading}
            />
            {errors.nama_lengkap && <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Masukkan email"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Peran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peran <span className="text-red-500">*</span>
            </label>
            <select
              name="peran"
              value={formData.peran}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white ${errors.peran ? "border-red-500" : "border-gray-300"}`}
              disabled={loading}
            >
              <option value="peserta">Peserta</option>
              <option value="instruktur">Instruktur</option>
              <option value="admin">Admin</option>
            </select>
            {errors.peran && <p className="text-red-500 text-sm mt-1">{errors.peran}</p>}
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
            <input
              type="tel"
              name="nomor_hp"
              value={formData.nomor_hp}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="Masukkan nomor HP"
              disabled={loading}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
              placeholder="Masukkan bio singkat"
              disabled={loading}
            />
          </div>

          {/* Status Aktif (only for edit mode) */}
          {mode === "edit" && (
            <div className="flex items-center">
              <input type="checkbox" name="is_aktif" checked={formData.is_aktif} onChange={handleChange} className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-2 focus:ring-amber-500" disabled={loading} />
              <label className="ml-2 text-sm font-medium text-gray-700">Status Aktif</label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium" disabled={loading}>
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {mode === "create" ? "Menambahkan..." : "Menyimpan..."}
                </div>
              ) : mode === "create" ? (
                "Tambah Pengguna"
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
