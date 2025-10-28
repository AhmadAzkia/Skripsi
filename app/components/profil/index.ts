// Export all profile components
export { default as ProfilView } from "./ProfilView";
export { default as ProfilEditForm } from "./ProfilEditForm";
export { default as ProfilManager } from "./ProfilManager";
export { default as Avatar } from "./Avatar";
export { default as ChangePasswordForm } from "./ChangePasswordForm";

// Export types if needed
export type UserProfile = {
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
};

export type UserRole = "admin" | "pemateri" | "peserta";
