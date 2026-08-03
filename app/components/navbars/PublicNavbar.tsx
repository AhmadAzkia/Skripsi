"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Jadwal Pelatihan", href: "/jadwal-pelatihan" },
  { name: "Tentang Kami", href: "/tentang-kami" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-navy border-b-2 border-gold">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className={`transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium ${isActiveLink(item.href) ? "text-gold" : "text-silver hover:text-gold"}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            <Link href="/login" className={`border transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium ${isActiveLink("/login") ? "text-gold border-gold" : "text-silver hover:text-gold border-silver hover:border-gold"}`}>
              Masuk
            </Link>
            <Link href="/register" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
              Daftar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-silver hover:text-gold hover:bg-navy/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold transition-colors duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gold/30 mt-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${isActiveLink(item.href) ? "text-gold bg-navy/50" : "text-silver hover:text-gold"}`} onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gold/30">
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className={`border transition-all duration-300 px-4 py-2 rounded-md text-sm font-medium flex-1 text-center ${isActiveLink("/login") ? "text-gold border-gold" : "text-silver hover:text-gold border-silver hover:border-gold"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link href="/register" className="bg-gold hover:bg-gold/90 text-navy btn-interactive px-4 py-2 rounded-md text-sm font-medium flex-1 text-center transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                    Daftar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
