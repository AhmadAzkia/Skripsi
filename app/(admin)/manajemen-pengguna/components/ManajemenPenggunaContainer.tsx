"use client";

import { SessionUser } from "@/contexts/AuthContext";
import { PenggunaData, PenggunaStats } from "../page";
import ManajemenPenggunaHero from "./ManajemenPenggunaHero";
import ManajemenPenggunaStatsComponent from "./ManajemenPenggunaStats";
import ManajemenPenggunaWithFilters from "./ManajemenPenggunaWithFilters";

// Rename to avoid conflict with type
const ManajemenPenggunaStats = ManajemenPenggunaStatsComponent;

type ManajemenPenggunaContainerProps = {
  user: SessionUser;
  stats: PenggunaStats;
  penggunaList: PenggunaData[];
};

export default function ManajemenPenggunaContainer({ user, stats, penggunaList }: ManajemenPenggunaContainerProps) {
  return (
    <>
      {/* Hero Section */}
      <ManajemenPenggunaHero user={user} />

      {/* Statistics Section */}
      <ManajemenPenggunaStats stats={stats} />

      {/* Filters and User List Section */}
      <ManajemenPenggunaWithFilters penggunaList={penggunaList} />
    </>
  );
}
