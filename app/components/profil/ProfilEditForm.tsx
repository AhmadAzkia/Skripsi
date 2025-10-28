"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { updateUserProfile, deleteUserAvatar } from "./actions";
import Avatar from "./Avatar";
import { Button, Input, Alert } from "@/components/ui";

// Type definitions based on database schema
interface UserProfile {
  id: string;
  user_id: string;
  nama_lengkap: string;
  email: string;
  nomor_hp: string | null;
  bio: string | null;
  foto_profil_url: string | null;
  peran: "admin" | "instruktur" | "peserta";
  is_aktif: boolean;
  dibuat_pada: string;
  diperbarui_pada: string | null;
}

type UserRole = "admin" | "pemateri" | "peserta";

interface ProfilEditFormProps {
  profile: UserProfile;
  role: UserRole;
  loading?: boolean;
  onSave?: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export default function ProfilEditForm({ profile, role, loading = false, onSave, onCancel }: ProfilEditFormProps) {
  const [formData, setFormData] = useState({
    nama_lengkap: profile.nama_lengkap || "",
    nomor_hp: profile.nomor_hp || "",
    bio: profile.bio || "",
  });

  const [avatarPreview, setAvatarPreview] = useState(profile.foto_profil_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile.foto_profil_url) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await deleteUserAvatar();

      if (result.success && result.profile) {
        setAvatarPreview("");
        setMessage({ type: "success", text: result.message });
        onSave?.(result.profile);
      } else {
        setMessage({ type: "error", text: result.error || "Gagal menghapus foto profil" });
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan saat menghapus foto profil" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsSubmitting(true);
      const result = await deleteUserAvatar();

      if (result.success && result.profile) {
        setAvatarPreview("");
        setMessage({ type: "success", text: result.message });
        onSave?.(result.profile);
      } else {
        setMessage({ type: "error", text: result.error || "Gagal menghapus foto profil" });
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan saat menghapus foto profil" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (!formData.nama_lengkap.trim()) {
      setMessage({ type: "error", text: "Nama lengkap wajib diisi" });
      return;
    }

    if (formData.nomor_hp && !/^[\d\s\-\+\(\)]+$/.test(formData.nomor_hp)) {
      setMessage({ type: "error", text: "Format nomor telepon tidak valid" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_lengkap", formData.nama_lengkap.trim());
      formDataToSend.append("nomor_hp", formData.nomor_hp.trim());
      formDataToSend.append("bio", formData.bio.trim());

      // Add avatar file if selected
      const avatarFile = fileInputRef.current?.files?.[0];
      if (avatarFile) {
        // Validate file size (max 5MB)
        if (avatarFile.size > 5 * 1024 * 1024) {
          setMessage({ type: "error", text: "Ukuran file maksimal 5MB" });
          setIsSubmitting(false);
          return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(avatarFile.type)) {
          setMessage({ type: "error", text: "Format file harus JPEG, PNG, atau WebP" });
          setIsSubmitting(false);
          return;
        }

        formDataToSend.append("avatar", avatarFile);
      }

      const result = await updateUserProfile(formDataToSend);

      if (result.success && result.profile) {
        setMessage({ type: "success", text: result.message });
        onSave?.(result.profile);
        // Auto-close edit mode after successful save
        setTimeout(() => {
          setMessage(null);
          onCancel?.(); // This will close the edit form
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Gagal memperbarui profil" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan saat memperbarui profil" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      nama_lengkap: profile.nama_lengkap || "",
      nomor_hp: profile.nomor_hp || "",
      bio: profile.bio || "",
    });
    setAvatarPreview(profile.foto_profil_url || "");
    setMessage(null);
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profil</h2>
        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mb-6">
          <Alert variant={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-[120px] h-[120px]">
              <Avatar src={avatarPreview} alt="Avatar Preview" size="xl" className="w-full h-full border-4 border-gray-200" />
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-navy hover:bg-navy/90 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
              disabled={loading || isSubmitting}
              title="Ganti foto profil"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Remove Button (only show if avatar exists) */}
            {(avatarPreview || profile.foto_profil_url) && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="absolute bottom-0 left-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
                disabled={loading || isSubmitting}
                title="Hapus foto profil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={loading || isSubmitting} />
          <p className="text-sm text-gray-500 mt-2">
            Klik ikon kamera untuk mengganti foto
            <br />
            <span className="text-xs">Format: JPEG, PNG, WebP (max. 5MB)</span>
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Nama Lengkap */}
          <Input type="text" label="Nama Lengkap" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required disabled={loading || isSubmitting} />

          {/* Nomor HP */}
          <Input type="tel" label="Nomor Telepon" name="nomor_hp" value={formData.nomor_hp} onChange={handleInputChange} disabled={loading || isSubmitting} />

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              disabled={loading || isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy disabled:bg-gray-50"
              placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6 border-t">
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={loading || isSubmitting} className="flex-1">
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={loading || isSubmitting} disabled={loading || isSubmitting} className="flex-1">
            {loading || isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
