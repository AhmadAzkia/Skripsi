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
  kursus: Pick<Tables<"kursus">, "judul" | "kategori"> | null;
};

export type CertificateClaim = {
  kursusId: string;
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
      kursus ( judul, kategori )
    `,
    )
    .eq("peserta_id", profileId)
    .eq("status", "terbit")
    .order("tanggal_terbit", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data sertifikat:", error.message);
    return [];
  }

  return certificates as CertificateWithCourse[];
}

async function getCertificateClaims(profileId: string): Promise<CertificateClaim[]> {
  const supabase = await createSupabaseServerClient();
  const { data: registrations, error } = await supabase
    .from("pendaftaran_kursus")
    .select(
      `
      id,
      status,
      kursus:kursus_id (
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

  const completedRegistrations = registrations.filter((registration) => {
    const kursus = Array.isArray(registration.kursus) ? registration.kursus[0] : registration.kursus;
    return kursus && isCourseCompleted(kursus.tanggal_selesai, registration.status);
  });

  if (completedRegistrations.length === 0) {
    return [];
  }

  const kursusIds = completedRegistrations.map((registration) => {
    const kursus = Array.isArray(registration.kursus) ? registration.kursus[0] : registration.kursus;
    return kursus!.id;
  });

  const [{ data: certificates }, { data: payments }] = await Promise.all([
    supabase.from("sertifikat").select("id, kursus_id").eq("peserta_id", profileId).in("kursus_id", kursusIds),
    supabase.from("pembayaran").select("id, kursus_id, status_pembayaran, tipe_pembayaran").eq("pengguna_id", profileId).in("kursus_id", kursusIds).order("dibuat_pada", { ascending: false }),
  ]);

  const claims: CertificateClaim[] = [];

  for (const registration of completedRegistrations) {
    const kursus = Array.isArray(registration.kursus) ? registration.kursus[0] : registration.kursus;
    if (!kursus) continue;

    let certificateId = certificates?.find((certificate) => certificate.kursus_id === kursus.id)?.id || null;
    const coursePayment = payments?.find((payment) => payment.kursus_id === kursus.id && payment.tipe_pembayaran === "pendaftaran_kursus" && payment.status_pembayaran === "berhasil");
    const certificatePayment = payments?.find((payment) => payment.kursus_id === kursus.id && payment.tipe_pembayaran === "klaim_sertifikat");

    if (!certificateId && kursus.harga > 0 && coursePayment) {
      try {
        certificateId = await ensureCertificateForCourse(profileId, kursus.id);
      } catch (error) {
        console.error("Gagal memastikan sertifikat untuk kursus berbayar:", error);
      }
    }

    if (!certificateId && kursus.harga === 0 && certificatePayment?.status_pembayaran === "berhasil") {
      try {
        certificateId = await ensureCertificateForCourse(profileId, kursus.id);
      } catch (error) {
        console.error("Gagal memastikan sertifikat untuk kursus gratis:", error);
      }
    }

    const status: CertificateClaim["status"] = certificateId ? "sertifikat_tersedia" : kursus.harga > 0 ? "termasuk_pelatihan_berbayar" : certificatePayment?.status_pembayaran === "menunggu" ? "menunggu_pembayaran" : "tawarkan_pembelian";

    claims.push({
      kursusId: kursus.id,
      judul: kursus.judul,
      kategori: kursus.kategori,
      harga: kursus.harga,
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
    const kategori = cert.kursus?.kategori || "Lainnya";
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

export default async function SertifikatPage({ searchParams }: { searchParams: Promise<{ kursusId?: string }> }) {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  const { kursusId } = await searchParams;
  const profileId = userData.profile.id;
  const claims = await getCertificateClaims(profileId);
  const certificates = await getCertificates(profileId);
  const stats = getSertifikatStats(certificates);
  const selectedClaim = kursusId ? claims.find((claim) => claim.kursusId === kursusId) || null : null;

  return <SertifikatContainer user={userData.user as SessionUser} certificates={certificates} stats={stats} claims={claims} selectedClaim={selectedClaim} certificatePrice={getCertificatePrice()} />;
}
