// Test data untuk demo ProfilEditForm
export const mockProfile = {
  id: "1",
  user_id: "user-123",
  nama_lengkap: "John Doe",
  email: "john.doe@example.com",
  nomor_hp: "08123456789",
  bio: "Seorang pengembang software yang passionate dalam bidang cybersecurity dan teknologi modern.",
  foto_profil_url: null,
  peran: "peserta" as const,
  is_aktif: true,
  dibuat_pada: "2024-01-01T00:00:00.000Z",
  diperbarui_pada: null,
};

export const mockUser = {
  id: "user-123",
  email: "john.doe@example.com",
  created_at: "2024-01-01T00:00:00.000Z",
};
