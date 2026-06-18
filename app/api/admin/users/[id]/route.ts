import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getUserWithRole } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

// GET - Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();

    if (!admin) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum diisi." }, { status: 500 });
    }

    const { data, error } = await admin
      .from("profil_pengguna")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama_lengkap, email, peran, nomor_hp, bio, is_aktif } = body;

    if (!nama_lengkap || !email || !peran) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validasi peran sesuai enum DB
    const validPeran = ["admin", "peserta"];
    if (!validPeran.includes(peran)) {
      return NextResponse.json({ error: "Peran tidak valid. Gunakan: admin atau peserta" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    if (!admin) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum diisi." }, { status: 500 });
    }

    // Update profile (pakai admin client untuk bypass RLS)
    const { data, error } = await admin
      .from("profil_pengguna")
      .update({
        nama_lengkap,
        email,
        peran,
        nomor_hp: nomor_hp || null,
        bio: bio || null,
        is_aktif: is_aktif ?? true,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("[DELETE /api/admin/users] Deleting user with id:", id);

    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      console.log("[DELETE /api/admin/users] Auth failed:", { hasUser: !!user, peran: user?.profile?.peran });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();

    if (!admin) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum diisi." }, { status: 500 });
    }

    // Get user profile to get user_id (pakai admin client)
    const { data: profileData, error: profileError } = await admin
      .from("profil_pengguna")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();

    if (profileError) {
      console.error("[DELETE /api/admin/users] Profile lookup error:", JSON.stringify(profileError));
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profileData) {
      console.log("[DELETE /api/admin/users] Profile not found for id:", id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[DELETE /api/admin/users] Found profile, user_id:", profileData.user_id);

    // Delete profile first
    const { error: deleteProfileError } = await admin
      .from("profil_pengguna")
      .delete()
      .eq("id", id);

    if (deleteProfileError) {
      console.error("[DELETE /api/admin/users] Profile delete error:", JSON.stringify(deleteProfileError));
      return NextResponse.json({ error: deleteProfileError.message }, { status: 400 });
    }

    // Delete auth user
    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(profileData.user_id);

    if (deleteAuthError) {
      console.error("[DELETE /api/admin/users] Auth user delete error:", deleteAuthError.message);
    } else {
      console.log("[DELETE /api/admin/users] Auth user deleted successfully");
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/users] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
