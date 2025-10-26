// "use client";

// import LoginHero from "./LoginHero";
// import LoginForm from "./LoginForm";
// import { ScrollReveal } from "@/components/ui";
// import Link from "next/link";

// export default function LoginContainer() {
//   return (
//     <div className="relative w-full max-w-md">
//       <ScrollReveal>
//         <LoginHero />
//       </ScrollReveal>
//       <ScrollReveal delay={200}>
//         <LoginForm />
//       </ScrollReveal>
//       {/* Back to Home */}
//       <div className="mt-6 text-center">
//         <Link href="/" className="inline-flex items-center text-silver hover:text-gold transition-colors duration-300 group">
//           <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           Kembali ke Beranda
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";

// Komponen ini akan menerima 'title' (Login/Register)
export default function FeatureNotAvailable({ title }: { title: string }) {
  return (
    <div className="w-full max-w-md">
      {/* Box utama */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
        {/* Ikon */}
        <div className="flex justify-center mb-6">
          <svg className="h-16 w-16 text-gold opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"
            />
          </svg>
        </div>

        {/* Judul Pesan */}
        <h2 className="text-2xl font-bold text-white-text mb-3">Fitur {title} Sedang Disiapkan</h2>

        {/* Isi Pesan */}
        <p className="text-silver">Kami sedang bekerja keras untuk segera meluncurkan fitur ini. Pantau terus pembaruan dari kami. Terima kasih atas kesabaran Anda.</p>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-silver hover:text-gold transition-colors duration-300 group">
            <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
