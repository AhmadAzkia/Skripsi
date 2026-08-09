-- Tambahkan tipe materi Zoom/Google Meet ke enum public.tipe_materi.
-- Jalankan di Supabase SQL Editor.
-- Tidak menghapus data.

alter type public.tipe_materi add value if not exists 'zoom';
