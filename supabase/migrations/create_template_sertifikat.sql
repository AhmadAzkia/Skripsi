-- supabase/migrations/create_template_sertifikat.sql

CREATE TABLE template_sertifikat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  file_path TEXT NOT NULL,
  koordinat JSONB NOT NULL DEFAULT '{
    "nama": { "x": 0, "y": 0, "fontSize": 30 },
    "nomor_sertifikat": { "x": 0, "y": 0, "fontSize": 11 },
    "tanggal": { "x": 0, "y": 0, "fontSize": 11 },
    "judul_pelatihan": { "x": 0, "y": 0, "fontSize": 21 },
    "qr_code": { "x": 0, "y": 0, "size": 82 }
  }',
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diperbarui_pada TIMESTAMPTZ
);

ALTER TABLE sertifikat ADD COLUMN template_id UUID REFERENCES template_sertifikat(id);

-- RLS policies
ALTER TABLE template_sertifikat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage templates"
  ON template_sertifikat FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profil_pengguna
      WHERE profil_pengguna.user_id = auth.uid()
      AND profil_pengguna.peran = 'admin'
    )
  );

CREATE POLICY "Anyone can view templates"
  ON template_sertifikat FOR SELECT
  USING (true);
