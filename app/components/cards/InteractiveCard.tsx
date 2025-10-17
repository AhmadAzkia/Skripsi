"use client";

import Link from "next/link";

interface InteractiveCardProps {
  title: string;
  duration: string;
  participants: string;
  price?: string;
  isOnline: boolean;
  isFree?: boolean;
  href: string;
}

export default function InteractiveCard({ title, duration, participants, price, isOnline, isFree = false, href }: InteractiveCardProps) {
  return (
    <div className="bg-white rounded-lg border border-silver/20 hover-lift hover-glow transition-all duration-300 p-6 animate-slide-up">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-gold text-navy" : "bg-navy text-white-text"}`}>{isOnline ? "Online" : "Offline"}</span>
        {isFree && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Gratis</span>}
        {price && !isFree && <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold">{price}</span>}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-navy mb-4 text-balance">{title}</h3>

      {/* Info */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-silver text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {duration}
        </div>
        <div className="flex items-center text-silver text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {participants}
        </div>
      </div>

      {/* CTA Button */}
      <Link href={href} className="w-full bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-navy btn-interactive transition-all duration-300 py-2 px-4 rounded-md font-medium text-center block">
        Lihat Detail
        <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
