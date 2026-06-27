import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materi Pelatihan | CertiGuardia",
  description: "Pelajari materi pelatihan dan tingkatkan kemampuan Anda",
};

export default function MateriKursusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
