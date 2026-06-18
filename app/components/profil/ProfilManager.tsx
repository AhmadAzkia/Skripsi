"use client";

import { useState } from "react";
import ProfilView from "./ProfilView";
import ProfilEditForm from "./ProfilEditForm";

// Type definitions based on database schema
interface UserProfile {
  id: string;
  user_id: string;
  nama_lengkap: string;
  email: string;
  nomor_hp: string | null;
  bio: string | null;
  foto_profil_url: string | null;
  peran: "admin" | "peserta";
  is_aktif: boolean;
  dibuat_pada: string;
  diperbarui_pada: string | null;
}

type UserRole = "admin" | "peserta";

interface ProfilManagerProps {
  user?: {
    id: string;
    email?: string;
    created_at?: string;
  };
  profile: UserProfile;
  role: UserRole;
  compact?: boolean;
  showEditButton?: boolean;
  mode?: "compact" | "full";
  onSave?: (profile: UserProfile) => void;
}

export default function ProfilManager({ user, profile, role, compact = false }: ProfilManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = (updatedProfile: UserProfile) => {
    setCurrentProfile(updatedProfile);
    setIsEditing(false);
  };

  if (isEditing && !compact) {
    return <ProfilEditForm profile={currentProfile} role={role} loading={false} onSave={handleSave} onCancel={handleCancelEdit} />;
  }

  // Make sure user is defined before passing to ProfilView
  if (!user) {
    return <div>Loading...</div>;
  }

  return <ProfilView user={user} profile={currentProfile} role={role} onEdit={handleEdit} showEditButton={true} compact={compact} />;
}
