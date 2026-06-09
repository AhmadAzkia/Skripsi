"use client";

import { useTransition } from "react";
import { generateCertificateByAdmin, uploadCertificateTemplate } from "./actions";

export function TemplateUploadForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await uploadCertificateTemplate(formData);
          alert(result.success ? result.message || "Template tersimpan." : result.error || "Gagal upload template.");
        });
      }}
      className="bg-white border border-navy/10 rounded-xl shadow-sm p-6 space-y-4"
    >
      <div>
        <h2 className="text-xl font-bold text-navy">Template Sertifikat</h2>
        <p className="text-sm text-gray-600 mt-1">Unggah template PDF sertifikat ke Supabase Storage.</p>
      </div>
      <input name="template" type="file" accept="application/pdf,.pdf" className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-3" required />
      <button type="submit" disabled={pending} className="px-5 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 disabled:opacity-60">
        {pending ? "Mengunggah..." : "Unggah Template"}
      </button>
    </form>
  );
}

export function GenerateCertificateButton({ certificateId }: { certificateId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await generateCertificateByAdmin(certificateId);
          alert(result.success ? "File sertifikat berhasil dibuat." : result.error || "Gagal membuat sertifikat.");
        });
      }}
      className="px-3 py-2 text-sm font-semibold rounded-lg bg-gold text-navy hover:bg-gold/90 disabled:opacity-60"
    >
      {pending ? "Generate..." : "Generate"}
    </button>
  );
}
