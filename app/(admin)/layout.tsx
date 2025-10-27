import { getUserWithRole } from "@/lib/user"; // Asumsi helper ini ada
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import AdminNavbar from "@/components/navbars/AdminNavbar";

export default async function PemateriLayout({ children }: { children: React.ReactNode }) {
  // 1. Ambil peran pengguna di server
  const { role } = await getUserWithRole();

  // 2. Lindungi layout ini. Jika bukan 'peserta', tendang ke login!
  if (role !== "admin") {
    redirect("/login");
  }

  // 3. Jika lolos, render UI khusus peserta
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <main>
        <AdminNavbar />
        {children} {/* 'children' adalah 7 halaman Anda */}
      </main>
      <Footer />
    </div>
  );
}
