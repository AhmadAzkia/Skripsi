-- ============================================================
-- MIGRATION: Rename "kursus" → "pelatihan"
-- Jalankan di Supabase SQL Editor
-- BACKUP dulu sebelum execute!
-- ============================================================

-- ======================
-- 1. RENAME TABLES
-- ======================
ALTER TABLE IF EXISTS "kursus" RENAME TO "pelatihan";
ALTER TABLE IF EXISTS "materi_kursus" RENAME TO "materi_pelatihan";
ALTER TABLE IF EXISTS "pendaftaran_kursus" RENAME TO "pendaftaran_pelatihan";

-- ======================
-- 2. RENAME ENUMS
-- ======================
-- Renama enum type status_kursus → status_pelatihan
ALTER TYPE "status_kursus" RENAME TO "status_pelatihan";

-- Buat enum baru tipe_pelatihan (ganti tipe_kursus yang punya 3 value jadi 2)
-- Hapus dulu column yang pakai enum lama, lalu drop enum lama
ALTER TABLE "pelatihan" ALTER COLUMN "tipe_kursus" TYPE TEXT;

-- Drop enum lama (harus di cascade karena masih dipakai)
DROP TYPE IF EXISTS "tipe_kursus" CASCADE;

-- Buat enum baru dengan value 'online' | 'offline' (sesuai draft, tanpa 'hybrid')
CREATE TYPE "tipe_pelatihan" AS ENUM ('online', 'offline');

-- Update existing data: hybrid → offline (atau online, sesuai kebutuhan)
UPDATE "pelatihan" SET "tipe_kursus" = 'offline' WHERE "tipe_kursus" = 'hybrid';

-- Set column ke enum baru
ALTER TABLE "pelatihan"
  ALTER COLUMN "tipe_kursus" TYPE "tipe_pelatihan"
  USING "tipe_kursus"::"tipe_pelatihan";

-- Rename column tipe_kursus → tipe_pelatihan
ALTER TABLE "pelatihan" RENAME COLUMN "tipe_kursus" TO "tipe_pelatihan";

-- ======================
-- 3. RENAME ENUM VALUE: tipe_pembayaran
-- ======================
-- Value "pendaftaran_kursus" → "pendaftaran_pelatihan"
-- PostgreSQL tidak support ALTER VALUE, harus buat enum baru
ALTER TABLE "pembayaran" ALTER COLUMN "tipe_pembayaran" TYPE TEXT;

DROP TYPE IF EXISTS "tipe_pembayaran" CASCADE;

CREATE TYPE "tipe_pembayaran" AS ENUM ('pendaftaran_pelatihan', 'klaim_sertifikat');

UPDATE "pembayaran" SET "tipe_pembayaran" = 'pendaftaran_pelatihan' WHERE "tipe_pembayaran" = 'pendaftaran_kursus';

ALTER TABLE "pembayaran"
  ALTER COLUMN "tipe_pembayaran" TYPE "tipe_pembayaran"
  USING "tipe_pembayaran"::"tipe_pembayaran";

-- ======================
-- 4. RENAME COLUMNS (kursus_id → pelatihan_id)
-- ======================
ALTER TABLE "materi_pelatihan" RENAME COLUMN "kursus_id" TO "pelatihan_id";
ALTER TABLE "pendaftaran_pelatihan" RENAME COLUMN "kursus_id" TO "pelatihan_id";
ALTER TABLE "pembayaran" RENAME COLUMN "kursus_id" TO "pelatihan_id";
ALTER TABLE "sertifikat" RENAME COLUMN "kursus_id" TO "pelatihan_id";
ALTER TABLE "template_sertifikat" RENAME COLUMN "kursus_id" TO "pelatihan_id";

-- ======================
-- 4. RENAME FK CONSTRAINTS
-- (PostgreSQL auto-rename saat rename column, tapi kita pastikan)

-- ======================
-- Cek constraint names di Supabase Dashboard → Table → Relationships
-- Biasanya constraint ikut ter-rename. Kalau belum, jalankan manual:
-- ALTER TABLE "materi_pelatihan"
--   DROP CONSTRAINT IF EXISTS "materi_kursus_kursus_id_fkey",
--   ADD CONSTRAINT "materi_pelatihan_pelatihan_id_fkey"
--   FOREIGN KEY ("pelatihan_id") REFERENCES "pelatihan"("id");

-- ======================
-- 5. RENAME FUNCTION (kalau ada)
-- ======================
-- Function get_user_profile_simple tidak pakai nama tabel, aman.

-- ======================
-- 6. VERIFY
-- ======================
-- Jalankan query ini untuk cek:
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    table_name IN ('pelatihan', 'materi_pelatihan', 'pendaftaran_pelatihan')
    OR column_name IN ('pelatihan_id', 'tipe_pelatihan')
  )
ORDER BY table_name, ordinal_position;

-- Cek enum types:
SELECT t.typname, e.enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('status_pelatihan', 'tipe_pelatihan', 'tipe_pembayaran')
ORDER BY t.typname, e.enumsortorder;

-- ============================================================
-- DONE! Selanjutnya: update kode aplikasi & regenerate types
-- ============================================================
