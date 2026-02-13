"use client";

import { PenggunaData } from "../page";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: PenggunaData | null;
  loading: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, user, loading }: DeleteModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Pengguna</h3>

          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus pengguna <strong>{user.nama_lengkap}</strong>?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex space-x-4">
            <button onClick={onClose} className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium" disabled={loading}>
              Batal
            </button>
            <button onClick={onConfirm} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menghapus...
                </div>
              ) : (
                "Hapus Pengguna"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
