"use client";

import { ProfilManager } from "@/components/profil";
import { mockProfile, mockUser } from "@/components/profil/mockData";

export default function ProfilDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Profil Component</h1>
          <p className="text-gray-600">Halaman demo untuk menguji fitur edit profil.</p>
        </div>

        {/* Demo Component */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📝 Cara Menguji Fitur Edit:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Klik tombol "Edit Profil" untuk masuk ke mode edit</li>
            <li>Ubah nama lengkap, nomor HP, atau bio</li>
            <li>Klik "Simpan Perubahan" untuk menyimpan</li>
            <li>Perhatikan feedback message yang muncul</li>
            <li>Klik "Batal" untuk membatalkan perubahan</li>
          </ol>
        </div>

        {/* Profile Component */}
        <ProfilManager user={mockUser} profile={mockProfile} role="peserta" compact={false} />
      </div>
    </div>
  );
}
