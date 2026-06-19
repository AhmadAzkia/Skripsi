"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "../actions";

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      setLoading(false);
      return;
    }

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Jika sukses, Server Action akan me-redirect,
    // jadi kita tidak perlu menangani 'success' di sini.
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white-text mb-2">
            Password Baru
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="block w-full pl-10 pr-12 py-3 border border-white/30 rounded-lg bg-white/5 text-white-text placeholder-silver/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Masukkan password baru"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} className="absolute inset-y-0 right-0 pr-3 flex items-center text-silver hover:text-gold transition-colors disabled:opacity-50">
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white-text mb-2">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="block w-full pl-10 pr-12 py-3 border border-white/30 rounded-lg bg-white/5 text-white-text placeholder-silver/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Konfirmasi password baru"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-silver hover:text-gold transition-colors disabled:opacity-50"
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-white/10 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${password.length >= 8 ? "bg-green-500 w-full" : password.length >= 6 ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"}`}></div>
              </div>
              <span className={`text-xs font-medium ${password.length >= 8 ? "text-green-400" : password.length >= 6 ? "text-yellow-400" : "text-red-400"}`}>{password.length >= 8 ? "Kuat" : password.length >= 6 ? "Sedang" : "Lemah"}</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center space-x-2 ${password.length >= 6 ? "text-green-400" : "text-silver/70"}`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d={
                      password.length >= 6
                        ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        : "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    }
                    clipRule="evenodd"
                  />
                </svg>
                <span>Minimal 6 karakter</span>
              </div>
              <div className={`flex items-center space-x-2 ${/[0-9]/.test(password) ? "text-green-400" : "text-silver/70"}`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d={
                      /[0-9]/.test(password)
                        ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        : "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    }
                    clipRule="evenodd"
                  />
                </svg>
                <span>Mengandung angka</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || password !== confirmPassword || password.length < 6}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-navy bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300 btn-interactive disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center text-silver hover:text-gold transition-colors duration-300 group">
          <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
}
