// Contoh penggunaan komponen profil di halaman peserta
import { getUserProfile } from "@/components/profil/actions";
import { ProfilManager } from "@/components/profil";

export default async function ProfilPesertaPage() {
  const { profile, error } = await getUserProfile();

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || "Profil tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  const mockUser = {
    id: profile.user_id,
    email: profile.email,
    created_at: profile.dibuat_pada,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Saya</h1>

        <ProfilManager user={mockUser} profile={profile} role="peserta" compact={false} />
      </div>
    </div>
  );
}
