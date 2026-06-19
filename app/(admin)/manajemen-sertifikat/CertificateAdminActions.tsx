"use client";

import { useTransition, useState } from "react";
import { generateCertificateByAdmin, deleteTemplate } from "./actions";
import TemplateUploadForm from "./components/TemplateUploadForm";

type Template = {
  id: string;
  nama: string;
  file_path: string;
};

export function CertificateAdminTabs({ templates: initialTemplates }: { templates: Template[] }) {
  const [activeTab, setActiveTab] = useState<"templates" | "certificates">("templates");
  const [templates, setTemplates] = useState(initialTemplates);

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "templates" ? "border-navy text-navy" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Daftar Template
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "certificates" ? "border-navy text-navy" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Daftar Sertifikat
        </button>
      </div>

      {activeTab === "templates" && (
        <div className="space-y-6">
          <TemplateUploadForm />
          <TemplateList
            templates={templates}
            onDelete={(id) => setTemplates((prev) => prev.filter((t) => t.id !== id))}
          />
        </div>
      )}
    </div>
  );
}

function TemplateList({ templates, onDelete }: { templates: Template[]; onDelete: (id: string) => void }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus template ini?")) return;
    startTransition(async () => {
      const result = await deleteTemplate(id);
      if (result.success) {
        onDelete(id);
      } else {
        alert(result.error || "Gagal menghapus template.");
      }
    });
  };

  if (templates.length === 0) {
    return (
      <div className="bg-white border border-navy/10 rounded-xl shadow-sm p-6">
        <p className="text-gray-500 text-center">Belum ada template.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-navy/10 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-navy">Template Tersedia</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {templates.map((template) => (
          <div key={template.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <p className="font-semibold text-navy">{template.nama}</p>
              <p className="text-xs text-gray-500">{template.file_path}</p>
            </div>
            <button
              onClick={() => handleDelete(template.id)}
              disabled={pending}
              className="px-3 py-1.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GenerateCertificateButton({ certificateId, templates }: { certificateId: string; templates: Template[] }) {
  const [pending, startTransition] = useTransition();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5"
      >
        <option value="">Tanpa template</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nama}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const result = await generateCertificateByAdmin(certificateId, selectedTemplate || undefined);
            alert(result.success ? "File sertifikat berhasil dibuat." : result.error || "Gagal membuat sertifikat.");
          });
        }}
        className="px-3 py-2 text-sm font-semibold rounded-lg bg-gold text-navy hover:bg-gold/90 disabled:opacity-60"
      >
        {pending ? "Generate..." : "Generate"}
      </button>
    </div>
  );
}
