"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/../types/database";
import PelatihanList from "@/components/pelatihan/PelatihanList";
import { deletePelatihan } from "../actions";

type KursusData = Tables<"kursus"> & {
  jumlah_peserta?: number;
  jumlah_materi?: number;
  nama_instruktur?: string;
};

interface AdminPelatihanClientProps {
  kursusData: KursusData[];
}

export default function AdminPelatihanClient({ kursusData }: AdminPelatihanClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (kursus: KursusData) => {
    // Navigate to edit page
    router.push(`/admin/pelatihan-admin/edit/${kursus.id}`);
  };

  const handleDelete = async (kursusId: string) => {
    const kursus = kursusData.find((k) => k.id === kursusId);
    if (!kursus) return;

    // Confirm deletion
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus pelatihan "${kursus.judul}"?\n\nTindakan ini tidak dapat dibatalkan.`);

    if (!isConfirmed) return;

    setLoading(kursusId);
    try {
      const result = await deletePelatihan(kursusId);

      if (result.success) {
        // Show success message
        alert(result.message || "Pelatihan berhasil dihapus");
        // Refresh the page to update the list
        router.refresh();
      } else {
        // Show error message
        alert(result.error || "Gagal menghapus pelatihan");
      }
    } catch (error) {
      console.error("Error deleting pelatihan:", error);
      alert("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(null);
    }
  };

  const handleView = (kursusId: string) => {
    router.push(`/admin/pelatihan-admin/detail/${kursusId}`);
  };

  return <PelatihanList kursusData={kursusData} userRole="admin" showActions={true} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} loading={loading !== null} />;
}
