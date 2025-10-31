-- Migration: drop durasi_jam column from kursus table
-- This removes the duration field from courses

ALTER TABLE kursus DROP COLUMN IF EXISTS durasi_jam;

-- Note: Remember to regenerate types after applying this migration:
-- npx supabase gen types typescript --project-id orqxapxwrjvwgtqvpxcg --schema public > types/database.ts