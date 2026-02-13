import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUserWithRole } from "@/lib/user";

// GET - Get all reports
export async function GET() {
  try {
    const user = await getUserWithRole();
    
    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock data since we don't have a reports table
    // In real implementation, query from reports table
    const mockLaporanList = [
      {
        id: "1",
        judul: "Laporan Keuangan Q4 2024",
        tipe_laporan: "keuangan",
        periode_mulai: "2024-10-01",
        periode_selesai: "2024-12-31",
        status: "selesai",
        dibuat_pada: "2024-11-01T10:00:00Z",
        diperbarui_pada: "2024-11-15T14:30:00Z",
        dibuat_oleh: user.profile.id,
        file_url: "/reports/keuangan-q4-2024.pdf",
        keterangan: "Laporan keuangan triwulan keempat tahun 2024",
      },
      {
        id: "2",
        judul: "Laporan Peserta November 2024",
        tipe_laporan: "peserta",
        periode_mulai: "2024-11-01",
        periode_selesai: "2024-11-30",
        status: "aktif",
        dibuat_pada: "2024-11-20T09:15:00Z",
        diperbarui_pada: null,
        dibuat_oleh: user.profile.id,
        file_url: null,
        keterangan: "Laporan data peserta bulan November",
      },
    ];

    return NextResponse.json(mockLaporanList);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new report
export async function POST(request: NextRequest) {
  try {
    const user = await getUserWithRole();
    
    if (!user || user.profile?.peran !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      judul, 
      tipe_laporan, 
      periode_mulai, 
      periode_selesai, 
      status = "draft", 
      keterangan,
      file_url 
    } = body;

    // Validate required fields
    if (!judul || !tipe_laporan || !periode_mulai || !periode_selesai) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // In real implementation, insert into reports table
    const newLaporan = {
      id: `report-${Date.now()}`,
      judul,
      tipe_laporan,
      periode_mulai,
      periode_selesai,
      status,
      dibuat_pada: new Date().toISOString(),
      diperbarui_pada: null,
      dibuat_oleh: user.profile.id,
      file_url: file_url || null,
      keterangan: keterangan || null,
    };

    // Simulate successful creation
    return NextResponse.json(newLaporan, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}