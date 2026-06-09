"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/../types/database";
import PelatihanList from "@/components/pelatihan/PelatihanList";
import { deletePelatihan } from "../actions";

type KursusData = Tables<"kursus"> & {
  jumlah_peserta?: number;
  jumlah_materi?: number;
  nama_instruktur?: string;
};

type JadwalStatus = "berjalan" | "belum" | "lewat";

interface AdminPelatihanClientProps {
  kursusData: KursusData[];
}

function getJadwalStatus(kursus: KursusData, now: number): JadwalStatus {
  const mulai = kursus.tanggal_mulai ? new Date(kursus.tanggal_mulai).getTime() : null;
  const selesai = kursus.tanggal_selesai ? new Date(kursus.tanggal_selesai).getTime() : null;

  // Pelatihan tanpa tanggal mulai dianggap belum dijadwalkan
  if (mulai === null) return "belum";
  if (selesai !== null && now > selesai) return "lewat";
  if (now >= mulai) return "berjalan";
  return "belum";
}

const TABS: { key: JadwalStatus; label: string }[] = [
  { key: "berjalan", label: "Sedang Berjalan" },
  { key: "belum", label: "Belum Berjalan" },
  { key: "lewat", label: "Sudah Lewat" },
];

export default function AdminPelatihanClient({ kursusData }: AdminPelatihanClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<JadwalStatus>("berjalan");
  const router = useRouter();

  const grouped = useMemo(() => {
    const now = Date.now();
    const groups: Record<JadwalStatus, KursusData[]> = { berjalan: [], belum: [], lewat: [] };
    for (const kursus of kursusData) {
      groups[getJadwalStatus(kursus, now)].push(kursus);
    }
    return groups;
  }, [kursusData]);

  const handleEdit = (kursus: KursusData) => {
    router.push(`/pelatihan-admin/edit/${kursus.id}`);
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
    router.push(`/pelatihan-admin/edit/${kursusId}`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Jadwal */}
      <div className="flex flex-wrap gap-2 border-b border-navy/10">
        {TABS.map((tab) => {
          const count = grouped[tab.key].length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-medium transition-colors duration-200 ${
                isActive ? "border-gold text-navy" : "border-transparent text-silver hover:text-navy hover:border-navy/20"
              }`}
            >
              {tab.label}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-gold/20 text-navy" : "bg-gray-100 text-gray-500"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <PelatihanList kursusData={grouped[activeTab]} userRole="admin" showActions={true} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} loading={loading !== null} />
    </div>
  );
}
