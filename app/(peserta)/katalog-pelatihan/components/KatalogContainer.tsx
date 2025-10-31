"use client";

import { useState, useMemo } from "react";
import KatalogHero from "./KatalogHero";
import KatalogStats from "./KatalogStats";
import KatalogFilters from "./KatalogFilters";
import KatalogList from "./KatalogList";
import { SessionUser } from "@/contexts/AuthContext";

type Kursus = {
  id: string;
  judul: string;
  deskripsi: string | null;
  harga: number;
  kategori: string;
  tipe_kursus: "online" | "offline" | "hybrid";
  status: "draft" | "published" | "archived";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  thumbnail_url: string | null;
  instruktur: {
    nama_lengkap: string;
  } | null;
};

type KatalogContainerProps = {
  user: SessionUser;
  stats: {
    totalKursusCount: number;
    kategoriCount: number;
    instrukturCount: number;
  };
  kursusList: Kursus[];
  kategoriList: string[];
};

export default function KatalogContainer({ user, stats, kursusList, kategoriList }: KatalogContainerProps) {
  const [selectedKategori, setSelectedKategori] = useState("semua");
  const [selectedTipe, setSelectedTipe] = useState("semua");

  // Filter kursus berdasarkan kategori dan tipe yang dipilih
  const filteredKursus = useMemo(() => {
    return kursusList.filter((kursus) => {
      const matchKategori = selectedKategori === "semua" || kursus.kategori === selectedKategori;
      const matchTipe = selectedTipe === "semua" || kursus.tipe_kursus === selectedTipe;
      return matchKategori && matchTipe;
    });
  }, [kursusList, selectedKategori, selectedTipe]);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      {/* Hero Section */}
      <KatalogHero user={user} />

      {/* Statistics Section */}
      <KatalogStats stats={stats} />

      {/* Filters Section */}
      <KatalogFilters kategoriList={kategoriList} />

      {/* Kursus List Section */}
      <KatalogList kursusList={filteredKursus} />
    </div>
  );
}
