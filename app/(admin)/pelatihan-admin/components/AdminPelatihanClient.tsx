"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/../types/database";
import PelatihanList from "@/components/pelatihan/PelatihanList";
import { deletePelatihan } from "../actions";

type PelatihanData = Tables<"pelatihan"> & {
  jumlah_peserta?: number;
  jumlah_materi?: number;
};

type JadwalStatus = "berjalan" | "belum" | "lewat";

interface AdminPelatihanClientProps {
  pelatihanData: PelatihanData[];
}

function getJadwalStatus(pelatihan: PelatihanData, now: number): JadwalStatus {
  const mulai = pelatihan.tanggal_mulai ? new Date(pelatihan.tanggal_mulai).getTime() : null;
  const selesai = pelatihan.tanggal_selesai ? new Date(pelatihan.tanggal_selesai).getTime() : null;

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

export default function AdminPelatihanClient({ pelatihanData }: AdminPelatihanClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<JadwalStatus>("berjalan");
  const router = useRouter();

  const grouped = useMemo(() => {
    const now = Date.now();
    const groups: Record<JadwalStatus, PelatihanData[]> = { berjalan: [], belum: [], lewat: [] };
    for (const pelatihan of pelatihanData) {
      groups[getJadwalStatus(pelatihan, now)].push(pelatihan);
    }
    return groups;
  }, [pelatihanData]);

  const handleEdit = (pelatihan: PelatihanData) => {
    router.push(`/pelatihan-admin/edit/${pelatihan.id}`);
  };

  const handleDelete = async (pelatihanId: string) => {
    const pelatihan = pelatihanData.find((k) => k.id === pelatihanId);
    if (!pelatihan) return;

    // Confirm deletion
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus pelatihan "${pelatihan.judul}"?\n\nTindakan ini tidak dapat dibatalkan.`);

    if (!isConfirmed) return;

    setLoading(pelatihanId);
    try {
      const result = await deletePelatihan(pelatihanId);

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

  const handleView = (pelatihanId: string) => {
    router.push(`/pelatihan-admin/edit/${pelatihanId}`);
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

      <PelatihanList pelatihanData={grouped[activeTab]} userRole="admin" showActions={true} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} loading={loading !== null} />
    </div>
  );
}
