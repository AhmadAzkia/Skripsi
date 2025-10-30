import MateriHero from "./MateriHero";
import MateriList from "./MateriList";
import { SessionUser } from "@/contexts/AuthContext";

type MateriKursus = {
  id: string;
  judul: string;
  deskripsi: string;
  tipe_materi: string;
  urutan: number;
  konten: string;
  video_url?: string | null;
  file_attachment?: any;
  zoom_link?: string | null;
};

type KursusDetail = {
  id: string;
  judul: string;
  deskripsi: string;
  instruktur_nama: string;
  durasi_jam: number;
  tipe_kursus: string;
};

type MateriContainerProps = {
  user: SessionUser;
  kursusDetail: KursusDetail;
  materiList: MateriKursus[];
};

export default function MateriContainer({ user, kursusDetail, materiList }: MateriContainerProps) {
  return (
    <>
      {/* Hero Section */}
      <MateriHero user={user} kursusDetail={kursusDetail} />

      {/* Materi List Section */}
      <MateriList materiList={materiList} kursusId={kursusDetail.id} />
    </>
  );
}
