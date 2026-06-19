import fs from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createCertificateNumber } from "@/lib/certificates";

type KoordinatField = {
  x: number;
  y: number;
  fontSize?: number;
  size?: number;
};

type TemplateKoordinat = {
  nama: KoordinatField;
  nomor_sertifikat: KoordinatField;
  tanggal: KoordinatField;
  judul_pelatihan: KoordinatField;
  qr_code: KoordinatField;
};

type CertificatePdfData = {
  certificateNumber: string;
  participantName: string;
  courseTitle: string;
  category: string;
  issuedAt: string;
  verificationUrl: string;
  templateBytes?: Uint8Array;
  koordinat?: TemplateKoordinat;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function splitText(text: string, maxLength: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length > maxLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

async function createCertificatePdf(data: CertificatePdfData) {
  let pdfDoc: PDFDocument;

  if (data.templateBytes) {
    pdfDoc = await PDFDocument.load(data.templateBytes);
  } else {
    pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const navy = rgb(0, 18 / 255, 51 / 255);
    const gold = rgb(214 / 255, 163 / 255, 59 / 255);
    const gray = rgb(90 / 255, 90 / 255, 90 / 255);

    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.98, 0.96, 0.9) });
    page.drawRectangle({ x: 32, y: 32, width: width - 64, height: height - 64, borderColor: gold, borderWidth: 4 });
    page.drawRectangle({ x: 46, y: 46, width: width - 92, height: height - 92, borderColor: navy, borderWidth: 1 });

    try {
      const logoPath = path.join(process.cwd(), "public", "CertiGuardia.png");
      const logoBytes = await fs.readFile(logoPath);
      const logo = await pdfDoc.embedPng(logoBytes);
      const logoWidth = 82;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      page.drawImage(logo, { x: width / 2 - logoWidth / 2, y: height - 118, width: logoWidth, height: logoHeight });
    } catch {
      page.drawText("CertiGuardia", { x: width / 2 - 62, y: height - 95, size: 18, font: boldFont, color: navy });
    }

    page.drawText("SERTIFIKAT", { x: width / 2 - boldFont.widthOfTextAtSize("SERTIFIKAT", 34) / 2, y: height - 165, size: 34, font: boldFont, color: navy });
    page.drawText("Diberikan kepada", { x: width / 2 - 64, y: height - 205, size: 14, font, color: gray });

    const participantName = data.participantName.toUpperCase();
    page.drawText(participantName, { x: width / 2 - boldFont.widthOfTextAtSize(participantName, 30) / 2, y: height - 255, size: 30, font: boldFont, color: navy });
    page.drawLine({ start: { x: 200, y: height - 270 }, end: { x: width - 200, y: height - 270 }, thickness: 1, color: gold });

    page.drawText("Atas keberhasilannya menyelesaikan pelatihan", { x: width / 2 - 147, y: height - 310, size: 14, font, color: gray });

    const courseLines = splitText(data.courseTitle, 58).slice(0, 2);
    courseLines.forEach((line, index) => {
      page.drawText(line, { x: width / 2 - boldFont.widthOfTextAtSize(line, 21) / 2, y: height - 345 - index * 28, size: 21, font: boldFont, color: navy });
    });

    page.drawText(`Kategori: ${data.category}`, { x: width / 2 - 80, y: 165, size: 12, font, color: gray });
    page.drawText(`Tanggal Terbit: ${formatDate(data.issuedAt)}`, { x: 90, y: 95, size: 11, font, color: gray });
    page.drawText(`Nomor: ${data.certificateNumber}`, { x: 90, y: 75, size: 11, font, color: gray });

    const qrDataUrl = await QRCode.toDataURL(data.verificationUrl, { margin: 1, width: 110 });
    const qrImage = await pdfDoc.embedPng(qrDataUrl);
    page.drawImage(qrImage, { x: width - 180, y: 67, width: 82, height: 82 });
    page.drawText("Verifikasi", { x: width - 166, y: 52, size: 10, font, color: gray });

    return pdfDoc.save();
  }

  // Template-based generation
  const pages = pdfDoc.getPages();
  const page = pages[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0, 18 / 255, 51 / 255);
  const gray = rgb(90 / 255, 90 / 255, 90 / 255);
  const k = data.koordinat!;

  const nameText = data.participantName.toUpperCase();
  const nameFontSize = k.nama.fontSize || 30;
  page.drawText(nameText, {
    x: k.nama.x - boldFont.widthOfTextAtSize(nameText, nameFontSize) / 2,
    y: k.nama.y,
    size: nameFontSize,
    font: boldFont,
    color: navy,
  });

  const numFontSize = k.nomor_sertifikat.fontSize || 11;
  page.drawText(`Nomor: ${data.certificateNumber}`, {
    x: k.nomor_sertifikat.x,
    y: k.nomor_sertifikat.y,
    size: numFontSize,
    font,
    color: gray,
  });

  const dateFontSize = k.tanggal.fontSize || 11;
  page.drawText(`Tanggal Terbit: ${formatDate(data.issuedAt)}`, {
    x: k.tanggal.x,
    y: k.tanggal.y,
    size: dateFontSize,
    font,
    color: gray,
  });

  const titleFontSize = k.judul_pelatihan.fontSize || 21;
  const courseLines = splitText(data.courseTitle, 58).slice(0, 2);
  courseLines.forEach((line, index) => {
    page.drawText(line, {
      x: k.judul_pelatihan.x - boldFont.widthOfTextAtSize(line, titleFontSize) / 2,
      y: k.judul_pelatihan.y - index * (titleFontSize + 7),
      size: titleFontSize,
      font: boldFont,
      color: navy,
    });
  });

  const qrSize = k.qr_code.size || 82;
  const qrDataUrl = await QRCode.toDataURL(data.verificationUrl, { margin: 1, width: 110 });
  const qrImage = await pdfDoc.embedPng(qrDataUrl);
  page.drawImage(qrImage, {
    x: k.qr_code.x - qrSize / 2,
    y: k.qr_code.y - qrSize / 2,
    width: qrSize,
    height: qrSize,
  });

  return pdfDoc.save();
}

