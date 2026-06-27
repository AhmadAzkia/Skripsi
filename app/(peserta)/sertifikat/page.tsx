// app/(peserta)/sertifikat/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import SertifikatContainer from "./components/SertifikatContainer";
import { redirect } from "next/navigation";
import { Tables } from "@/../types/database";
import type { SessionUser } from "@/contexts/AuthContext";
import { getCertificatePrice } from "@/lib/certificates";
import { ensureCertificateForCourse } from "@/lib/certificate-generator";

export type CertificateWithCourse = Tables<"sertifikat"> & {
  pelatihan: Pick<Tables<"pelatihan">, "judul" | "kategori" | "tanggal_selesai"> | null;
};

export type CertificateClaim = {
  pelatihanId: string;
  judul: string;
  kategori: string;
  harga: number;
  status: "sertifikat_tersedia" | "termasuk_pelatihan_berbayar" | "tawarkan_pembelian" | "menunggu_pembayaran";
  certificateId: string | null;
  certificatePaymentStatus: "menunggu" | "berhasil" | "gagal" | "dikembalikan" | null;
};

type SertifikatStats = {
  totalSertifikat: number;
  sertifikatBulanIni: number;
  kategoriTerlengkap: string;
  rataRataNilai: number;
};

function isCourseCompleted(tanggalSelesai: string | null, registrationStatus: string) {
  if (registrationStatus === "selesai") return true;
  if (!tanggalSelesai) return false;
  const today = new Date().toISOString().split("T")[0];
  return today > tanggalSelesai;
}

async function getCertificates(profileId: string): Promise<CertificateWithCourse[]> {
  const supabase = await createSupabaseServerClient();
  const { data: certificates, error } = await supabase
    .from("sertifikat")
    .select(
      `
      *,
      pelatihan ( judul, kategori, tanggal_selesai )
    `,
    )
    .eq("peserta_id", profileId)
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data sertifikat:", error.message);
    return [];
  }

  // Only show certificates for completed courses
  const today = new Date().toISOString().split("T")[0];
  const filtered = certificates.filter((cert) => {
    if (!cert.pelatihan?.tanggal_selesai) return true;
    return today > cert.pelatihan.tanggal_selesai;
  });

  return filtered as CertificateWithCourse[];
}

