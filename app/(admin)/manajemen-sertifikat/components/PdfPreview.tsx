"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

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

interface PdfPreviewProps {
  file: File | null;
  koordinat: TemplateKoordinat;
}

export default function PdfPreview({ file, koordinat }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !canvasRef.current) return;

    const renderPdf = async () => {
      try {
        setError(null);
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        setPdfDimensions({ width: viewport.width, height: viewport.height });

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        setError("Gagal render preview PDF.");
        console.error(err);
      }
    };

    renderPdf();
  }, [file]);

  if (!file) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Pilih file PDF untuk melihat preview
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <canvas ref={canvasRef} className="w-full h-auto" />
      {pdfDimensions && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {Math.round(pdfDimensions.width)} x {Math.round(pdfDimensions.height)}
        </div>
      )}
      {pdfDimensions && (
        <div className="absolute inset-0 pointer-events-none">
          {(["nama", "nomor_sertifikat", "tanggal", "judul_pelatihan", "qr_code"] as const).map((field) => {
            const k = koordinat[field];
            const scaleX = pdfDimensions.width / 842;
            const scaleY = pdfDimensions.height / 595;
            const left = k.x * scaleX;
            const top = (595 - k.y) * scaleY - 20;
            const label = {
              nama: "Nama",
              nomor_sertifikat: "Nomor",
              tanggal: "Tanggal",
              judul_pelatihan: "Judul",
              qr_code: "QR",
            }[field];

            return (
              <div
                key={field}
                className="absolute border-2 border-dashed border-red-500 bg-red-500/10 rounded px-2 py-0.5 text-xs font-bold text-red-600"
                style={{ left, top, transform: "translateX(-50%)" }}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
