import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materi Kursus | CertiGuardia",
  description: "Pelajari materi kursus dan tingkatkan kemampuan Anda",
};

export default function MateriKursusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
