"use client";

import { SessionUser } from "@/contexts/AuthContext";
import { JadwalPelatihan, JadwalStats as JadwalStatsType } from "../page";
import JadwalHero from "./JadwalHero";
import JadwalStatsComponent from "./JadwalStats";
import JadwalWithFilters from "./JadwalWithFilters";

// Rename to avoid conflict with type
const JadwalStats = JadwalStatsComponent;

type JadwalContainerProps = {
  user: SessionUser;
  stats: JadwalStatsType;
  jadwalList: JadwalPelatihan[];
};

export default function JadwalContainer({ user, stats, jadwalList }: JadwalContainerProps) {
  return (
    <>
      {/* Hero Section */}
      <JadwalHero user={user} />

      {/* Statistics Section */}
      <JadwalStats stats={stats} />

      {/* Filters and Jadwal List Section with Filters */}
      <JadwalWithFilters jadwalList={jadwalList} />
    </>
  );
}
