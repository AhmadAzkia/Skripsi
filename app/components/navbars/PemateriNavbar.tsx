"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import RoleIndicator from "@/components/ui/RoleIndicator";
import { HomeIcon, BookOpenIcon, NewspaperIcon, UserIcon, Bars3Icon, XMarkIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
const navigation = [
  { name: "Dashboard", href: "/dashboard-pemateri", icon: HomeIcon },
  { name: "Pelatihan", href: "/pelatihan-pemateri", icon: BookOpenIcon },
  { name: "Materi", href: "/materi-pemateri", icon: AcademicCapIcon },
  { name: "Manajemen Blog", href: "/blog-pemateri", icon: NewspaperIcon },
];

export default function PemateriNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigation = async (href: string) => {
    try {
      console.log(`Navigation attempt to: ${href}`);
      router.push(href);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleSignOut = () => {
    setShowLogoutModal(true);
    setProfileDropdownOpen(false);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isActiveLink = (href: string) => {
    if (href === "/pemateri") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-navy shadow-lg border-b border-gold/20">
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 bg-white rounded-lg p-1 shadow-sm">
                <Image src="/CertiGuardia.png" alt="CertiGuardia Logo" fill className="object-contain" priority />
              </div>
              <div className="text-white-text hidden sm:block">
                <span className="font-bold text-lg">PT. CertiGuardia</span>
                <span className="text-silver text-sm block">Solusi</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.href);

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`group flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-navy/50 hover:scale-105 ${isActive ? "text-gold" : "text-silver hover:text-gold"}`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Dropdown - Desktop */}
          <div className="hidden lg:block relative shrink-0">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-silver hover:text-gold hover:bg-navy/50 transition-all duration-300 group"
            >
              <div className="w-8 h-8 bg-linear-to-br from-gold to-yellow-600 text-navy rounded-full flex items-center justify-center text-xs font-semibold transition-transform duration-200 group-hover:scale-110 shadow-lg">
                {user?.profile?.email?.charAt(0).toUpperCase() || "P"}
              </div>
              <span className="max-w-32 truncate text-white-text">{user?.profile?.email || "Pemateri"}</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 ring-1 ring-navy/10 z-50 transform transition-all duration-200 animate-slideInFromTop">
                <div className="py-2">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-navy/5 to-blue-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-br from-navy to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-navy text-sm gradient-text">{user?.profile?.nama_lengkap || user?.profile?.email?.split("@")[0] || "Pemateri"}</div>
                        <div className="text-xs text-gray-500 truncate">{user?.profile?.email}</div>
                        <div className="mt-1">
                          <RoleIndicator />
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNavigation("/profil-pemateri");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-linear-to-r hover:from-navy/8 hover:to-blue-50 hover:text-navy flex items-center space-x-3 transition-all duration-200 group dropdown-item transform hover:scale-[1.02]"
                    >
                      <div className="p-1.5 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-linear-to-br group-hover:from-navy/10 group-hover:to-blue-100 group-hover:text-navy transition-all duration-200 icon-hover">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">Profil Saya</span>
                        <div className="text-xs text-gray-500 group-hover:text-navy/70 transition-all duration-200">Kelola informasi akun</div>
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-navy/50 transition-all duration-200"></div>
                    </button>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Logout Button */}
                  <div className="py-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-linear-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 flex items-center space-x-3 transition-all duration-200 group dropdown-item transform hover:scale-[1.02]"
                    >
                      <div className="p-1.5 rounded-lg bg-red-100 text-red-600 group-hover:bg-linear-to-br group-hover:from-red-200 group-hover:to-red-100 group-hover:text-red-700 transition-all duration-200 icon-hover">
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">Keluar</span>
                        <div className="text-xs text-red-500 group-hover:text-red-600 transition-all duration-200">Logout dari akun</div>
                      </div>
                      <div className="w-1 h-1 bg-red-300 rounded-full group-hover:bg-red-500 transition-all duration-200"></div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-silver hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold transition-colors duration-300">
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-navy border-t border-gold/20">
              {/* Mobile Navigation Items */}
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.href);

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavigation(item.href);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 flex items-center space-x-2 ${isActive ? "text-gold bg-navy/50" : "text-silver hover:text-gold hover:bg-navy/50"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              {/* Mobile Profile Section */}
              <div className="border-t border-gold/30 pt-4 mt-4">
                <div className="px-3 py-2 text-sm text-silver font-medium">Profil</div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavigation("/profil-pemateri");
                  }}
                  className={`w-full text-left px-6 py-2 rounded-md text-base font-medium transition-colors duration-300 flex items-center space-x-2 ${
                    isActiveLink("/profil-pemateri") ? "text-gold bg-navy/50" : "text-silver hover:text-gold hover:bg-navy/50"
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Profil Saya</span>
                </button>
                <button onClick={handleSignOut} className="w-full text-left px-6 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-navy/50 flex items-center space-x-2 transition-colors duration-300">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={cancelLogout} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 mx-4 max-w-md w-full transform transition-all duration-300 animate-slideInFromTop">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Keluar</h3>
                <p className="text-sm text-gray-500">Pastikan untuk menyimpan pekerjaan Anda</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">Apakah Anda yakin ingin keluar dari portal pemateri?</p>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">⚠️ Anda akan diarahkan kembali ke halaman utama dan perlu login ulang untuk mengakses portal pemateri.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button onClick={cancelLogout} disabled={isLoggingOut} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50">
                Batal
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Keluar...</span>
                  </>
                ) : (
                  <span>Ya, Keluar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for dropdowns */}
      {profileDropdownOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setProfileDropdownOpen(false)} />}
    </header>
  );
}
