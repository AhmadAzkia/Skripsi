"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface KatalogFiltersProps {
  kategoriList: string[];
}

export default function KatalogFilters({ kategoriList }: KatalogFiltersProps) {
  const [selectedKategori, setSelectedKategori] = useState("semua");
  const [selectedTipe, setSelectedTipe] = useState("semua");

  const tipeKursusList = ["semua", "online", "offline", "hybrid"];

  const handleReset = () => {
    setSelectedKategori("semua");
    setSelectedTipe("semua");
  };

  return (
    <section className="py-8 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Filter Kategori */}
              <div className="flex-1 w-full lg:w-auto">
                <label className="block text-sm font-medium text-navy mb-2">Filter Kategori</label>
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 bg-white text-gray-700"
                >
                  <option value="semua">Semua Kategori</option>
                  {kategoriList.map((kategori) => (
                    <option key={kategori} value={kategori}>
                      {kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Tipe */}
              <div className="flex-1 w-full lg:w-auto">
                <label className="block text-sm font-medium text-navy mb-2">Filter Tipe</label>
                <select
                  value={selectedTipe}
                  onChange={(e) => setSelectedTipe(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 bg-white text-gray-700"
                >
                  {tipeKursusList.map((tipe) => (
                    <option key={tipe} value={tipe}>
                      {tipe === "semua" ? "Semua Tipe" : tipe.charAt(0).toUpperCase() + tipe.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filter */}
              <div className="flex-shrink-0">
                <button onClick={handleReset} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedKategori !== "semua" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Kategori: {selectedKategori}
                  <button onClick={() => setSelectedKategori("semua")} className="ml-2 text-blue-600 hover:text-blue-800">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedTipe !== "semua" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tipe: {selectedTipe.charAt(0).toUpperCase() + selectedTipe.slice(1)}
                  <button onClick={() => setSelectedTipe("semua")} className="ml-2 text-green-600 hover:text-green-800">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
