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
      artikel_blog: {
        Row: {
          dibuat_pada: string
          diperbarui_pada: string | null
          dipublikasi_pada: string | null
          gambar_utama_url: string | null
          id: string
          judul: string
          konten: string | null
          penulis_id: string
          ringkasan: string | null
          slug: string
          status: Database["public"]["Enums"]["status_blog"]
          tags: string[] | null
        }
        Insert: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          dipublikasi_pada?: string | null
          gambar_utama_url?: string | null
          id?: string
          judul: string
          konten?: string | null
          penulis_id: string
          ringkasan?: string | null
          slug: string
          status?: Database["public"]["Enums"]["status_blog"]
          tags?: string[] | null
        }
        Update: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          dipublikasi_pada?: string | null
          gambar_utama_url?: string | null
          id?: string
          judul?: string
          konten?: string | null
          penulis_id?: string
          ringkasan?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["status_blog"]
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "artikel_blog_penulis_id_fkey"
            columns: ["penulis_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
        ]
      }
      kursus: {
        Row: {
          deskripsi: string | null
          dibuat_pada: string
          diperbarui_pada: string | null
          harga: number
          id: string
          instruktur_id: string
          judul: string
          kategori: string
          maksimal_peserta: number | null
          status: Database["public"]["Enums"]["status_kursus"]
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          thumbnail_url: string | null
          tipe_kursus: Database["public"]["Enums"]["tipe_kursus"]
        }
        Insert: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          harga?: number
          id?: string
          instruktur_id: string
          judul: string
          kategori: string
          maksimal_peserta?: number | null
          status?: Database["public"]["Enums"]["status_kursus"]
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          thumbnail_url?: string | null
          tipe_kursus?: Database["public"]["Enums"]["tipe_kursus"]
        }
        Update: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          harga?: number
          id?: string
          instruktur_id?: string
          judul?: string
          kategori?: string
          maksimal_peserta?: number | null
          status?: Database["public"]["Enums"]["status_kursus"]
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          thumbnail_url?: string | null
          tipe_kursus?: Database["public"]["Enums"]["tipe_kursus"]
        }
        Relationships: [
          {
            foreignKeyName: "kursus_instruktur_id_fkey"
            columns: ["instruktur_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
        ]
      }
      materi_kursus: {
        Row: {
          deskripsi: string | null
          dibuat_pada: string
          diperbarui_pada: string | null
          file_url: string | null
          id: string
          judul: string
          kursus_id: string
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
          kursus_id: string
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
          kursus_id?: string
          tipe_materi?: Database["public"]["Enums"]["tipe_materi"]
          urutan?: number | null
          zoom_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materi_kursus_kursus_id_fkey"
            columns: ["kursus_id"]
            isOneToOne: false
            referencedRelation: "kursus"
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
          kursus_id: string
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
          kursus_id: string
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
          kursus_id?: string
          metode_pembayaran?: string | null
          pengguna_id?: string
          status_pembayaran?: Database["public"]["Enums"]["status_pembayaran"]
          tipe_pembayaran?: Database["public"]["Enums"]["tipe_pembayaran"]
        }
        Relationships: [
          {
            foreignKeyName: "pembayaran_kursus_id_fkey"
            columns: ["kursus_id"]
            isOneToOne: false
            referencedRelation: "kursus"
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
      pendaftaran_kursus: {
        Row: {
          dibuat_pada: string
          diperbarui_pada: string | null
          id: string
          kursus_id: string
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
          kursus_id: string
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
          kursus_id?: string
          pengguna_id?: string
          sertifikat_id?: string | null
          status?: Database["public"]["Enums"]["status_pendaftaran"]
          tanggal_daftar?: string
          tanggal_selesai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pendaftaran_kursus_kursus_id_fkey"
            columns: ["kursus_id"]
            isOneToOne: false
            referencedRelation: "kursus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendaftaran_kursus_pengguna_id_fkey"
            columns: ["pengguna_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendaftaran_kursus_sertifikat_id_fkey"
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
          kursus_id: string
          nomor_sertifikat: string
          peserta_id: string
          sertifikat_url: string | null
          status: Database["public"]["Enums"]["status_sertifikat"]
          tanggal_terbit: string
        }
        Insert: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          kursus_id: string
          nomor_sertifikat: string
          peserta_id: string
          sertifikat_url?: string | null
          status?: Database["public"]["Enums"]["status_sertifikat"]
          tanggal_terbit?: string
        }
        Update: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          kursus_id?: string
          nomor_sertifikat?: string
          peserta_id?: string
          sertifikat_url?: string | null
          status?: Database["public"]["Enums"]["status_sertifikat"]
          tanggal_terbit?: string
        }
        Relationships: [
          {
            foreignKeyName: "sertifikat_kursus_id_fkey"
            columns: ["kursus_id"]
            isOneToOne: false
            referencedRelation: "kursus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sertifikat_peserta_id_fkey"
            columns: ["peserta_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
        ]
      }
      transaksi: {
        Row: {
          deskripsi: string | null
          dibuat_pada: string
          diperbarui_pada: string | null
          id: string
          jumlah: number
          kursus_id: string | null
          pembayaran_id: string | null
          pengguna_id: string
          status_transaksi: Database["public"]["Enums"]["status_transaksi"]
          tipe_transaksi: string
        }
        Insert: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          jumlah: number
          kursus_id?: string | null
          pembayaran_id?: string | null
          pengguna_id: string
          status_transaksi?: Database["public"]["Enums"]["status_transaksi"]
          tipe_transaksi: string
        }
        Update: {
          deskripsi?: string | null
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          jumlah?: number
          kursus_id?: string | null
          pembayaran_id?: string | null
          pengguna_id?: string
          status_transaksi?: Database["public"]["Enums"]["status_transaksi"]
          tipe_transaksi?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaksi_kursus_id_fkey"
            columns: ["kursus_id"]
            isOneToOne: false
            referencedRelation: "kursus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaksi_pembayaran_id_fkey"
            columns: ["pembayaran_id"]
            isOneToOne: false
            referencedRelation: "pembayaran"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaksi_pengguna_id_fkey"
            columns: ["pengguna_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
            referencedColumns: ["id"]
          },
        ]
      }
      ulasan_kursus: {
        Row: {
          dibuat_pada: string
          diperbarui_pada: string | null
          id: string
          kursus_id: string
          pengguna_id: string
          rating: number
          teks_ulasan: string | null
        }
        Insert: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          kursus_id: string
          pengguna_id: string
          rating: number
          teks_ulasan?: string | null
        }
        Update: {
          dibuat_pada?: string
          diperbarui_pada?: string | null
          id?: string
          kursus_id?: string
          pengguna_id?: string
          rating?: number
          teks_ulasan?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ulasan_kursus_kursus_id_fkey"
            columns: ["kursus_id"]
            isOneToOne: false
            referencedRelation: "kursus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ulasan_kursus_pengguna_id_fkey"
            columns: ["pengguna_id"]
            isOneToOne: false
            referencedRelation: "profil_pengguna"
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
      peran_pengguna: "admin" | "instruktur" | "peserta"
      status_blog: "draft" | "review" | "published" | "ditolak"
      status_kursus: "draft" | "published" | "archived"
      status_pembayaran: "menunggu" | "berhasil" | "gagal" | "dikembalikan"
      status_pendaftaran:
        | "terdaftar"
        | "sedang_belajar"
        | "selesai"
        | "dibatalkan"
      status_sertifikat: "draft" | "terbit" | "dibatalkan"
      status_transaksi: "menunggu" | "berhasil" | "gagal" | "dibatalkan"
      tipe_kursus: "online" | "offline" | "hybrid"
      tipe_materi: "pdf" | "ppt"
      tipe_pelatihan: "online" | "offline"
      tipe_pembayaran: "pendaftaran_kursus" | "klaim_sertifikat"
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
      peran_pengguna: ["admin", "instruktur", "peserta"],
      status_blog: ["draft", "review", "published", "ditolak"],
      status_kursus: ["draft", "published", "archived"],
      status_pembayaran: ["menunggu", "berhasil", "gagal", "dikembalikan"],
      status_pendaftaran: [
        "terdaftar",
        "sedang_belajar",
        "selesai",
        "dibatalkan",
      ],
      status_sertifikat: ["draft", "terbit", "dibatalkan"],
      status_transaksi: ["menunggu", "berhasil", "gagal", "dibatalkan"],
      tipe_kursus: ["online", "offline", "hybrid"],
      tipe_materi: ["pdf", "ppt"],
      tipe_pelatihan: ["online", "offline"],
      tipe_pembayaran: ["pendaftaran_kursus", "klaim_sertifikat"],
    },
  },
} as const
