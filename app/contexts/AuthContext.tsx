// app/contexts/AuthContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client"; // Klien Supabase sisi KLIEN
import { Tables } from "@/../types/database";
import type { User } from "@supabase/supabase-js";

// Tipe gabungan untuk data user + profil
export type SessionUser = User & {
  profile: Tables<"profil_pengguna"> | null;
};

// Tipe untuk nilai yang ada di dalam Context
type AuthContextType = {
  user: SessionUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  clearAuthCache: () => Promise<void>;
};

// 1. Buat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Buat Provider (Pembungkus)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil profil dari database
  const getProfile = async (user: User): Promise<Tables<"profil_pengguna"> | null> => {
    // Pastikan user.id ada sebelum query
    if (!user?.id) return null;

    const { data: profile, error } = await supabase
      .from("profil_pengguna")
      .select("*")
      .eq("user_id", user.id) // Gunakan user_id
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return profile;
  };

  // Fungsi untuk me-refresh data user + profil secara manual
  const refreshUser = async () => {
    setLoading(true);
    try {
      // Force refresh dari server, bukan cache
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting user:", error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (user) {
        const profile = await getProfile(user);
        setUser({ ...user, profile });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    }
    setLoading(false);
  };

  // Fungsi untuk clear auth cache (helpful for development)
  const clearAuthCache = async () => {
    try {
      // Clear localStorage items yang digunakan supabase
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith("sb-") || key.includes("supabase")) {
            localStorage.removeItem(key);
          }
        });
      }

      // Sign out dan refresh
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error clearing auth cache:", error);
    }
  };

  // Cek status login saat pertama kali memuat
  useEffect(() => {
    // Cek sesi awal
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const profile = await getProfile(session.user);
        setUser({ ...session.user, profile });
      }
      setLoading(false);
    });

    // Pantau perubahan status login (SIGNED_IN, SIGNED_OUT)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);

      if (event === "SIGNED_IN" && session) {
        const profile = await getProfile(session.user);
        setUser({ ...session.user, profile });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      // Tangani TOKEN_REFRESHED untuk update otomatis
      else if (event === "TOKEN_REFRESHED" && session) {
        const profile = await getProfile(session.user);
        setUser({ ...session.user, profile });
      }
      // Juga tangani USER_UPDATED jika ingin profil update otomatis
      else if (event === "USER_UPDATED" && session) {
        const profile = await getProfile(session.user);
        setUser({ ...session.user, profile });
      }
      setLoading(false);
    });

    // Hentikan pemantauan saat komponen di-unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    refreshUser,
    clearAuthCache,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Buat Hook (useAuth)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
