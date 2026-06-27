export function getCertificatePrice() {
  const configuredPrice = Number(process.env.CERTIFICATE_PRICE || process.env.NEXT_PUBLIC_CERTIFICATE_PRICE || 50000);
  return Number.isFinite(configuredPrice) && configuredPrice > 0 ? configuredPrice : 50000;
}

export function createCertificateNumber(pelatihanId: string, pesertaId: string) {
  const year = new Date().getFullYear();
  return `CERT-CG-${year}-${pelatihanId.slice(0, 8).toUpperCase()}-${pesertaId.slice(0, 8).toUpperCase()}`;
}
