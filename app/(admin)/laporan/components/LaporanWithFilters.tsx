"use client";

import { useState, useMemo } from "react";
import { LaporanData } from "../page";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface LaporanWithFiltersProps {
  laporanList: LaporanData[];
}

export default function LaporanWithFilters({
  laporanList,
}: LaporanWithFiltersProps) {
  const [selectedTipe, setSelectedTipe] = useState<string>("semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Function untuk memfilter data berdasarkan tipe
  const filterByTipe = (data: LaporanData[], tipe: string) => {
    if (tipe === "semua") return data;
    return data.filter((laporan) => laporan.tipe_laporan === tipe);
  };

  // Function untuk memfilter data berdasarkan status
  const filterByStatus = (data: LaporanData[], status: string) => {
    if (status === "semua") return data;
    return data.filter((laporan) => laporan.status === status);
  };

  // Function untuk memfilter data berdasarkan pencarian
  const filterBySearch = (data: LaporanData[], query: string) => {
    if (!query.trim()) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter((laporan) =>
      laporan.judul.toLowerCase().includes(lowerQuery) ||
      laporan.tipe_laporan.toLowerCase().includes(lowerQuery) ||
      (laporan.keterangan && laporan.keterangan.toLowerCase().includes(lowerQuery))
    );
  };

  // Memfilter data menggunakan useMemo untuk optimasi
  const filteredLaporan = useMemo(() => {
    let filtered = laporanList;
    filtered = filterByTipe(filtered, selectedTipe);
    filtered = filterByStatus(filtered, selectedStatus);
    filtered = filterBySearch(filtered, searchQuery);
    return filtered;
  }, [laporanList, selectedTipe, selectedStatus, searchQuery]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "aktif":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTipeBadgeColor = (tipe: string) => {
    switch (tipe) {
      case "keuangan":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "peserta":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "kursus":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pendaftaran":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "transaksi":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "selesai":
        return "Selesai";
      case "aktif":
        return "Aktif";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  const getTipeText = (tipe: string) => {
    switch (tipe) {
      case "keuangan":
        return "Keuangan";
      case "peserta":
        return "Peserta";
      case "kursus":
        return "Kursus";
      case "pendaftaran":
        return "Pendaftaran";
      case "transaksi":
        return "Transaksi";
      default:
        return tipe;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddLaporan = () => {
    setSelectedLaporan(null);
    setIsEditMode(false);
    setShowUserModal(true);
  };

  const handleEditLaporan = (laporan: LaporanData) => {
    setSelectedLaporan(laporan);
    setIsEditMode(true);
    setShowUserModal(true);
  };

  const handleDeleteLaporan = (laporan: LaporanData) => {
    setSelectedLaporan(laporan);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedLaporan) return;

    try {
      const response = await fetch(`/api/laporan/${selectedLaporan.id}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        alert("Laporan berhasil dihapus!");
        setShowDeleteModal(false);
        setSelectedLaporan(null);
        
        // Refresh the page or update the list
        window.location.reload();
      } else {
        throw new Error("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Gagal menghapus laporan!");
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      judul: formData.get('judul') as string,
      tipe_laporan: formData.get('tipe_laporan') as string,
      periode_mulai: formData.get('periode_mulai') as string,
      periode_selesai: formData.get('periode_selesai') as string,
      status: formData.get('status') as string,
      keterangan: formData.get('keterangan') as string,
    };

    try {
      const url = isEditMode ? `/api/laporan/${selectedLaporan?.id}` : '/api/laporan';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(isEditMode ? "Laporan berhasil diupdate!" : "Laporan berhasil ditambahkan!");
        setShowUserModal(false);
        setSelectedLaporan(null);
        
        // Refresh the page or update the list
        window.location.reload();
      } else {
        throw new Error("Failed to save report");
      }
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Gagal menyimpan laporan!");
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header dan Filters */}
        <div className="mb-8">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-2xl font-bold text-navy mb-2">Daftar Laporan</h2>
                <p className="text-gray-600">
                  Menampilkan {filteredLaporan.length} dari {laporanList.length} laporan
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari judul laporan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Add Report Button */}
                <button
                  onClick={handleAddLaporan}
                  className="px-6 py-3 bg-navy text-white rounded-xl hover:bg-navy/90 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Laporan</span>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={100}>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Filter Tipe */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Tipe Laporan
                  </label>
                  <select
                    value={selectedTipe}
                    onChange={(e) => setSelectedTipe(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-white"
                  >
                    <option value="semua">Semua Tipe</option>
                    <option value="keuangan">Keuangan</option>
                    <option value="peserta">Peserta</option>
                    <option value="kursus">Kursus</option>
                    <option value="pendaftaran">Pendaftaran</option>
                    <option value="transaksi">Transaksi</option>
                  </select>
                </div>

                {/* Filter Status */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-white"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedTipe("semua");
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

        {/* Report List */}
        <div className="space-y-4">
          {filteredLaporan.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada laporan ditemukan</h3>
                <p className="text-gray-600">
                  Coba ubah filter atau kata kunci pencarian Anda.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            filteredLaporan.map((laporan, index) => (
              <ScrollReveal key={laporan.id} delay={index * 50}>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex items-start space-x-4 mb-4 lg:mb-0 flex-1">
                      {/* Report Icon */}
                      <div className="shrink-0">
                        <div className="w-12 h-12 bg-linear-to-br from-navy to-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>

                      {/* Report Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-navy truncate">
                            {laporan.judul}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getTipeBadgeColor(
                              laporan.tipe_laporan
                            )}`}
                          >
                            {getTipeText(laporan.tipe_laporan)}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(
                              laporan.status
                            )}`}
                          >
                            {getStatusText(laporan.status)}
                          </span>
                        </div>
                        
                        {laporan.keterangan && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{laporan.keterangan}</p>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                          <p>Periode: {formatDate(laporan.periode_mulai)} - {formatDate(laporan.periode_selesai)}</p>
                          <p>Dibuat: {formatDate(laporan.dibuat_pada)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {laporan.file_url && (
                        <a
                          href={laporan.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Laporan"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>
                      )}
                      <button
                        onClick={() => handleEditLaporan(laporan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Laporan"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteLaporan(laporan)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Laporan"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>

      {/* Modal untuk Add/Edit Laporan */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-navy">
                {isEditMode ? "Edit Laporan" : "Tambah Laporan Baru"}
              </h3>
            </div>
            
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Laporan
                </label>
                <input
                  type="text"
                  name="judul"
                  defaultValue={isEditMode ? selectedLaporan?.judul : ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="Masukkan judul laporan"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Laporan
                  </label>
                  <select
                    name="tipe_laporan"
                    defaultValue={isEditMode ? selectedLaporan?.tipe_laporan : ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  >
                    <option value="">Pilih Tipe</option>
                    <option value="keuangan">Keuangan</option>
                    <option value="peserta">Peserta</option>
                    <option value="kursus">Kursus</option>
                    <option value="pendaftaran">Pendaftaran</option>
                    <option value="transaksi">Transaksi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={isEditMode ? selectedLaporan?.status : "draft"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="draft">Draft</option>
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    name="periode_mulai"
                    defaultValue={isEditMode ? selectedLaporan?.periode_mulai : ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    name="periode_selesai"
                    defaultValue={isEditMode ? selectedLaporan?.periode_selesai : ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  rows={4}
                  defaultValue={isEditMode ? selectedLaporan?.keterangan || "" : ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="Masukkan keterangan laporan"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Laporan (Opsional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
            </form>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-navy text-white rounded-xl hover:bg-navy/90 transition-colors font-medium"
              >
                {isEditMode ? "Update Laporan" : "Tambah Laporan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Delete */}
      {showDeleteModal && selectedLaporan && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
                  <p className="text-gray-600 text-sm">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus laporan <strong>"{selectedLaporan.judul}"</strong>?
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}