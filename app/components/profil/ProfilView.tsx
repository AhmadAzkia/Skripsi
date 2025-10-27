"use client";

import Image from "next/image";
import Avatar from "./Avatar";

// Type definitions based on database schema
interface UserProfile {
  id: string;
  user_id: string;
  nama_lengkap: string;
  email: string;
  nomor_hp: string | null;
  bio: string | null;
  foto_profil_url: string | null;
  peran: "admin" | "instruktur" | "peserta";
  is_aktif: boolean;
  dibuat_pada: string;
  diperbarui_pada: string | null;
}

type UserRole = "admin" | "pemateri" | "peserta";

interface ProfilViewProps {
  user: {
    id: string;
    email?: string;
    created_at?: string;
  };
  profile: UserProfile;
  role: UserRole;
  onEdit?: () => void;
  showEditButton?: boolean;
  compact?: boolean;
}

export default function ProfilView({ user, profile, role, onEdit, showEditButton = true, compact = false }: ProfilViewProps) {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "pemateri":
        return "Pemateri";
      case "peserta":
        return "Peserta";
      default:
        return "User";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "pemateri":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "peserta":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border">
        <div className="shrink-0">
          <Avatar src={profile.foto_profil_url} alt="Profile" size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.nama_lengkap || "Nama tidak tersedia"}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(role)}`}>{getRoleDisplay(role)}</span>
        </div>
        {showEditButton && onEdit && (
          <button onClick={onEdit} className="shrink-0 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200">
            Edit
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with gradient background */}
      <div className="h-32 bg-blue-500"></div>

      {/* Profile content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-16 mb-4">
          <div className="relative">
            <Avatar src={profile.foto_profil_url} alt="Profile" size="xl" className="border-4 border-white shadow-lg" />
            <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium border-2 border-white ${getRoleBadgeColor(role)}`}>{getRoleDisplay(role)}</div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.nama_lengkap || "Nama tidak tersedia"}</h2>
          <p className="text-gray-600 mb-1">{user.email}</p>
          {profile.nomor_hp && <p className="text-gray-600">{profile.nomor_hp}</p>}
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          {profile.bio && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Account info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Bergabung sejak</span>
              <span>{new Date(user.created_at || "").toLocaleDateString("id-ID")}</span>
            </div>
            {profile.diperbarui_pada && (
              <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                <span>Terakhir diperbarui</span>
                <span>{new Date(profile.diperbarui_pada).toLocaleDateString("id-ID")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {showEditButton && onEdit && (
          <div className="mt-6">
            <button onClick={onEdit} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
              Edit Profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
