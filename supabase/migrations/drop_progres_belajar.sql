-- Migration: drop progres_belajar table
-- Run this in Supabase SQL editor or via your migration tooling
DROP TABLE IF EXISTS progres_belajar CASCADE;

-- Note: After applying this migration, regenerate types with:
-- npx supabase gen types typescript --project-id <project-id> --schema public > types/database.ts
