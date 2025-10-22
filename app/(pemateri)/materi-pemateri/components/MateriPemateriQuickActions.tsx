"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function MateriPemateriQuickActions() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMateri = async () => {
    setIsLoading(true);
    // Implement add material logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  const quickActions = [
    {
      title: "Tambah Materi Baru",
      description: "Buat konten pembelajaran baru untuk peserta",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      bgColor: "from-navy/5 to-navy/10",
      borderColor: "border-navy/20",
      hoverBorderColor: "hover:border-navy/30",
      action: handleAddMateri,
    },
    {
      title: "Import dari File",
      description: "Unggah materi dalam format PDF, PPT, atau video",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      bgColor: "from-gold/5 to-gold/10",
      borderColor: "border-gold/20",
      hoverBorderColor: "hover:border-gold/30",
      action: () => console.log("Import file"),
    },
    {
      title: "Kelola Kategori",
      description: "Atur kategori dan organisasi materi pembelajaran",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: "from-silver/5 to-silver/10",
      borderColor: "border-silver/20",
      hoverBorderColor: "hover:border-silver/30",
      action: () => console.log("Manage categories"),
    },
    {
      title: "Template Materi",
      description: "Gunakan template siap pakai untuk membuat materi",
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "from-navy/10 to-gold/5",
      borderColor: "border-navy/30",
      hoverBorderColor: "hover:border-gold/30",
      action: () => console.log("Use templates"),
    },
  ];

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Aksi <span className="text-gold">Cepat</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Kelola dan buat konten pembelajaran dengan mudah</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={isLoading}
                className={`group p-6 bg-gradient-to-br ${action.bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${action.borderColor} ${action.hoverBorderColor} hover:-translate-y-1 text-left w-full disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="bg-white/60 p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300 mb-4">{action.icon}</div>
                  <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-gold transition-colors duration-300">{action.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/10 to-navy/10 px-6 py-3 rounded-full border border-gold/20">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-navy text-sm font-medium">Tip: Gunakan template untuk mempercepat pembuatan materi</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
