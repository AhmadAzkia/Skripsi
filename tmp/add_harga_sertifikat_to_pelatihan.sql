-- Tambah harga sertifikat per pelatihan gratis.
-- Jalankan sekali di Supabase SQL editor sebelum deploy kode.

alter table public.pelatihan
  add column if not exists harga_sertifikat integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pelatihan_harga_sertifikat_non_negative'
  ) then
    alter table public.pelatihan
      add constraint pelatihan_harga_sertifikat_non_negative
      check (harga_sertifikat is null or harga_sertifikat >= 0);
  end if;
end $$;
