"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Kursus = {
  id: string;
  judul: string;
};

interface MateriFiltersProps {
  kursusOptions: Kursus[];
}

export default function MateriFilters({ kursusOptions }: MateriFiltersProps) {
  const [selectedKursus, setSelectedKursus] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "belum_mulai", label: "Belum Mulai" },
    { value: "sedang_belajar", label: "Sedang Dipelajari" },
    { value: "selesai", label: "Selesai" },
  ];

  return (
    <section className="py-8 bg-linear-to-br from-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-navy mb-2">Filter Materi</h3>
                <p className="text-gray-600 text-sm">Pilih kursus dan status untuk menyaring materi pembelajaran</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Filter by Kursus */}
                <div className="min-w-0 sm:min-w-[200px]">
                  <label htmlFor="kursus-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Kursus
                  </label>
                  <select
                    id="kursus-filter"
                    value={selectedKursus}
                    onChange={(e) => setSelectedKursus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">Semua Kursus</option>
                    {kursusOptions.map((kursus) => (
                      <option key={kursus.id} value={kursus.id}>
                        {kursus.judul}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Status */}
                <div className="min-w-0 sm:min-w-[200px]">
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Status Progress
                  </label>
                  <select
                    id="status-filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                <div className="self-end">
                  <button
                    onClick={() => {
                      setSelectedKursus("all");
                      setSelectedStatus("all");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-300 min-h-[42px] flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
