// app/(peserta)/sertifikat/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/user";
import SertifikatContainer from "./components/SertifikatContainer";
import { redirect } from "next/navigation";
import { Tables } from "@/../types/database";
import type { SessionUser } from "@/contexts/AuthContext";
import { getCertificatePrice, isCourseCompleted } from "@/lib/certificates";
import { ensureCertificateForCourse } from "@/lib/certificate-generator";

export type CertificateWithCourse = Tables<"sertifikat"> & {
  pelatihan: Pick<Tables<"pelatihan">, "judul" | "kategori" | "tanggal_selesai"> | null;
};

export type CertificateClaim = {
  pelatihanId: string;
  judul: string;
  kategori: string;
  harga: number;
  status: "sertifikat_tersedia" | "termasuk_pelatihan_berbayar" | "tawarkan_pembelian" | "menunggu_pembayaran" | "menunggu_pelatihan_selesai" | "menunggu_evaluasi" | "tidak_lulus";
  certificateId: string | null;
  certificatePaymentStatus: "menunggu" | "berhasil" | "gagal" | "dikembalikan" | null;
};

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

  return (certificates as CertificateWithCourse[]).filter((certificate) => isCourseCompleted(certificate.pelatihan?.tanggal_selesai || null));
}

async function getCertificateClaims(profileId: string): Promise<CertificateClaim[]> {
  const supabase = await createSupabaseServerClient();
  const { data: registrations, error } = await supabase
    .from("pendaftaran_pelatihan")
    .select(
      `
      id,
      status,
      hasil_pelatihan (
        status_kelulusan
      ),
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

  if (pelatihanIds.length === 0) return [];

  const [{ data: certificates }, { data: payments }] = await Promise.all([
    supabase.from("sertifikat").select("id, pelatihan_id, status").eq("peserta_id", profileId).eq("status", "terbit").in("pelatihan_id", pelatihanIds),
    supabase.from("pembayaran").select("id, pelatihan_id, status_pembayaran, tipe_pembayaran").eq("pengguna_id", profileId).in("pelatihan_id", pelatihanIds).order("dibuat_pada", { ascending: false }),
  ]);

  const claims: CertificateClaim[] = [];

  for (const registration of allValidRegistrations) {
    const pelatihanData = Array.isArray(registration.pelatihan) ? registration.pelatihan[0] : registration.pelatihan;
    if (!pelatihanData) continue;

    const result = Array.isArray(registration.hasil_pelatihan) ? registration.hasil_pelatihan[0] : registration.hasil_pelatihan;
    const graduationStatus = result?.status_kelulusan || null;
    const hasPassed = graduationStatus === "lulus";
    const hasCourseCompleted = isCourseCompleted(pelatihanData.tanggal_selesai);
    let certificateId = certificates?.find((certificate) => certificate.pelatihan_id === pelatihanData.id)?.id || null;
    const coursePayment = payments?.find((payment) => payment.pelatihan_id === pelatihanData.id && payment.tipe_pembayaran === "pendaftaran_pelatihan" && payment.status_pembayaran === "berhasil");
    const certificatePayment = payments?.find((payment) => payment.pelatihan_id === pelatihanData.id && payment.tipe_pembayaran === "klaim_sertifikat");

    if (!certificateId && hasCourseCompleted && hasPassed && pelatihanData.harga > 0 && coursePayment) {
      try {
        certificateId = await ensureCertificateForCourse(profileId, pelatihanData.id);
      } catch (error) {
        console.error("Gagal memastikan sertifikat untuk pelatihan berbayar:", error);
      }
    }

    if (!certificateId && hasCourseCompleted && hasPassed && pelatihanData.harga === 0 && certificatePayment?.status_pembayaran === "berhasil") {
      try {
        certificateId = await ensureCertificateForCourse(profileId, pelatihanData.id);
      } catch (error) {
        console.error("Gagal memastikan sertifikat untuk pelatihan gratis:", error);
      }
    }

    let status: CertificateClaim["status"];
    if (!hasCourseCompleted) {
      status = "menunggu_pelatihan_selesai";
    } else if (certificateId) {
      status = "sertifikat_tersedia";
    } else if (!graduationStatus) {
      status = "menunggu_evaluasi";
    } else if (graduationStatus === "tidak_lulus") {
      status = "tidak_lulus";
    } else if (pelatihanData.harga > 0 && coursePayment) {
      status = "termasuk_pelatihan_berbayar";
    } else if (certificatePayment?.status_pembayaran === "menunggu") {
      status = "menunggu_pembayaran";
    } else {
      status = hasPassed ? "tawarkan_pembelian" : "menunggu_evaluasi";
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

export default async function SertifikatPage({ searchParams }: { searchParams: Promise<{ pelatihanId?: string }> }) {
  const userData = await getUserWithRole();

  if (!userData?.user || userData.role !== "peserta") {
    redirect("/login");
  }

  const { pelatihanId } = await searchParams;
  const profileId = userData.profile.id;
  const claims = await getCertificateClaims(profileId);
  const certificates = await getCertificates(profileId);
  const selectedClaim = pelatihanId ? claims.find((claim) => claim.pelatihanId === pelatihanId) || null : null;

  return <SertifikatContainer user={userData.user as SessionUser} certificates={certificates} claims={claims} selectedClaim={selectedClaim} certificatePrice={getCertificatePrice()} />;
}