export async function generateAndUploadCertificate(certificateId: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diisi. Generator sertifikat membutuhkan akses server-side.");
  }

  const { data: certificate, error } = await supabase
    .from("sertifikat")
    .select(
      `
      id,
      peserta_id,
      kursus_id,
      template_id,
      nomor_sertifikat,
      tanggal_terbit,
      peserta:peserta_id (
        nama_lengkap,
        email
      ),
      kursus:kursus_id (
        judul,
        kategori
      )
    `,
    )
    .eq("id", certificateId)
    .single();

  if (error || !certificate) {
    throw new Error(`Data sertifikat tidak ditemukan: ${error?.message || certificateId}`);
  }

  const peserta = Array.isArray(certificate.peserta) ? certificate.peserta[0] : certificate.peserta;
  const kursus = Array.isArray(certificate.kursus) ? certificate.kursus[0] : certificate.kursus;

  if (!peserta || !kursus) {
    throw new Error("Data peserta atau kursus untuk sertifikat tidak lengkap.");
  }

  let templateBytes: Uint8Array | undefined;
  let koordinat: TemplateKoordinat | undefined;

  if (certificate.template_id) {
    const { data: template } = await supabase
      .from("template_sertifikat")
      .select("file_path, koordinat")
      .eq("id", certificate.template_id)
      .single();

    if (template) {
      const bucket = process.env.SUPABASE_CERTIFICATE_BUCKET || "certificates";
      const { data: fileData } = await supabase.storage.from(bucket).download(template.file_path);
      if (fileData) {
        templateBytes = new Uint8Array(await fileData.arrayBuffer());
        koordinat = template.koordinat as TemplateKoordinat;
      }
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const pdfBytes = await createCertificatePdf({
    certificateNumber: certificate.nomor_sertifikat,
    participantName: peserta.nama_lengkap || peserta.email,
    courseTitle: kursus.judul,
    category: kursus.kategori,
    issuedAt: certificate.tanggal_terbit,
    verificationUrl: `${siteUrl}/sertifikat/validasi/${certificate.id}`,
    templateBytes,
    koordinat,
  });

  const bucket = process.env.SUPABASE_CERTIFICATE_BUCKET || "certificates";
  const filePath = `${certificate.peserta_id}/${certificate.kursus_id}/${certificate.id}.pdf`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, pdfBytes, {
    contentType: "application/pdf",
    upsert: true,
  });

  if (uploadError) {
    throw new Error(`Gagal upload sertifikat: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
  const certificateUrl = publicUrlData.publicUrl;
  const { error: updateError } = await supabase
    .from("sertifikat")
    .update({
      sertifikat_url: certificateUrl,
      diperbarui_pada: new Date().toISOString(),
    })
    .eq("id", certificate.id);

  if (updateError) {
    throw new Error(`Gagal update URL sertifikat: ${updateError.message}`);
  }

  return certificateUrl;
}

export async function ensureCertificateForCourse(profileId: string, kursusId: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diisi. Generator sertifikat membutuhkan akses server-side.");
  }

  const { data: existingCertificate, error: existingCertificateError } = await supabase.from("sertifikat").select("id, sertifikat_url").eq("peserta_id", profileId).eq("kursus_id", kursusId).maybeSingle();

  if (existingCertificateError) {
    throw new Error(`Gagal memeriksa sertifikat yang sudah ada: ${existingCertificateError.message}`);
  }

  if (existingCertificate) {
    if (!existingCertificate.sertifikat_url) {
      await generateAndUploadCertificate(existingCertificate.id);
    }

    return existingCertificate.id;
  }

  const { data: certificate, error } = await supabase
    .from("sertifikat")
    .insert({
      kursus_id: kursusId,
      peserta_id: profileId,
      nomor_sertifikat: createCertificateNumber(kursusId, profileId),
      status: "terbit",
      tanggal_terbit: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !certificate) {
    throw new Error(`Gagal membuat sertifikat: ${error?.message || "data kosong"}`);
  }

  await generateAndUploadCertificate(certificate.id);

  return certificate.id;
}
