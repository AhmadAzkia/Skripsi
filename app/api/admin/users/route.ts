import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserWithRole } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all users
export async function GET() {
  try {
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("profil_pengguna").select("*").order("dibuat_pada", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama_lengkap, email, peran, nomor_hp, bio } = body;

    if (!nama_lengkap || !email || !peran) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const admin = createSupabaseAdminClient();

    if (!admin) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum diisi." }, { status: 500 });
    }

    // Create auth user first
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: "TempPassword123!", // Temporary password
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from("profil_pengguna")
      .insert({
        user_id: authData.user.id,
        nama_lengkap,
        email,
        peran,
        nomor_hp: nomor_hp || null,
        bio: bio || null,
        is_aktif: true,
      })
      .select()
      .single();

    if (profileError) {
      // Cleanup auth user if profile creation fails
      await admin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ data: profileData });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
