import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/contexts/AuthContext";
import BlogPemateriContainer from "./components/BlogPemateriContainer";

export default async function BlogPemateriPage() {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      redirect("/login");
    }

    // Get user profile data
    const { data: userData, error: profileError } = await supabase.from("profil_pengguna").select("*").eq("user_id", user.id).single();

    if (profileError || !userData) {
      console.error("Error fetching user profile:", profileError);
      redirect("/login");
    }

    // Check if user is instructor
    if (userData.peran !== "instruktur") {
      redirect("/dashboard"); // Redirect non-instructors
    }

    const sessionUser: SessionUser = {
      ...user,
      profile: userData,
    };

    return <BlogPemateriContainer user={sessionUser} />;
  } catch (error) {
    console.error("Error in BlogPemateriPage:", error);
    redirect("/login");
  }
}
