-- HAPUS SEMUA DATA DB, TERMASUK USER.
-- Jalankan hanya kalau benar-benar yakin.
-- Script ini menghapus:
-- - semua isi tabel di schema public
-- - semua user Supabase Auth di auth.users beserta data auth terkait via CASCADE
-- Script ini tidak menghapus struktur tabel, enum, function, policy, atau migration history.

begin;

-- Bersihkan semua tabel aplikasi di schema public.
do $$
declare
  table_list text;
begin
  select string_agg(format('%I.%I', schemaname, tablename), ', ')
  into table_list
  from pg_tables
  where schemaname = 'public';

  if table_list is not null then
    execute 'truncate table ' || table_list || ' restart identity cascade';
  end if;
end $$;

-- Bersihkan semua user Supabase Auth.
-- CASCADE akan ikut membersihkan tabel auth terkait seperti identities, sessions,
-- refresh_tokens, MFA, SSO, dan data auth lain yang punya relasi ke auth.users.
-- Jangan pakai RESTART IDENTITY di auth schema: beberapa sequence dimiliki role
-- internal Supabase, misalnya auth.refresh_tokens_id_seq.
truncate table auth.users cascade;

commit;
