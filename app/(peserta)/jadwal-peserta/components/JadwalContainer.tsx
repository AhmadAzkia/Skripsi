import JadwalHero from "./JadwalHero";
import JadwalStats from "./JadwalStats";
import JadwalFilters from "./JadwalFilters";
import JadwalList from "./JadwalList";
import { SessionUser } from "@/contexts/AuthContext";

type JadwalPelatihan = {
  id: string;
  kursus_id: string;
  judul: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  tipe_kursus: string;
  durasi_jam: number;
  instruktur: string;
  persentase_progress: number;
};

type JadwalStats = {
  totalJadwal: number;
  jadwalBerlangsung: number;
  jadwalSelesai: number;
  jadwalMendatang: number;
};

type JadwalContainerProps = {
  user: SessionUser;
  stats: JadwalStats;
  jadwalList: JadwalPelatihan[];
};

export default function JadwalContainer({ user, stats, jadwalList }: JadwalContainerProps) {
  return (
    <>
      {/* Hero Section */}
      <JadwalHero user={user} />

      {/* Statistics Section */}
      <JadwalStats stats={stats} />

      {/* Filters Section */}
      <JadwalFilters />

      {/* Jadwal List Section */}
      <JadwalList jadwalList={jadwalList} />
    </>
  );
}
