
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "../actions";
import { supabase } from "@/lib/supabase/client";

interface RegisterFormProps {
  className?: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function RegisterForm({ className = "" }: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan");
      setLoading(false);
      return;
    }

    try {
      const { user, error } = await signup(formData);

      if (error) {
        setError(error);
      } else if (user) {
        setSuccess("Pendaftaran berhasil! 📧 Kami telah mengirim link verifikasi ke email Anda. " + "Silakan cek inbox (dan folder spam) untuk mengaktifkan akun Anda.");
        setUserEmail(formData.email);
        setShowResend(true);
        // Tidak auto redirect, biarkan user membaca pesan
      }
    } catch (err) {
      setError("Terjadi kesalahan saat pendaftaran");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
      });

      if (error) {
        setError("Gagal mengirim ulang email verifikasi: " + error.message);
      } else {
        setSuccess("Email verifikasi telah dikirim ulang ke " + userEmail + ". Silakan cek inbox Anda.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim ulang email verifikasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 ${className}`}>
      {/* Error Message */}
      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">{error}</div>}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
          {success}
          {showResend && (
            <div className="mt-3 pt-3 border-t border-green-500/30">
              <p className="text-xs text-green-200 mb-2">Tidak menerima email?</p>
              <button type="button" onClick={handleResendVerification} disabled={loading} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50">
                {loading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-white-text mb-2">
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/5 text-white-text placeholder-silver/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white-text mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/5 text-white-text placeholder-silver/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Masukkan email Anda"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white-text mb-2">
            Nomor Telepon
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/5 text-white-text placeholder-silver/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Masukkan nomor telepon (opsional)"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white-text mb-2">
            Password
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
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/5 text-white-text placeholder-silver/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Masukkan password (min. 6 karakter)"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white-text mb-2">
            Konfirmasi Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/5 text-white-text placeholder-silver/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Konfirmasi password Anda"
            />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            required
            checked={formData.agreeToTerms}
            onChange={handleChange}
            disabled={loading}
            className="h-4 w-4 text-gold bg-white/10 border-white/30 rounded focus:ring-gold focus:ring-2 mt-1 disabled:opacity-50"
          />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-silver">
            Saya menyetujui{" "}
            <Link href="/syarat-ketentuan" className="text-gold hover:text-gold/80 transition-colors">
              syarat dan ketentuan
            </Link>{" "}
            serta{" "}
            <Link href="/kebijakan-privasi" className="text-gold hover:text-gold/80 transition-colors">
              kebijakan privasi
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-navy bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300 btn-interactive disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          )}
          {loading ? "Mendaftar..." : "Daftar Sekarang"}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-silver">atau daftar dengan</span>
          </div>
        </div>
      </div>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-silver">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-gold hover:text-gold/80 transition-colors">
            Masuk sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
