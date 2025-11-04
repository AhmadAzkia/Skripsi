"use client";

import { ChangeEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface JadwalFiltersProps {
  selectedStatus?: string;
  selectedPeriod?: string;
  totalItems: number;
  filteredItems: number;
}

export default function JadwalFilters({ selectedStatus = "semua", selectedPeriod = "semua", totalItems, filteredItems }: JadwalFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<string>(selectedStatus);
  const [period, setPeriod] = useState<string>(selectedPeriod);

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === "semua") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handlePeriodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPeriod(value);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === "semua") {
      params.delete("period");
    } else {
      params.set("period", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleReset = () => {
    setStatus("semua");
    setPeriod("semua");
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("status");
    params.delete("period");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

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

  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Filter Status</label>
                <select value={status} onChange={handleStatusChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-gray-900 min-w-[200px]">
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
                <select value={period} onChange={handlePeriodChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-gray-900 min-w-[200px]">
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
                Menampilkan <span className="font-semibold text-navy">{filteredItems}</span> dari <span className="font-semibold text-navy">{totalItems}</span> jadwal
              </div>

              {(status !== "semua" || period !== "semua") && (
                <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:text-navy border border-gray-300 rounded-lg hover:border-gold transition-colors duration-300">
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
