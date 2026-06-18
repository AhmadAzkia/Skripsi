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

    const admin = createSupabaseAdminClient();

    if (!admin) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum diisi." }, { status: 500 });
    }

    const { data, error } = await admin.from("profil_pengguna").select("*").order("dibuat_pada", { ascending: false });

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
    const { nama_lengkap, email, peran, nomor_hp, bio, password } = body;

    console.log("[POST /api/admin/users] Received body:", JSON.stringify({ nama_lengkap, email, peran, nomor_hp, bio, hasPassword: !!password }));

    if (!nama_lengkap || !email || !peran) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validasi password
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password wajib diisi minimal 8 karakter" }, { status: 400 });
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

    // 1. Buat auth user baru (atau ambil yang sudah ada jika email sudah terdaftar di auth)
    console.log("[POST /api/admin/users] Step 1: Creating auth user for:", email);
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("[POST /api/admin/users] Auth user creation failed:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    console.log("[POST /api/admin/users] Auth user created/existing:", authData.user.id);

    // 2. Cek apakah sudah ada profile untuk user_id ini
    //    (Trigger DB bisa auto-insert profile saat auth user dibuat)
    console.log("[POST /api/admin/users] Step 2: Checking existing profile for user_id:", authData.user.id);
    const { data: existingProfile, error: checkError } = await admin
      .from("profil_pengguna")
      .select("id")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (checkError) {
      console.error("[POST /api/admin/users] Profile check error:", checkError.message);
    }

    let profileData;

    if (existingProfile) {
      // Profile sudah ada (dari trigger DB) → update field-nya
      console.log("[POST /api/admin/users] Profile exists from trigger, updating:", existingProfile.id);
      const { data: updatedProfile, error: updateError } = await admin
        .from("profil_pengguna")
        .update({
          nama_lengkap,
          email,
          peran,
          nomor_hp: nomor_hp || null,
          bio: bio || null,
          is_aktif: true,
        })
        .eq("id", existingProfile.id)
        .select()
        .single();

      if (updateError) {
        console.error("[POST /api/admin/users] Profile update error:", JSON.stringify(updateError));
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      profileData = updatedProfile;
    } else {
      // Profile belum ada → insert baru
      console.log("[POST /api/admin/users] Step 3: Inserting profile for user_id:", authData.user.id);
      const { data: newProfile, error: insertError } = await admin
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

      if (insertError) {
        console.error("[POST /api/admin/users] Profile insert error:", JSON.stringify(insertError));
        await admin.auth.admin.deleteUser(authData.user.id);
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }

      profileData = newProfile;
    }

    console.log("[POST /api/admin/users] Profile saved:", JSON.stringify({ id: profileData.id, nama_lengkap: profileData.nama_lengkap, nomor_hp: profileData.nomor_hp, email: profileData.email }));

    return NextResponse.json({ data: profileData });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
