import MateriHero from "./MateriHero";
import MateriStats from "./MateriStats";
import MateriFilters from "./MateriFilters";
import MateriList from "./MateriList";
import { SessionUser } from "@/contexts/AuthContext";

type MateriKursus = {
  id: string;
  judul: string;
  deskripsi: string | null;
  tipe_materi: "pdf" | "ppt";
  file_url: string | null;
  zoom_link: string | null;
  urutan: number | null;
  kursus: {
    id: string;
    judul: string;
  };
  progress: {
    persentase_progress: number | null;
    selesai_pada: string | null;
  } | null;
};

type MateriStats = {
  totalMateriCount: number;
  materiSelesaiCount: number;
  materiSedangBelajarCount: number;
  totalKursusCount: number;
};

type Kursus = {
  id: string;
  judul: string;
};

type MateriContainerProps = {
  user: SessionUser;
  stats: MateriStats;
  materiList: MateriKursus[];
  kursusOptions: Kursus[];
};

export default function MateriContainer({ user, stats, materiList, kursusOptions }: MateriContainerProps) {
  return (
    <>
      {/* Hero Section with personalized greeting */}
      <MateriHero user={user} />

      {/* Statistics Section */}
      <MateriStats stats={stats} />

      {/* Filters Section */}
      <MateriFilters kursusOptions={kursusOptions} />

      {/* Materi List Section */}
      <MateriList materiList={materiList} />
    </>
  );
}
