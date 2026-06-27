"use client";

import KatalogHero from "./KatalogHero";
import KatalogStats from "./KatalogStats";
import KatalogWithFilters from "./KatalogWithFilters";
import { SessionUser } from "@/contexts/AuthContext";

type Pelatihan = {
  id: string;
  judul: string;
  deskripsi: string | null;
  harga: number;
  kategori: string;
  tipe_pelatihan: "online" | "offline";
  status: "draft" | "published" | "archived";
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  thumbnail_url: string | null;
};

type KatalogContainerProps = {
  user: SessionUser;
  stats: {
    totalPelatihanCount: number;
    kategoriCount: number;
  };
  pelatihanList: Pelatihan[];
  kategoriList: string[];
};

export default function KatalogContainer({ user, stats, pelatihanList, kategoriList }: KatalogContainerProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      {/* Hero Section */}
      <KatalogHero user={user} />

      {/* Statistics Section */}
      <KatalogStats stats={stats} />

      {/* Filters and Pelatihan List Section */}
      <KatalogWithFilters pelatihanList={pelatihanList} kategoriList={kategoriList} />
    </div>
  );
}
