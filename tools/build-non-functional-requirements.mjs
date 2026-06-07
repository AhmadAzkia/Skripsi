import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("outputs");
await fs.mkdir(outputDir, { recursive: true });

const rows = [
  ["Kode", "Spesifikasi Kebutuhan Non-Fungsional"],
  [
    "SKPL-NF-001",
    "Sistem yang dibangun berbasis website harus dapat diakses melalui browser modern seperti Google Chrome, Mozilla Firefox, dan Microsoft Edge.",
  ],
  [
    "SKPL-NF-002",
    "Sistem yang dibangun harus memiliki tampilan responsif agar dapat digunakan melalui perangkat desktop, laptop, tablet, maupun smartphone.",
  ],
  [
    "SKPL-NF-003",
    "Sistem yang dibangun harus terintegrasi dengan Midtrans API untuk mendukung proses pembayaran digital.",
  ],
  [
    "SKPL-NF-004",
    "Sistem yang dibangun harus mendukung webhook atau notifikasi real-time dari Midtrans untuk memperbarui status pembayaran secara otomatis.",
  ],
  [
    "SKPL-NF-005",
    "Sistem yang dibangun harus terintegrasi dengan Supabase sebagai layanan backend untuk autentikasi, database, storage, dan edge function.",
  ],
  [
    "SKPL-NF-006",
    "Sistem yang dibangun harus mampu menyimpan data utama secara terpusat pada PostgreSQL Database melalui Supabase.",
  ],
  [
    "SKPL-NF-007",
    "Sistem yang dibangun harus mampu menyimpan file sertifikat digital pada Supabase Storage.",
  ],
  [
    "SKPL-NF-008",
    "Sistem yang dibangun harus mendukung proses pembuatan sertifikat digital secara otomatis melalui Supabase Edge Function.",
  ],
  [
    "SKPL-NF-009",
    "Sistem yang dibangun harus mampu menghasilkan QR Code sebagai media validasi keaslian sertifikat digital.",
  ],
  [
    "SKPL-NF-010",
    "Sistem yang dibangun membutuhkan koneksi internet yang stabil untuk mengakses aplikasi web, layanan Supabase, Midtrans, dan proses penyimpanan file digital.",
  ],
  [
    "SKPL-NF-011",
    "Sistem yang dibangun membutuhkan perangkat komputer atau laptop untuk proses pengembangan, pengelolaan data pelatihan, dan pengelolaan sertifikat.",
  ],
  [
    "SKPL-NF-012",
    "Sistem yang dibangun membutuhkan perangkat smartphone atau komputer bagi peserta untuk melakukan pendaftaran, pembayaran, dan pengunduhan sertifikat digital.",
  ],
  [
    "SKPL-NF-013",
    "Sistem yang dibangun menggunakan Visual Studio Code sebagai code editor dalam proses pengembangan aplikasi.",
  ],
  [
    "SKPL-NF-014",
    "Sistem yang dibangun menggunakan Node.js dan Next.js untuk mendukung proses pengembangan aplikasi web.",
  ],
];

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Kebutuhan Non-Fungsional");
sheet.showGridLines = false;

sheet.getRange("A1:B1").merge();
sheet.getRange("A1").values = [["Tabel Spesifikasi Kebutuhan Non-Fungsional"]];
sheet.getRange("A1").format = {
  font: { bold: true, size: 14 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
sheet.getRange("A1").format.rowHeightPx = 34;

const tableRange = sheet.getRange(`A3:B${rows.length + 2}`);
tableRange.values = rows;
tableRange.format = {
  font: { name: "Times New Roman", size: 12 },
  wrapText: true,
  verticalAlignment: "top",
  borders: {
    top: { style: "continuous", color: "#000000", weight: "thin" },
    bottom: { style: "continuous", color: "#000000", weight: "thin" },
    left: { style: "continuous", color: "#000000", weight: "thin" },
    right: { style: "continuous", color: "#000000", weight: "thin" },
    insideHorizontal: { style: "continuous", color: "#000000", weight: "thin" },
    insideVertical: { style: "continuous", color: "#000000", weight: "thin" },
  },
};

sheet.getRange("A3:B3").format = {
  fill: "#D9D9D9",
  font: { name: "Times New Roman", size: 12, bold: true },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: {
    top: { style: "continuous", color: "#000000", weight: "thin" },
    bottom: { style: "continuous", color: "#000000", weight: "thin" },
    left: { style: "continuous", color: "#000000", weight: "thin" },
    right: { style: "continuous", color: "#000000", weight: "thin" },
    insideVertical: { style: "continuous", color: "#000000", weight: "thin" },
  },
};

sheet.getRange("A4:A17").format = {
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};

sheet.getRange("A:A").format.columnWidthPx = 115;
sheet.getRange("B:B").format.columnWidthPx = 560;
sheet.getRange("A3:B3").format.rowHeightPx = 28;
sheet.getRange("A4:B17").format.rowHeightPx = 56;
sheet.freezePanes.freezeRows(3);

const inspect = await workbook.inspect({
  kind: "table",
  range: "Kebutuhan Non-Fungsional!A1:B17",
  tableMaxRows: 18,
  tableMaxCols: 2,
  maxChars: 2500,
});
console.log(inspect.ndjson);

const preview = await workbook.render({
  sheetName: "Kebutuhan Non-Fungsional",
  range: "A1:B17",
  scale: 1,
  format: "png",
});
await fs.writeFile(
  path.join(outputDir, "kebutuhan_non_fungsional_preview.png"),
  new Uint8Array(await preview.arrayBuffer()),
);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outputDir, "spesifikasi_kebutuhan_non_fungsional.xlsx"));
