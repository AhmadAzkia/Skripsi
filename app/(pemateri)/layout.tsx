import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Footer from "../components/Footer";
import PemateriNavbar from "../components/navbars/PemateriNavbar";

export default async function PemateriLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase.from("profil_pengguna").select("*").eq("user_id", user.id).single();

  // Check if user is pemateri
  if (!profile || profile.peran !== "instruktur") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-gray-50">
      <PemateriNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
