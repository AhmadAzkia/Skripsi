"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { SessionUser } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "../actions";

interface ProfilInfoProps {
  user: SessionUser;
}

export default function ProfilInfo({ user }: ProfilInfoProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    nama_lengkap: user.profile?.nama_lengkap || "",
    email: user.email || "",
    nomor_hp: user.profile?.nomor_hp || "",
    bio: user.profile?.bio || "",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage(null);
    setFormData({
      nama_lengkap: user.profile?.nama_lengkap || "",
      email: user.email || "",
      nomor_hp: user.profile?.nomor_hp || "",
      bio: user.profile?.bio || "",
    });
  };

  const handleSave = async () => {
    if (!user.id) {
      setMessage({
        type: "error",
        text: "User ID tidak ditemukan. Silakan login ulang.",
      });
      return;
    }

    // Validasi client-side
    if (!formData.nama_lengkap.trim()) {
      setMessage({
        type: "error",
        text: "Nama lengkap tidak boleh kosong.",
      });
      return;
    }

    if (formData.nomor_hp && !/^[\d\+\-\s\(\)]+$/.test(formData.nomor_hp)) {
      setMessage({
        type: "error",
        text: "Format nomor HP tidak valid.",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateProfile(user.id, {
        nama_lengkap: formData.nama_lengkap,
        nomor_hp: formData.nomor_hp,
        bio: formData.bio,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
        });
        setIsEditing(false);

        // Refresh page data to get updated profile
        router.refresh();

        // Auto hide success message after 3 seconds
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan tidak terduga. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white to-amber-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 border border-gold rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 border border-silver rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Informasi <span className="text-gold">Profil</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Kelola dan perbarui informasi profil Anda</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
              <div className="flex items-center">
                {message.type === "success" ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Detail Profil</h3>
                {!isEditing ? (
                  <button onClick={handleEdit} className="bg-gold hover:bg-gold/90 text-navy px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Profil</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={handleCancel} disabled={isLoading} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50">
                      Batal
                    </button>
                    <button onClick={handleSave} disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Simpan</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nama_lengkap}
                      onChange={(e) => handleChange("nama_lengkap", e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">{formData.nama_lengkap || "Belum diisi"}</div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 relative">
                    {formData.email}
                    <span className="absolute right-3 top-3 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Tidak dapat diubah</span>
                  </div>
                </div>

                {/* Nomor HP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.nomor_hp}
                      onChange={(e) => handleChange("nomor_hp", e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Contoh: 08123456789"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">{formData.nomor_hp || "Belum diisi"}</div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Akun</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-medium">Aktif</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Deskripsi</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      disabled={isLoading}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Ceritakan sedikit tentang diri Anda..."
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">{formData.bio || "Belum ada deskripsi"}</div>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-navy mb-4">Informasi Akun</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Bergabung</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      {user.profile?.dibuat_pada
                        ? new Date(user.profile.dibuat_pada).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Tidak tersedia"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terakhir Diperbarui</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      {user.profile?.diperbarui_pada
                        ? new Date(user.profile.diperbarui_pada).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Belum pernah diperbarui"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
