"use client";

import Link from "next/link";
import { ClockIcon, UserGroupIcon } from "@heroicons/react/24/outline";

interface InteractiveCardProps {
  id: string; // ID untuk link
  title: string;
  duration: string; // Durasi sudah diformat
  participants: string; // Info peserta sudah diformat
  isOnline: boolean; // Tipe boolean
  price: number; // Harga sebagai angka
  href: string; // Link tujuan
  imageUrl?: string | null; // URL gambar (opsional)
}

const formatHarga = (harga: number) => {
  if (harga === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(harga);
};

export default function InteractiveCard({ id, title, duration, participants, isOnline, price, href, imageUrl }: InteractiveCardProps) {
  const isFree = price === 0;

  return (
    <div className="bg-white rounded-lg border border-silver/20 hover-lift hover-glow transition-all duration-300 p-6 flex flex-col h-full">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-gold text-navy" : "bg-navy text-white-text"}`}>{isOnline ? "Online" : "Offline"}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isFree ? "bg-green-100 text-green-800" : "bg-gold/10 text-gold"}`}>{formatHarga(price)}</span>
      </div>

      {imageUrl && (
        <div className="relative h-40 mb-4 rounded overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-navy mb-4 text-balance flex-grow">{title}</h3>

      {/* Training Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-silver text-sm">
          <ClockIcon className="w-4 h-4 mr-2" />
          {duration}
        </div>
        <div className="flex items-center text-silver text-sm">
          <UserGroupIcon className="w-4 h-4 mr-2" />
          {participants}
        </div>
      </div>

      {/* CTA Button */}
      <Link href={href} className="mt-auto w-full bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive transition-all duration-300 py-3 px-4 rounded-md font-medium text-center block">
        Lihat Detail
        <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
