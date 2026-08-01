export type ParticipantEvaluation = {
  pendaftaranId: string;
  penggunaId: string;
  nama: string;
  email: string;
  statusPendaftaran: string;
  tanggalDaftar: string;
  jumlahPertemuan: number | null;
  jumlahHadir: number | null;
  persentaseKehadiran: number | null;
  nilaiUjian: number | null;
  statusKelulusan: string | null;
  alasanPerubahan: string | null;
  dievaluasiPada: string | null;
};

export type ImportPreviewRow = {
  rowNumber: number;
  pendaftaranId: string;
  namaPeserta: string;
  email: string;
  jumlahPertemuan: number | null;
  jumlahHadir: number | null;
  nilaiUjian: number | null;
  persentaseKehadiran: number | null;
  statusKelulusan: "lulus" | "tidak_lulus" | null;
  errors: string[];
};

export type ImportPreview = {
  rows: ImportPreviewRow[];
  validCount: number;
  invalidCount: number;
};
