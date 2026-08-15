export function getCertificatePrice() {
  const configuredPrice = Number(process.env.CERTIFICATE_PRICE || process.env.NEXT_PUBLIC_CERTIFICATE_PRICE || 50000);
  return Number.isFinite(configuredPrice) && configuredPrice > 0 ? configuredPrice : 50000;
}

export function getTodayDateOnly(timeZone = "Asia/Jakarta") {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return year && month && day ? `${year}-${month}-${day}` : new Date().toISOString().slice(0, 10);
}

export function isCourseCompleted(tanggalSelesai: string | null) {
  if (!tanggalSelesai) return false;
  return getTodayDateOnly() > tanggalSelesai.slice(0, 10);
}

export function createCertificateNumber(pelatihanId: string, pesertaId: string) {
  const year = new Date().getFullYear();
  return `CERT-CG-${year}-${pelatihanId.slice(0, 8).toUpperCase()}-${pesertaId.slice(0, 8).toUpperCase()}`;
}
