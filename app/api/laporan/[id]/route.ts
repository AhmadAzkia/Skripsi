import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUserWithRole } from "@/lib/user";

// GET - Get specific report by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // In real implementation, query specific report from database
    // For now, return mock data
    const mockLaporan = {
      id: id,
      judul: "Laporan Sample",
      tipe_laporan: "keuangan",
      periode_mulai: "2024-01-01",
      periode_selesai: "2024-12-31",
      status: "aktif",
      dibuat_pada: "2024-01-01T10:00:00Z",
      diperbarui_pada: null,
      dibuat_oleh: user.profile.id,
      file_url: null,
      keterangan: "Sample report",
    };

    return NextResponse.json(mockLaporan);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update specific report
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { judul, tipe_laporan, periode_mulai, periode_selesai, status, keterangan, file_url } = body;

    // In real implementation, update report in database
    const updatedLaporan = {
      id,
      judul,
      tipe_laporan,
      periode_mulai,
      periode_selesai,
      status,
      dibuat_pada: "2024-01-01T10:00:00Z", // Keep original
      diperbarui_pada: new Date().toISOString(),
      dibuat_oleh: user.profile.id,
      file_url: file_url || null,
      keterangan: keterangan || null,
    };

    return NextResponse.json(updatedLaporan);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete specific report
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserWithRole();

    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // In real implementation, delete report from database
    // const supabase = await createSupabaseServerClient();
    // const { error } = await supabase
    //   .from("laporan")
    //   .delete()
    //   .eq("id", id);

    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }

    // Simulate successful deletion
    return NextResponse.json({
      message: "Report deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
