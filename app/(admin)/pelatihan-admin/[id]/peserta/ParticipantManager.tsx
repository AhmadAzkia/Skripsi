"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ToastContainer, { useToast } from "@/components/ui/Toast";
import { applyEvaluationExcel, previewEvaluationExcel, updateEvaluationManual } from "./actions";
import type { ImportPreview, ParticipantEvaluation } from "./types";

type Props = {
  pelatihanId: string;
  initialParticipants: ParticipantEvaluation[];
  minimumAttendance: number;
  minimumScore: number;
};

const statusLabels: Record<string, string> = {
  menunggu_pembayaran: "Menunggu pembayaran",
  terdaftar: "Terdaftar",
  sedang_belajar: "Sedang belajar",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

function GraduationBadge({ status }: { status: string | null }) {
  if (status === "lulus") return <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Lulus</span>;
  if (status === "tidak_lulus") return <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Tidak lulus</span>;
  return <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">Belum dinilai</span>;
}

export default function ParticipantManager({ pelatihanId, initialParticipants, minimumAttendance, minimumScore }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [graduationFilter, setGraduationFilter] = useState("semua");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [editing, setEditing] = useState<ParticipantEvaluation | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toasts, toast, removeToast } = useToast();

  const stats = useMemo(() => ({
    total: initialParticipants.length,
    waiting: initialParticipants.filter((item) => !item.statusKelulusan).length,
    passed: initialParticipants.filter((item) => item.statusKelulusan === "lulus").length,
    failed: initialParticipants.filter((item) => item.statusKelulusan === "tidak_lulus").length,
  }), [initialParticipants]);

  const participants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return initialParticipants.filter((participant) => {
      const matchesSearch = !query || participant.nama.toLowerCase().includes(query) || participant.email.toLowerCase().includes(query);
      const normalizedStatus = participant.statusKelulusan || "belum_dinilai";
      return matchesSearch && (graduationFilter === "semua" || graduationFilter === normalizedStatus);
    });
  }, [graduationFilter, initialParticipants, search]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setPreview(null);
    startTransition(async () => {
      const result = await previewEvaluationExcel(pelatihanId, file);
      if (!result.success) {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.error("File tidak dapat diproses", result.error);
        return;
      }
      setPreview(result.data);
    });
  };

  const applyImport = () => {
    if (!selectedFile || !preview) return;
    startTransition(async () => {
      const result = await applyEvaluationExcel(pelatihanId, selectedFile);
      if (!result.success) {
        toast.error("Impor gagal", result.error);
        return;
      }
      toast.success("Hasil evaluasi tersimpan", `${result.imported} peserta diproses${result.rejected ? `, ${result.rejected} baris ditolak` : ""}.`);
      if (result.certificateErrors.length) toast.error("Sebagian sertifikat belum dibuat", result.certificateErrors[0]);
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    });
  };

  const saveManual = (formData: FormData) => {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateEvaluationManual(pelatihanId, {
        pendaftaranId: editing.pendaftaranId,
        jumlahPertemuan: Number(formData.get("jumlahPertemuan")),
        jumlahHadir: Number(formData.get("jumlahHadir")),
        nilaiUjian: Number(formData.get("nilaiUjian")),
        alasan: String(formData.get("alasan") || ""),
      });
      if (!result.success) {
        toast.error("Perubahan gagal", result.error);
        return;
      }
      toast.success("Evaluasi diperbarui", `Hasil ${editing.nama} telah dihitung ulang.`);
      setEditing(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total peserta", stats.total, "text-navy"],
          ["Belum dinilai", stats.waiting, "text-gray-700"],
          ["Lulus", stats.passed, "text-green-700"],
          ["Tidak lulus", stats.failed, "text-red-700"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-navy/10 bg-white p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-navy">Aturan kelulusan</h2>
            <p className="mt-1 text-sm text-gray-600">Peserta lulus jika kehadiran minimal <strong>{minimumAttendance}%</strong> dan nilai ujian minimal <strong>{minimumScore}</strong>.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90">
            {isPending ? "Memproses..." : "Unggah Hasil Excel"}
            <input ref={fileInputRef} type="file" accept=".xlsx" className="sr-only" disabled={isPending} onChange={(event) => handleFile(event.target.files?.[0] || null)} />
          </label>
        </div>
        <p className="mt-3 text-xs text-gray-500">Gunakan template dari tombol di bagian atas halaman. Maksimal 5 MB dan hanya format .xlsx.</p>
      </section>

      {preview && (
        <section className="rounded-lg border border-gold/30 bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-navy">Preview impor</h2>
              <p className="text-sm text-gray-600">{preview.validCount} baris valid, {preview.invalidCount} baris bermasalah. Hanya baris valid yang akan disimpan.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700" onClick={() => { setPreview(null); setSelectedFile(null); }}>Batal</button>
              <button type="button" disabled={isPending || preview.validCount === 0} className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50" onClick={applyImport}>Konfirmasi Impor</button>
            </div>
          </div>
          <div className="mt-4 max-h-80 overflow-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr><th className="px-3 py-3">Baris</th><th className="px-3 py-3">Peserta</th><th className="px-3 py-3">Kehadiran</th><th className="px-3 py-3">Nilai</th><th className="px-3 py-3">Hasil</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.rows.map((row) => (
                  <tr key={row.rowNumber} className={row.errors.length ? "bg-red-50" : "bg-white"}>
                    <td className="px-3 py-3">{row.rowNumber}</td>
                    <td className="px-3 py-3"><p className="font-medium text-navy">{row.namaPeserta || "-"}</p><p className="text-xs text-gray-500">{row.email}</p>{row.errors.length > 0 && <p className="mt-1 text-xs text-red-600">{row.errors.join("; ")}</p>}</td>
                    <td className="px-3 py-3">{row.persentaseKehadiran === null ? "-" : `${row.jumlahHadir}/${row.jumlahPertemuan} (${row.persentaseKehadiran}%)`}</td>
                    <td className="px-3 py-3">{row.nilaiUjian ?? "-"}</td>
                    <td className="px-3 py-3"><GraduationBadge status={row.statusKelulusan} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-lg font-semibold text-navy">Daftar peserta</h2><p className="text-sm text-gray-500">Menampilkan {participants.length} dari {initialParticipants.length} peserta</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau email" className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <select value={graduationFilter} onChange={(event) => setGraduationFilter(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm">
              <option value="semua">Semua hasil</option><option value="belum_dinilai">Belum dinilai</option><option value="lulus">Lulus</option><option value="tidak_lulus">Tidak lulus</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr><th className="px-5 py-3">Peserta</th><th className="px-5 py-3">Pendaftaran</th><th className="px-5 py-3">Kehadiran</th><th className="px-5 py-3">Nilai</th><th className="px-5 py-3">Kelulusan</th><th className="px-5 py-3 text-right">Aksi</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {participants.map((participant) => (
                <tr key={participant.pendaftaranId}>
                  <td className="px-5 py-4"><p className="font-semibold text-navy">{participant.nama}</p><p className="text-xs text-gray-500">{participant.email}</p></td>
                  <td className="px-5 py-4 text-gray-600">{statusLabels[participant.statusPendaftaran] || participant.statusPendaftaran}</td>
                  <td className="px-5 py-4 text-gray-600">{participant.persentaseKehadiran === null ? "-" : `${participant.jumlahHadir}/${participant.jumlahPertemuan} (${participant.persentaseKehadiran}%)`}</td>
                  <td className="px-5 py-4 font-medium text-gray-700">{participant.nilaiUjian ?? "-"}</td>
                  <td className="px-5 py-4"><GraduationBadge status={participant.statusKelulusan} /></td>
                  <td className="px-5 py-4 text-right"><button type="button" onClick={() => setEditing(participant)} className="rounded-lg border border-navy/20 px-3 py-2 text-xs font-semibold text-navy hover:bg-navy/5">{participant.statusKelulusan ? "Koreksi" : "Input Manual"}</button></td>
                </tr>
              ))}
              {participants.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-gray-500">Tidak ada peserta yang sesuai.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form action={saveManual} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between"><div><h2 className="text-xl font-bold text-navy">Evaluasi manual</h2><p className="mt-1 text-sm text-gray-600">{editing.nama}</p></div><button type="button" className="text-2xl text-gray-400" onClick={() => setEditing(null)} aria-label="Tutup">&times;</button></div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <label className="text-sm font-medium text-gray-700">Jumlah pertemuan<input name="jumlahPertemuan" type="number" min="1" required defaultValue={editing.jumlahPertemuan ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>
              <label className="text-sm font-medium text-gray-700">Jumlah hadir<input name="jumlahHadir" type="number" min="0" required defaultValue={editing.jumlahHadir ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>
              <label className="col-span-2 text-sm font-medium text-gray-700">Nilai ujian<input name="nilaiUjian" type="number" min="0" max="100" step="0.01" required defaultValue={editing.nilaiUjian ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>
              <label className="col-span-2 text-sm font-medium text-gray-700">Alasan perubahan<textarea name="alasan" required minLength={5} rows={3} placeholder="Contoh: Koreksi rekap absensi dari instruktur" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>
            </div>
            <div className="mt-6 flex justify-end gap-2"><button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm" onClick={() => setEditing(null)}>Batal</button><button type="submit" disabled={isPending} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isPending ? "Menyimpan..." : "Simpan dan Hitung"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
