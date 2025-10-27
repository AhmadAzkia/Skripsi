import { getUserWithRole } from "@/lib/user"; // Asumsi helper ini ada
import { redirect } from "next/navigation";
import PesertaNavbar from "@/components/navbars/PesertaNavbar";
import Footer from "@/components/Footer";

export default async function PesertaLayout({ children }: { children: React.ReactNode }) {
  // 1. Ambil peran pengguna di server
  const { role } = await getUserWithRole();

  // 2. Lindungi layout ini. Jika bukan 'peserta', tendang ke login!
  if (role !== "peserta") {
    redirect("/login");
  }

  // 3. Jika lolos, render UI khusus peserta
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <PesertaNavbar />
      <main>
        {children} {/* 'children' adalah 7 halaman Anda */}
      </main>
      <Footer />
    </div>
  );
}
