"use client";

import { useTransition, useState } from "react";
import { generateCertificateByAdmin, deleteTemplate } from "./actions";
import TemplateUploadForm from "./components/TemplateUploadForm";
import ToastContainer, { useToast } from "@/components/ui/Toast";

type Template = {
  id: string;
  nama: string;
  file_path: string;
  pelatihan_id: string | null;
  pelatihan?: { judul: string } | null;
};

type Course = {
  id: string;
  judul: string;
};

export function CertificateAdminTabs({ templates: initialTemplates, courses }: { templates: Template[]; courses: Course[] }) {
  const [activeTab, setActiveTab] = useState<"templates" | "certificates">("templates");
  const [templates, setTemplates] = useState(initialTemplates);
  const { toasts, toast, removeToast } = useToast();

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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
          <TemplateUploadForm toast={toast} courses={courses} />
          <TemplateList
            templates={templates}
            onDelete={(id) => setTemplates((prev) => prev.filter((t) => t.id !== id))}
            toast={toast}
          />
        </div>
      )}
    </div>
  );
}

function TemplateList({ templates, onDelete, toast }: { templates: Template[]; onDelete: (id: string) => void; toast: ReturnType<typeof useToast>["toast"] }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus template ini?")) return;
    startTransition(async () => {
      const result = await deleteTemplate(id);
      if (result.success) {
        onDelete(id);
        toast.success("Template dihapus", "Template berhasil dihapus dari sistem.");
      } else {
        toast.error("Gagal menghapus", result.error || "Terjadi kesalahan saat menghapus template.");
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
              {template.pelatihan?.judul && (
                <p className="text-xs text-gold font-medium mt-1">Untuk: {template.pelatihan.judul}</p>
              )}
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
  const { toasts, toast, removeToast } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="flex items-center gap-2">
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5"
        >
          <option value="">Pilih template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nama}{t.pelatihan?.judul ? ` (${t.pelatihan.judul})` : ""}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={pending || !selectedTemplate}
          onClick={() => {
            startTransition(async () => {
              const result = await generateCertificateByAdmin(certificateId, selectedTemplate);
              if (result.success) {
                toast.success("Sertifikat dibuat", "File sertifikat berhasil digenerate.");
              } else {
                toast.error("Gagal generate", result.error || "Terjadi kesalahan saat membuat sertifikat.");
              }
            });
          }}
          className="px-3 py-2 text-sm font-semibold rounded-lg bg-gold text-navy hover:bg-gold/90 disabled:opacity-60"
        >
          {pending ? "Generate..." : "Generate"}
        </button>
      </div>
    </>
  );
}
