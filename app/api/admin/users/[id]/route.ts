import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

// GET - Get specific user
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Diubah ke Promise
) {
  try {
    const { id } = await params; // Wajib di-await
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("profil_pengguna")
      .select("*")
      .eq("id", id) // Gunakan id hasil await
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
  { params }: { params: Promise<{ id: string }> } // Diubah ke Promise
) {
  try {
    const { id } = await params; // Wajib di-await
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama_lengkap, email, peran, nomor_hp, bio, is_aktif } = body;

    if (!nama_lengkap || !email || !peran) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Update profile
    const { data, error } = await supabase
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
      .eq("id", id) // Gunakan id hasil await
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
  { params }: { params: Promise<{ id: string }> } // Diubah ke Promise
) {
  try {
    const { id } = await params; // Wajib di-await
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();

    // Get user profile to get user_id
    const { data: profileData, error: profileError } = await supabase
      .from("profil_pengguna")
      .select("user_id")
      .eq("id", id) // Gunakan id hasil await
      .single();

    if (profileError || !profileData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete profile first
    const { error: deleteProfileError } = await supabase
      .from("profil_pengguna")
      .delete()
      .eq("id", id); // Gunakan id hasil await

    if (deleteProfileError) {
      return NextResponse.json({ error: deleteProfileError.message }, { status: 400 });
    }

    // Delete auth user
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(profileData.user_id);

    if (deleteAuthError) {
      console.error("Failed to delete auth user:", deleteAuthError);
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}