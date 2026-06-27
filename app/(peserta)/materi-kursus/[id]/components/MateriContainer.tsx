import MateriHero from "./MateriHero";
import MateriList from "./MateriList";
import { SessionUser } from "@/contexts/AuthContext";

type MateriPelatihan = {
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

type PelatihanDetail = {
  id: string;
  judul: string;
  deskripsi: string;
  tipe_pelatihan: string;
};

type MateriContainerProps = {
  user: SessionUser;
  pelatihanDetail: PelatihanDetail;
  materiList: MateriPelatihan[];
};

export default function MateriContainer({ user, pelatihanDetail, materiList }: MateriContainerProps) {
  return (
    <>
      {/* Hero Section */}
      <MateriHero user={user} pelatihanDetail={pelatihanDetail} />

      {/* Materi List Section */}
      <MateriList materiList={materiList} pelatihanId={pelatihanDetail.id} />
    </>
  );
}
