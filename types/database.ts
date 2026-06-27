export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      pelatihan: {
        Row: {
          deskripsi: string | null
          dibuat_pada: string
          diperbarui_pada: string | null
          harga: number
          id: string
          judul: string
          kategori: string
          maksimal_peserta: number | null
          status: Database["public"]["Enums"]["status_pelatihan"]
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          thumbnail_url: string | null
          tipe_pelatihan: Database["public"]["Enums"]["tipe_pelatihan"]
        }
        Insert: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          harga?: number
          id?: string
          judul: string
          kategori: string
          maksimal_peserta?: number | null
          status?: Database["public"]["Enums"]["status_pelatihan"]
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          thumbnail_url?: string | null
          tipe_pelatihan?: Database["public"]["Enums"]["tipe_pelatihan"]
        }
        Update: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          harga?: number
          id?: string
          judul?: string
          kategori?: string
          maksimal_peserta?: number | null
          status?: Database["public"]["Enums"]["status_pelatihan"]
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          thumbnail_url?: string | null
          tipe_pelatihan?: Database["public"]["Enums"]["tipe_pelatihan"]
        }
        Relationships: []
      }
      materi_pelatihan: {
        Row: {
          deskripsi: string | null
          dibuat_pada: string
          diperbarui_pada: string | null
          file_url: string | null
          id: string
          judul: string
          pelatihan_id: string
          tipe_materi: Database["public"]["Enums"]["tipe_materi"]
          urutan: number | null
          zoom_link: string | null
        }
        Insert: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          file_url?: string | null
          id?: string
          judul: string
          pelatihan_id: string
          tipe_materi: Database["public"]["Enums"]["tipe_materi"]
          urutan?: number | null
          zoom_link?: string | null
        }
        Update: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          file_url?: string | null
          id?: string
          judul?: string
          pelatihan_id?: string
          tipe_materi?: Database["public"]["Enums"]["tipe_materi"]
          urutan?: number | null
          zoom_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materi_pelatihan_pelatihan_id_fkey"
            columns: ["pelatihan_id"]
            isOneToOne: false
            referencedRelation: "pelatihan"
            referencedColumns: ["id"]
          },
        ]
      }
      notifikasi: {
        Row: {
          dibuat_pada: string
          id: string
          judul: string
          pengguna_id: string
          pesan: string
          sudah_dibaca: boolean | null
          terkait_id: string | null
          tipe: string
        }
        Insert: {
          dibuat_pada?: string
          id?: string
          judul: string
          pengguna_id: string
          pesan: string
          sudah_dibaca?: boolean | null
          terkait_id?: string | null
          tipe: string
        }
        Update: {
          dibuat_pada?: string
          id?: string
          judul?: string
          pengguna_id?: string
          pesan?: string
          sudah_dibaca?: boolean | null
          terkait_id?: string | null
          tipe?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifikasi_pengguna_id_fkey"
            columns: ["pengguna_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
        ]
      }
      pembayaran: {
        Row: {
          dibayar_pada: string | null
          dibuat_pada: string
          diperbarui_pada: string | null
          id: string
          id_pembayaran_eksternal: string | null
          jumlah: number
          pelatihan_id: string
          metode_pembayaran: string | null
          pengguna_id: string
          status_pembayaran: Database["public"]["Enums"]["status_pembayaran"]
          tipe_pembayaran: Database["public"]["Enums"]["tipe_pembayaran"]
        }
        Insert: {
          dibayar_pada?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          id_pembayaran_eksternal?: string | null
          jumlah: number
          pelatihan_id: string
          metode_pembayaran?: string | null
          pengguna_id: string
          status_pembayaran?: Database["public"]["Enums"]["status_pembayaran"]
          tipe_pembayaran: Database["public"]["Enums"]["tipe_pembayaran"]
        }
        Update: {
          dibayar_pada?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          id_pembayaran_eksternal?: string | null
          jumlah?: number
          pelatihan_id?: string
          metode_pembayaran?: string | null
          pengguna_id?: string
          status_pembayaran?: Database["public"]["Enums"]["status_pembayaran"]
          tipe_pembayaran?: Database["public"]["Enums"]["tipe_pembayaran"]
        }
        Relationships: [
          {
            foreignKeyName: "pembayaran_pelatihan_id_fkey"
            columns: ["pelatihan_id"]
            isOneToOne: false
            referencedRelation: "pelatihan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pembayaran_pengguna_id_fkey"
            columns: ["pengguna_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
        ]
      }
      pendaftaran_pelatihan: {
        Row: {
          dibuat_pada: string
          diperbarui_pada: string | null
          id: string
          pelatihan_id: string
          pengguna_id: string
          sertifikat_id: string | null
          status: Database["public"]["Enums"]["status_pendaftaran"]
          tanggal_daftar: string
          tanggal_selesai: string | null
        }
        Insert: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          pelatihan_id: string
          pengguna_id: string
          sertifikat_id?: string | null
          status?: Database["public"]["Enums"]["status_pendaftaran"]
          tanggal_daftar?: string
          tanggal_selesai?: string | null
        }
        Update: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          pelatihan_id?: string
          pengguna_id?: string
          sertifikat_id?: string | null
          status?: Database["public"]["Enums"]["status_pendaftaran"]
          tanggal_daftar?: string
          tanggal_selesai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pendaftaran_pelatihan_pelatihan_id_fkey"
            columns: ["pelatihan_id"]
            isOneToOne: false
            referencedRelation: "pelatihan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendaftaran_pelatihan_pengguna_id_fkey"
            columns: ["pengguna_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendaftaran_pelatihan_sertifikat_id_fkey"
            columns: ["sertifikat_id"]
            isOneToOne: false
            referencedRelation: "sertifikat"
            referencedColumns: ["id"]
          },
        ]
      }
      profil_pengguna: {
        Row: {
          bio: string | null
          dibuat_pada: string
          diperbarui_pada: string | null
          email: string
          foto_profil_url: string | null
          id: string
          is_aktif: boolean
          nama_lengkap: string
          nomor_hp: string | null
          peran: Database["public"]["Enums"]["peran_pengguna"]
          user_id: string
        }
        Insert: {
          bio?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          email: string
          foto_profil_url?: string | null
          id?: string
          is_aktif?: boolean
          nama_lengkap: string
          nomor_hp?: string | null
          peran?: Database["public"]["Enums"]["peran_pengguna"]
          user_id: string
        }
        Update: {
          bio?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          email?: string
          foto_profil_url?: string | null
          id?: string
          is_aktif?: boolean
          nama_lengkap?: string
          nomor_hp?: string | null
          peran?: Database["public"]["Enums"]["peran_pengguna"]
          user_id?: string
        }
        Relationships: []
      }
      sertifikat: {
        Row: {
          dibuat_pada: string
          diperbarui_pada: string | null
          id: string
          pelatihan_id: string
          nomor_sertifikat: string
          peserta_id: string
          sertifikat_url: string | null
          status: Database["public"]["Enums"]["status_sertifikat"]
          tanggal_terbit: string
          template_id: string | null
        }
        Insert: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          pelatihan_id: string
          nomor_sertifikat: string
          peserta_id: string
          sertifikat_url?: string | null
          status?: Database["public"]["Enums"]["status_sertifikat"]
          tanggal_terbit?: string
          template_id?: string | null
        }
        Update: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          pelatihan_id?: string
          nomor_sertifikat?: string
          peserta_id?: string
          sertifikat_url?: string | null
          status?: Database["public"]["Enums"]["status_sertifikat"]
          tanggal_terbit?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sertifikat_pelatihan_id_fkey"
            columns: ["pelatihan_id"]
            isOneToOne: false
            referencedRelation: "pelatihan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sertifikat_peserta_id_fkey"
            columns: ["peserta_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sertifikat_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "template_sertifikat"
            referencedColumns: ["id"]
          },
        ]
      }
      template_sertifikat: {
        Row: {
          dibuat_pada: string
          diperbarui_pada: string | null
          file_path: string
          id: string
          koordinat: {
            nama: { x: number; y: number; fontSize: number }
            nomor_sertifikat: { x: number; y: number; fontSize: number }
            tanggal: { x: number; y: number; fontSize: number }
            judul_pelatihan: { x: number; y: number; fontSize: number }
            qr_code: { x: number; y: number; size: number }
          }
          pelatihan_id: string | null
          nama: string
        }
        Insert: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          file_path: string
          id?: string
          koordinat?: {
            nama?: { x?: number; y?: number; fontSize?: number }
            nomor_sertifikat?: { x?: number; y?: number; fontSize?: number }
            tanggal?: { x?: number; y?: number; fontSize?: number }
            judul_pelatihan?: { x?: number; y?: number; fontSize?: number }
            qr_code?: { x?: number; y?: number; size?: number }
          }
          pelatihan_id?: string | null
          nama: string
        }
        Update: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          file_path?: string
          id?: string
          koordinat?: {
            nama?: { x?: number; y?: number; fontSize?: number }
            nomor_sertifikat?: { x?: number; y?: number; fontSize?: number }
            tanggal?: { x?: number; y?: number; fontSize?: number }
            judul_pelatihan?: { x?: number; y?: number; fontSize?: number }
            qr_code?: { x?: number; y?: number; size?: number }
          }
          pelatihan_id?: string | null
          nama?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_sertifikat_pelatihan_id_fkey"
            columns: ["pelatihan_id"]
            isOneToOne: false
            referencedRelation: "pelatihan"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile_simple: {
        Args: { user_uuid: string }
        Returns: {
          alamat: string
          created_at: string
          email: string
          id: string
          jenis_kelamin: string
          kota: string
          nama_lengkap: string
          nomor_telepon: string
          tanggal_lahir: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      peran_pengguna: "admin" | "peserta"
      status_pelatihan: "draft" | "published" | "archived"
      status_pembayaran: "menunggu" | "berhasil" | "gagal" | "dikembalikan"
      status_pendaftaran:
        | "terdaftar"
        | "sedang_belajar"
        | "selesai"
        | "dibatalkan"
      status_sertifikat: "draft" | "terbit" | "dibatalkan"
      tipe_pelatihan: "online" | "offline"
      tipe_materi: "pdf" | "ppt"
      tipe_pembayaran: "pendaftaran_pelatihan" | "klaim_sertifikat"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      peran_pengguna: ["admin", "peserta"],
      status_pelatihan: ["draft", "published", "archived"],
      status_pembayaran: ["menunggu", "berhasil", "gagal", "dikembalikan"],
      status_pendaftaran: [
        "terdaftar",
        "sedang_belajar",
        "selesai",
        "dibatalkan",
      ],
      status_sertifikat: ["draft", "terbit", "dibatalkan"],
      tipe_pelatihan: ["online", "offline"],
      tipe_materi: ["pdf", "ppt"],
      tipe_pembayaran: ["pendaftaran_pelatihan", "klaim_sertifikat"],
    },
  },
} as const
