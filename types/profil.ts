import { Tables, Enums } from "./database";

// Type untuk profil pengguna berdasarkan database schema
export type UserProfile = Tables<"profil_pengguna">;

// Type untuk role/peran pengguna — sesuai enum DB: "admin" | "peserta"
export type UserRole = Enums<"peran_pengguna">;

// Type untuk kursus
export type Course = Tables<"kursus">;

// Type untuk form profil — menggunakan nama kolom DB
export interface ProfileFormData {
  nama_lengkap: string;
  nomor_hp: string;
  bio: string;
  email: string;
}

// Type untuk update profil
export interface ProfileUpdateData {
  nama_lengkap?: string;
  nomor_hp?: string;
  bio?: string;
  foto_profil_url?: string;
}

// Type untuk props komponen profil
export interface ProfileViewProps {
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

export interface ProfileEditFormProps {
  profile: UserProfile;
  role: UserRole;
  onSave: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}
