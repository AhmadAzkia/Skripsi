"use client";

import { useState, useMemo } from "react";
import { PenggunaData } from "../page";
import ScrollReveal from "@/components/ui/ScrollReveal";
import UserModal from "./UserModal";
import DeleteModal from "./DeleteModal";

interface ManajemenPenggunaWithFiltersProps {
  penggunaList: PenggunaData[];
}

export default function ManajemenPenggunaWithFilters({ penggunaList: initialPenggunaList }: ManajemenPenggunaWithFiltersProps) {
  const [penggunaList, setPenggunaList] = useState<PenggunaData[]>(initialPenggunaList);
  const [selectedRole, setSelectedRole] = useState<string>("semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<PenggunaData | null>(null);
  const [loading, setLoading] = useState(false);

  // CRUD Functions
  const handleCreateUser = async (userData: Partial<PenggunaData>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

      const { data } = await response.json();
      setPenggunaList((prev) => [data, ...prev]);
      alert("Pengguna berhasil ditambahkan!");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Gagal menambahkan pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<PenggunaData>) => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }

      const { data } = await response.json();
      setPenggunaList((prev) => prev.map((user) => (user.id === selectedUser.id ? data : user)));
      alert("Pengguna berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Gagal memperbarui pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      setPenggunaList((prev) => prev.filter((user) => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      alert("Pengguna berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Gagal menghapus pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: PenggunaData) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const openDeleteModal = (user: PenggunaData) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Function untuk memfilter data berdasarkan peran
  const filterByRole = (data: PenggunaData[], role: string) => {
    if (role === "semua") return data;
    return data.filter((user) => user.peran === role);
  };

  // Function untuk memfilter data berdasarkan status
  const filterByStatus = (data: PenggunaData[], status: string) => {
    if (status === "semua") return data;
    if (status === "aktif") return data.filter((user) => user.is_aktif === true);
    if (status === "tidak_aktif") return data.filter((user) => user.is_aktif === false);
    return data;
  };

  // Function untuk memfilter data berdasarkan pencarian
  const filterBySearch = (data: PenggunaData[], query: string) => {
    if (!query.trim()) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter((user) => user.nama_lengkap.toLowerCase().includes(lowerQuery) || user.email.toLowerCase().includes(lowerQuery) || (user.nomor_hp && user.nomor_hp.includes(query)));
  };

  // Memfilter data menggunakan useMemo untuk optimasi
  const filteredPengguna = useMemo(() => {
    let filtered = penggunaList;
    filtered = filterByRole(filtered, selectedRole);
    filtered = filterByStatus(filtered, selectedStatus);
    filtered = filterBySearch(filtered, searchQuery);
    return filtered;
  }, [penggunaList, selectedRole, selectedStatus, searchQuery]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "instruktur":
        return "bg-green-100 text-green-800 border-green-200";
      case "peserta":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "instruktur":
        return "Instruktur";
      case "peserta":
        return "Peserta";
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header dan Filters */}
          <div className="mb-8">
            <ScrollReveal>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-2xl font-bold text-navy mb-2">Daftar Pengguna</h2>
                  <p className="text-gray-600">
                    Menampilkan {filteredPengguna.length} dari {penggunaList.length} pengguna
                  </p>
                </div>

                {/* Add User Button */}
                <button
                  onClick={openCreateModal}
                  className="flex items-center px-6 py-3 bg-linear-to-r from-gold to-yellow-500 text-white rounded-xl hover:from-yellow-500 hover:to-gold transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Pengguna
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md lg:ml-8 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari nama, email, atau nomor HP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </ScrollReveal>

            {/* Filters */}
            <ScrollReveal delay={100}>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Filter Peran */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter Peran</label>
                    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-colors bg-white">
                      <option value="semua">Semua Peran</option>
                      <option value="admin">Admin</option>
                      <option value="instruktur">Instruktur</option>
                      <option value="peserta">Peserta</option>
                    </select>
                  </div>

                  {/* Filter Status */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter Status</label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition-colors bg-white">
                      <option value="semua">Semua Status</option>
                      <option value="aktif">Aktif</option>
                      <option value="tidak_aktif">Tidak Aktif</option>
                    </select>
                  </div>

                  {/* Reset Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedRole("semua");
                        setSelectedStatus("semua");
                        setSearchQuery("");
                      }}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredPengguna.length === 0 ? (
              <ScrollReveal>
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada pengguna ditemukan</h3>
                  <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian Anda.</p>
                </div>
              </ScrollReveal>
            ) : (
              filteredPengguna.map((user, index) => (
                <ScrollReveal key={user.id} delay={index * 50}>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                        {/* Profile Image */}
                        <div className="shrink-0">
                          {user.foto_profil_url ? (
                            <img src={user.foto_profil_url} alt={user.nama_lengkap} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                          ) : (
                            <div className="w-12 h-12 bg-linear-to-br from-navy to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">{user.nama_lengkap.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-navy truncate">{user.nama_lengkap}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.peran)}`}>{getRoleText(user.peran)}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{user.email}</p>
                          {user.nomor_hp && <p className="text-gray-500 text-sm">{user.nomor_hp}</p>}
                          <p className="text-gray-400 text-xs mt-2">Bergabung: {formatDate(user.dibuat_pada)}</p>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center space-x-4">
                        {/* Status */}
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${user.is_aktif ? "bg-green-500" : "bg-red-500"}`}></div>
                          <span className={`text-sm font-medium ${user.is_aktif ? "text-green-700" : "text-red-700"}`}>{user.is_aktif ? "Aktif" : "Tidak Aktif"}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button onClick={() => openEditModal(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Pengguna">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button onClick={() => openDeleteModal(user)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Pengguna">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={modalMode === "create" ? handleCreateUser : handleUpdateUser} user={selectedUser} mode={modalMode} />

      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteUser} user={selectedUser} loading={loading} />
    </>
  );
}
