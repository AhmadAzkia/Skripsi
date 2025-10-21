"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface JadwalFiltersProps {}

export default function JadwalFilters({}: JadwalFiltersProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("semua");

  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "terdaftar", label: "Terdaftar" },
    { value: "sedang_belajar", label: "Sedang Berlangsung" },
    { value: "selesai", label: "Selesai" },
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

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-navy transition-all duration-300 rounded-lg font-medium">Export PDF</button>
              <button className="px-4 py-2 bg-gold text-navy hover:bg-gold/90 transition-all duration-300 rounded-lg font-medium">Lihat Kalender</button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
