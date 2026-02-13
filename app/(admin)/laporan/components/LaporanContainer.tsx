"use client";

import { SessionUser } from "@/contexts/AuthContext";
import { LaporanData, LaporanStats as LaporanStatsType } from "../page";
import LaporanHero from "./LaporanHero";
import LaporanStatsComponent from "./LaporanStats";
import LaporanWithFilters from "./LaporanWithFilters";

// Rename to avoid conflict with type
const LaporanStats = LaporanStatsComponent;

type LaporanContainerProps = {
  user: SessionUser;
  stats: LaporanStatsType;
  laporanList: LaporanData[];
};

export default function LaporanContainer({ 
  user, 
  stats, 
  laporanList 
}: LaporanContainerProps) {
  return (
    <>
      {/* Hero Section */}
      <LaporanHero user={user} />

      {/* Statistics Section */}
      <LaporanStats stats={stats} />

      {/* Filters and Report List Section */}
      <LaporanWithFilters laporanList={laporanList} />
    </>
  );
}