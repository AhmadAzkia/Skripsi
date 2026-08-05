-- Tambah data pelatihan dari katalog perusahaan.
-- Tidak menghapus data apa pun.
-- Tanggal mulai semua pelatihan diset 2027-01-04 09:00 WIB,
-- yaitu 5 bulan dari 2026-08-04.
-- Item "Dokumen Digital dan Validasi QR Code" tidak dimasukkan karena bukan pelatihan.

begin;

with seed as (
  select *
  from (
    values
      (
        '11111111-1111-4111-8111-111111111111',
        'Ahli K3 Umum Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan dan pembinaan Ahli K3 Umum sesuai kebutuhan perusahaan.',
        5250000,
        30,
        80,
        75,
        'online',
        6
      ),
      (
        '22222222-2222-4222-8222-222222222222',
        'Ahli K3 Umum BNSP',
        'Pelatihan & Sertifikasi K3',
        'Program pelatihan dan sertifikasi kompetensi Ahli K3 Umum berbasis skema BNSP.',
        4925000,
        30,
        80,
        75,
        'online',
        6
      ),
      (
        '33333333-3333-4333-8333-333333333333',
        'Ahli K3 Migas BNSP',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan dan sertifikasi kompetensi K3 Migas untuk kebutuhan sektor minyak dan gas.',
        7750000,
        25,
        85,
        80,
        'offline',
        6
      ),
      (
        '44444444-4444-4444-8444-444444444444',
        'Petugas Confined Space Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan petugas ruang terbatas untuk memahami prosedur kerja aman di confined space.',
        4500000,
        25,
        80,
        75,
        'offline',
        4
      ),
      (
        '55555555-5555-4555-8555-555555555555',
        'Authorized Gas Tester / Petugas Deteksi Gas Ruang Terbatas',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan pemeriksaan dan deteksi gas pada area ruang terbatas.',
        4500000,
        25,
        80,
        75,
        'offline',
        3
      ),
      (
        '66666666-6666-4666-8666-666666666666',
        'Petugas Penyelamat Ruang Terbatas Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan penyelamatan pada kondisi darurat di ruang terbatas.',
        5750000,
        24,
        85,
        80,
        'offline',
        5
      ),
      (
        '77777777-7777-4777-8777-777777777777',
        'Tenaga Kerja pada Ketinggian Level 1 dan 2 Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan keselamatan bekerja pada ketinggian sesuai level kebutuhan.',
        4500000,
        24,
        85,
        80,
        'offline',
        5
      ),
      (
        '88888888-8888-4888-8888-888888888888',
        'Ahli K3 Konstruksi Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan K3 untuk sektor konstruksi dan pengendalian risiko pekerjaan konstruksi.',
        6000000,
        30,
        80,
        75,
        'online',
        6
      ),
      (
        '99999999-9999-4999-8999-999999999999',
        'Kebakaran Kelas D, C, B, dan A / Fire Expert Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan penanggulangan kebakaran sesuai kelas dan tingkat kompetensi.',
        6250000,
        30,
        85,
        80,
        'offline',
        5
      ),
      (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'K3 Teknisi Perancah dan Supervisor Perancah Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan teknisi dan supervisor perancah untuk pekerjaan scaffolding.',
        4500000,
        24,
        80,
        75,
        'offline',
        4
      ),
      (
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        'Bekerja Aman di Atas Permukaan Air / Working Safely on Water',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan keselamatan kerja di area perairan atau permukaan air.',
        4500000,
        25,
        80,
        75,
        'offline',
        3
      ),
      (
        'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        'Penyelamatan di Permukaan Air / Water Rescue',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan teknik penyelamatan di permukaan air.',
        5500000,
        24,
        85,
        80,
        'offline',
        4
      ),
      (
        'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        'Penyelamatan di Bawah Air / Rescue Diving',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan penyelamatan bawah air sesuai kebutuhan operasi.',
        8000000,
        20,
        85,
        80,
        'offline',
        5
      ),
      (
        'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        'Penyelamatan Kebakaran / Fire Rescue',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan teknik penyelamatan dalam kondisi kebakaran.',
        6900000,
        24,
        85,
        80,
        'offline',
        5
      ),
      (
        'ffffffff-ffff-4fff-8fff-ffffffffffff',
        'Penyelamatan di Ketinggian / High Angle Rescue',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan penyelamatan korban pada area ketinggian.',
        6125000,
        20,
        85,
        80,
        'offline',
        5
      ),
      (
        '12121212-1212-4212-8212-121212121212',
        'Petugas P3K Kemnaker / First Aid Officer',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan petugas pertolongan pertama di tempat kerja.',
        4850000,
        35,
        75,
        70,
        'online',
        3
      ),
      (
        '13131313-1313-4313-8313-131313131313',
        'Materi K3 Dasar / Safety Officer',
        'Pelatihan & Sertifikasi K3',
        'Pembekalan dasar K3 untuk safety officer dan pekerja terkait.',
        2500000,
        40,
        75,
        70,
        'online',
        2
      ),
      (
        '14141414-1414-4414-8414-141414141414',
        'Ahli Investigasi Insiden BNSP',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan investigasi insiden dan kecelakaan kerja berbasis kompetensi.',
        4500000,
        30,
        80,
        75,
        'online',
        4
      ),
      (
        '15151515-1515-4515-8515-151515151515',
        'Emergency Response Plan / ERP',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan penyusunan dan penerapan rencana tanggap darurat.',
        3750000,
        35,
        80,
        75,
        'online',
        3
      ),
      (
        '16161616-1616-4616-8616-161616161616',
        'Life Guard dan Basic Sea Survival',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan penyelamatan perairan dan kemampuan dasar bertahan di laut.',
        5750000,
        24,
        85,
        80,
        'offline',
        5
      ),
      (
        '17171717-1717-4717-8717-171717171717',
        'Operator Forklift Kemnaker',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan operator forklift untuk pengoperasian alat angkat-angkut secara aman.',
        4500000,
        24,
        80,
        75,
        'offline',
        4
      ),
      (
        '18181818-1818-4818-8818-181818181818',
        'Basic Safety Officer',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan dasar safety officer meliputi PTW, JSA, JSO, manajemen risiko, analisis kecelakaan, audit K3, dan materi terkait.',
        2500000,
        40,
        75,
        70,
        'online',
        3
      ),
      (
        '19191919-1919-4919-8919-191919191919',
        'Rescue Plan',
        'Pelatihan & Sertifikasi K3',
        'Pelatihan penyusunan rencana penyelamatan meliputi High Angle Rescue, Water Rescue, Under Water Rescue, P3K, RAR, Fire, CSSR, dan CSR.',
        6500000,
        24,
        85,
        80,
        'offline',
        5
      )
  ) as v(
    id,
    judul,
    kategori,
    deskripsi,
    harga,
    maksimal_peserta,
    minimal_kehadiran_persen,
    minimal_nilai_ujian,
    tipe_pelatihan,
    durasi_hari
  )
)
insert into public.pelatihan (
  id,
  judul,
  kategori,
  deskripsi,
  harga,
  maksimal_peserta,
  minimal_kehadiran_persen,
  minimal_nilai_ujian,
  status,
  tanggal_mulai,
  tanggal_selesai,
  thumbnail_url,
  tipe_pelatihan,
  dibuat_pada,
  diperbarui_pada
)
select
  id::uuid,
  judul,
  kategori,
  deskripsi,
  harga,
  maksimal_peserta,
  minimal_kehadiran_persen,
  minimal_nilai_ujian,
  'published'::public.status_pelatihan,
  timestamp with time zone '2027-01-04 09:00:00+07',
  timestamp with time zone '2027-01-04 16:00:00+07' + ((durasi_hari - 1) * interval '1 day'),
  null,
  tipe_pelatihan::public.tipe_pelatihan,
  now(),
  now()
from seed
on conflict (id) do update set
  judul = excluded.judul,
  kategori = excluded.kategori,
  deskripsi = excluded.deskripsi,
  harga = excluded.harga,
  maksimal_peserta = excluded.maksimal_peserta,
  minimal_kehadiran_persen = excluded.minimal_kehadiran_persen,
  minimal_nilai_ujian = excluded.minimal_nilai_ujian,
  status = excluded.status,
  tanggal_mulai = excluded.tanggal_mulai,
  tanggal_selesai = excluded.tanggal_selesai,
  thumbnail_url = excluded.thumbnail_url,
  tipe_pelatihan = excluded.tipe_pelatihan,
  diperbarui_pada = now();

commit;