async function getCertificateClaims(profileId: string): Promise<CertificateClaim[]> {
  const supabase = await createSupabaseServerClient();
  const { data: registrations, error } = await supabase
    .from("pendaftaran_pelatihan")
    .select(
      `
      id,
      status,
      pelatihan:pelatihan_id (
        id,
        judul,
        kategori,
        harga,
        tanggal_selesai
      )
    `,
    )
    .eq("pengguna_id", profileId)
    .not("status", "eq", "dibatalkan");

  if (error || !registrations) {
    console.error("Gagal mengambil daftar klaim sertifikat:", error?.message);
    return [];
  }

  // All registrations with a valid course
  const allValidRegistrations = registrations.filter((registration) => {
    const pelatihanData = Array.isArray(registration.pelatihan) ? registration.pelatihan[0] : registration.pelatihan;
    return !!pelatihanData;
  });

  const pelatihanIds = allValidRegistrations.map((registration) => {
    const pelatihanData = Array.isArray(registration.pelatihan) ? registration.pelatihan[0] : registration.pelatihan;
    return pelatihanData!.id;
  });

  const [{ data: certificates }, { data: payments }] = await Promise.all([
    supabase.from("sertifikat").select("id, pelatihan_id").eq("peserta_id", profileId).in("pelatihan_id", pelatihanIds),
    supabase.from("pembayaran").select("id, pelatihan_id, status_pembayaran, tipe_pembayaran").eq("pengguna_id", profileId).in("pelatihan_id", pelatihanIds).order("dibuat_pada", { ascending: false }),
  ]);

  const claims: CertificateClaim[] = [];

  for (const registration of allValidRegistrations) {
    const pelatihanData = Array.isArray(registration.pelatihan) ? registration.pelatihan[0] : registration.pelatihan;
    if (!pelatihanData) continue;

    const isCompleted = isCourseCompleted(pelatihanData.tanggal_selesai, registration.status);
    let certificateId = certificates?.find((certificate) => certificate.pelatihan_id === pelatihanData.id)?.id || null;
    const coursePayment = payments?.find((payment) => payment.pelatihan_id === pelatihanData.id && payment.tipe_pembayaran === "pendaftaran_pelatihan" && payment.status_pembayaran === "berhasil");
    const certificatePayment = payments?.find((payment) => payment.pelatihan_id === pelatihanData.id && payment.tipe_pembayaran === "klaim_sertifikat");

    // Auto-generate certificate only if course is completed
    if (!certificateId && isCompleted && pelatihanData.harga > 0 && coursePayment) {
      try {
        certificateId = await ensureCertificateForCourse(profileId, pelatihanData.id);
      } catch (error) {
        console.error("Gagal memastikan sertifikat untuk pelatihan berbayar:", error);
      }
    }

    if (!certificateId && isCompleted && pelatihanData.harga === 0 && certificatePayment?.status_pembayaran === "berhasil") {
      try {
        certificateId = await ensureCertificateForCourse(profileId, pelatihanData.id);
      } catch (error) {
        console.error("Gagal memastikan sertifikat untuk pelatihan gratis:", error);
      }
    }

    // Determine status based on certificate existence, not course completion
    let status: CertificateClaim["status"];
    if (certificateId) {
      status = "sertifikat_tersedia";
    } else if (isCompleted && pelatihanData.harga > 0) {
      status = "termasuk_pelatihan_berbayar";
    } else if (!isCompleted && pelatihanData.harga > 0 && coursePayment) {
      status = "termasuk_pelatihan_berbayar";
    } else if (certificatePayment?.status_pembayaran === "menunggu") {
      status = "menunggu_pembayaran";
    } else {
      status = "tawarkan_pembelian";
    }

    claims.push({
      pelatihanId: pelatihanData.id,
      judul: pelatihanData.judul,
      kategori: pelatihanData.kategori,
      harga: pelatihanData.harga,
      status,
      certificateId,
      certificatePaymentStatus: certificatePayment?.status_pembayaran || null,
    });
  }

  return claims;
}

function getSertifikatStats(certificates: CertificateWithCourse[]): SertifikatStats {
  const totalSertifikat = certificates.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const sertifikatBulanIni = certificates.filter((cert) => {
    const certDate = new Date(cert.tanggal_terbit);
    return certDate.getMonth() === currentMonth && certDate.getFullYear() === currentYear;
  }).length;
  const kategoriCount: Record<string, number> = {};

  certificates.forEach((cert) => {
    const kategori = cert.pelatihan?.kategori || "Lainnya";
    kategoriCount[kategori] = (kategoriCount[kategori] || 0) + 1;
  });

  const kategoriTerlengkap = Object.keys(kategoriCount).length > 0 ? Object.keys(kategoriCount).reduce((a, b) => (kategoriCount[a] > kategoriCount[b] ? a : b)) : "Belum Ada";

  return {
    totalSertifikat,
    sertifikatBulanIni,
    kategoriTerlengkap,
    rataRataNilai: totalSertifikat > 0 ? 85 : 0,
  };
}

export default async function SertifikatPage({ searchParams }: { searchParams: Promise<{ pelatihanId?: string }> }) {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  const { pelatihanId } = await searchParams;
  const profileId = userData.profile.id;
  const claims = await getCertificateClaims(profileId);
  const certificates = await getCertificates(profileId);
  const stats = getSertifikatStats(certificates);
  const selectedClaim = pelatihanId ? claims.find((claim) => claim.pelatihanId === pelatihanId) || null : null;

  return <SertifikatContainer user={userData.user as SessionUser} certificates={certificates} stats={stats} claims={claims} selectedClaim={selectedClaim} certificatePrice={getCertificatePrice()} />;
}
