"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function RoleIndicator() {
  const { user } = useAuth();

  if (!user || !user.profile) {
    return null;
  }

  const role = user.profile.peran;
  const roleColors = {
    admin: "bg-red-100 text-red-800 border-red-200",
    instruktur: "bg-blue-100 text-blue-800 border-blue-200",
    peserta: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
      <div className={`w-2 h-2 rounded-full mr-1.5 ${role === "admin" ? "bg-red-400" : role === "instruktur" ? "bg-blue-400" : role === "peserta" ? "bg-green-400" : "bg-gray-400"}`}></div>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </div>
  );
}
