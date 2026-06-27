"use client";

import { useState, useMemo } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import JadwalList from "./JadwalList";

type JadwalPelatihan = {
  id: string;
  pelatihan_id: string;
  judul: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  tipe_pelatihan: string;
};

interface JadwalWithFiltersProps {
  jadwalList: JadwalPelatihan[];
}

export default function JadwalWithFilters({ jadwalList }: JadwalWithFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("semua");

  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "terdaftar", label: "Mendatang" },
    { value: "sedang_belajar", label: "Sedang Berlangsung" },
    { value: "selesai", label: "Selesai" },
    { value: "dibatalkan", label: "Dibatalkan" },
  ];

  const periodOptions = [
    { value: "semua", label: "Semua Periode" },
    { value: "minggu_ini", label: "Minggu Ini" },
    { value: "bulan_ini", label: "Bulan Ini" },
    { value: "3_bulan", label: "3 Bulan Terakhir" },
  ];

  // Function untuk memfilter data berdasarkan status
  const filterByStatus = (data: JadwalPelatihan[], status: string) => {
    if (status === "semua") return data;
    return data.filter((item) => item.status === status);
  };

  // Function untuk memfilter data berdasarkan periode
  const filterByPeriod = (data: JadwalPelatihan[], period: string) => {
    if (period === "semua") return data;

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    switch (period) {
      case "minggu_ini": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startString = startOfWeek.toISOString().split("T")[0];
        const endString = endOfWeek.toISOString().split("T")[0];

        return data.filter(
          (item) =>
            (item.tanggal_mulai >= startString && item.tanggal_mulai <= endString) || (item.tanggal_selesai >= startString && item.tanggal_selesai <= endString) || (item.tanggal_mulai <= startString && item.tanggal_selesai >= endString)
        );
      }
      case "bulan_ini": {
        const year = today.getFullYear();
        const month = today.getMonth();
        const startOfMonth = new Date(year, month, 1).toISOString().split("T")[0];
        const endOfMonth = new Date(year, month + 1, 0).toISOString().split("T")[0];

        return data.filter(
          (item) =>
            (item.tanggal_mulai >= startOfMonth && item.tanggal_mulai <= endOfMonth) ||
            (item.tanggal_selesai >= startOfMonth && item.tanggal_selesai <= endOfMonth) ||
            (item.tanggal_mulai <= startOfMonth && item.tanggal_selesai >= endOfMonth)
        );
      }
      case "3_bulan": {
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        const startString = threeMonthsAgo.toISOString().split("T")[0];

        return data.filter((item) => item.tanggal_mulai >= startString || item.tanggal_selesai >= startString);
      }
      default:
        return data;
    }
  };

  // Memfilter data menggunakan useMemo untuk optimasi
  const filteredJadwal = useMemo(() => {
    let filtered = jadwalList;
    filtered = filterByStatus(filtered, selectedStatus);
    filtered = filterByPeriod(filtered, selectedPeriod);
    return filtered;
  }, [jadwalList, selectedStatus, selectedPeriod]);

  const handleReset = () => {
    setSelectedStatus("semua");
    setSelectedPeriod("semua");
  };

  return (
    <>
      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Status Filter */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Filter Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-gray-900 min-w-[200px]"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Period Filter */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">Filter Periode</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-gray-900 min-w-[200px]"
                  >
                    {periodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results info dan Reset button */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold text-navy">{filteredJadwal.length}</span> dari <span className="font-semibold text-navy">{jadwalList.length}</span> jadwal
                </div>

                {(selectedStatus !== "semua" || selectedPeriod !== "semua") && (
                  <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:text-navy border border-gray-300 rounded-lg hover:border-gold transition-colors duration-300">
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Jadwal List Section */}
      <JadwalList jadwalList={filteredJadwal} />
    </>
  );
}
