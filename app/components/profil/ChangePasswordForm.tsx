"use client";

import { useState } from "react";
import { changeUserPassword } from "./actions";
import { Button, Input, Alert } from "@/components/ui";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Semua field wajib diisi" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak sesuai" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter" });
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setMessage({ type: "error", text: "Password baru harus berbeda dari password saat ini" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("currentPassword", formData.currentPassword);
      formDataToSend.append("newPassword", formData.newPassword);
      formDataToSend.append("confirmPassword", formData.confirmPassword);

      const result = await changeUserPassword(formDataToSend);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Auto-close after successful change
        setTimeout(() => {
          setMessage(null);
          onSuccess?.();
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Gagal mengubah password" });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan saat mengubah password" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setMessage(null);
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ubah Password</h2>
        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isSubmitting}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mb-6">
          <Alert variant={message.type === "success" ? "success" : "error"}>{message.text}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <Input
          type={showPasswords.current ? "text" : "password"}
          label="Password Saat Ini"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
          placeholder="Masukkan password saat ini"
          rightIcon={
            <button type="button" onClick={() => togglePasswordVisibility("current")} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
              {showPasswords.current ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M18.364 5.636l-2.829 2.829m0 0L14.12 9.88m1.415-1.414L18.364 5.636"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          }
        />

        {/* New Password */}
        <Input
          type={showPasswords.new ? "text" : "password"}
          label="Password Baru"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
          placeholder="Masukkan password baru (min. 6 karakter)"
          rightIcon={
            <button type="button" onClick={() => togglePasswordVisibility("new")} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
              {showPasswords.new ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M18.364 5.636l-2.829 2.829m0 0L14.12 9.88m1.415-1.414L18.364 5.636"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          }
        />

        {/* Confirm Password */}
        <Input
          type={showPasswords.confirm ? "text" : "password"}
          label="Konfirmasi Password Baru"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
          placeholder="Ulangi password baru"
          rightIcon={
            <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
              {showPasswords.confirm ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M18.364 5.636l-2.829 2.829m0 0L14.12 9.88m1.415-1.414L18.364 5.636"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          }
        />

        {/* Password Requirements */}
        <Alert variant="info" title="Persyaratan Password">
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-navy/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Minimal 6 karakter
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-navy/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Berbeda dari password saat ini
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-navy/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Konfirmasi password harus sama
            </li>
          </ul>
        </Alert>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6 border-t">
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting} className="flex-1">
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Mengubah Password..." : "Ubah Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
