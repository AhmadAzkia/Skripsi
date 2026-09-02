import type { SessionUser } from "@/contexts/AuthContext";

export function getUserDisplayName(user: SessionUser | null, fallback: string) {
  const profileName = user?.profile?.nama_lengkap?.trim();
  if (profileName) return profileName;

  const metadataName = user?.user_metadata?.nama_lengkap;
  if (typeof metadataName === "string" && metadataName.trim()) return metadataName.trim();

  const emailName = user?.email?.split("@")[0]?.trim();
  return emailName || fallback;
}
