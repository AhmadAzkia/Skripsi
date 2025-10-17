"use client";

import { useAuth } from "@/contexts/AuthContext";
import { hasRole } from "@/lib/role-utils";
import Link from "next/link";

export default function RoleTestPanel() {
  const { user } = useAuth();

  if (!user || !user.profile) {
    return null;
  }

  const currentRole = user.profile.peran;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Access Test Panel</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="font-medium">Current Role:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentRole === "admin" ? "bg-red-100 text-red-800" : currentRole === "instruktur" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
            {currentRole}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Access Test Links:</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Peserta Access */}
            <Link
              href="/peserta"
              className={`block p-3 rounded-md border text-center transition-colors ${
                hasRole(user.profile, "peserta") ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100" : "bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
              }`}
            >
              <div className="font-medium">Peserta</div>
              <div className="text-xs">{hasRole(user.profile, "peserta") ? "✅ Accessible" : "❌ Blocked"}</div>
            </Link>

            {/* Pemateri Access */}
            <Link
              href="/pemateri"
              className={`block p-3 rounded-md border text-center transition-colors ${
                hasRole(user.profile, "instruktur") ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100" : "bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
              }`}
            >
              <div className="font-medium">Pemateri</div>
              <div className="text-xs">{hasRole(user.profile, "instruktur") ? "✅ Accessible" : "❌ Blocked"}</div>
            </Link>

            {/* Admin Access */}
            <Link
              href="/admin"
              className={`block p-3 rounded-md border text-center transition-colors ${
                hasRole(user.profile, "admin") ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100" : "bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
              }`}
            >
              <div className="font-medium">Admin</div>
              <div className="text-xs">{hasRole(user.profile, "admin") ? "✅ Accessible" : "❌ Blocked"}</div>
            </Link>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4 p-2 bg-blue-50 rounded-md">
          <strong>Test Instructions:</strong> Click on any access link above. Green links should work (you have access), red links should redirect you back to your appropriate dashboard.
        </div>
      </div>
    </div>
  );
}
