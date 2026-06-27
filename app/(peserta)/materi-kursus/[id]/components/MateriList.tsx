"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

type MateriPelatihan = {
  id: string;
  judul: string;
  deskripsi: string;
  tipe_materi: string;
  urutan: number;
  konten: string;
  video_url?: string | null;
  file_attachment?: any;
  zoom_link?: string | null;
};

interface MateriListProps {
  materiList: MateriPelatihan[];
  pelatihanId: string;
}

export default function MateriList({ materiList, pelatihanId }: MateriListProps) {
  const [selectedMateri, setSelectedMateri] = useState<MateriPelatihan | null>(null);

  const getTipeIcon = (tipe: string) => {
    switch (tipe) {
      case "pdf":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "ppt":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v14a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1h8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6m-6 4h6" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
    }
  };

  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case "video":
      case "zoom_recording":
        return "text-red-600 bg-red-50 border-red-200";
      case "pdf":
        return "text-navy bg-navy/5 border-navy/20";
      case "ppt":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleMateriClick = (materi: MateriPelatihan) => {
    setSelectedMateri(materi);
  };

  if (materiList.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-navy mb-2">Belum Ada Materi</h3>
              <p className="text-navy/70">Materi untuk pelatihan ini sedang dalam persiapan.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Daftar <span className="text-gold">Materi</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Pelajari materi secara berurutan untuk memaksimalkan pembelajaran Anda</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Materi List */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={200}>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-navy mb-4">Daftar Materi</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {materiList.map((materi, index) => (
                    <div
                      key={materi.id}
                      onClick={() => handleMateriClick(materi)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${selectedMateri?.id === materi.id ? "border-gold bg-gold/5 shadow-md" : "border-gray-200 bg-white hover:border-gold/30 hover:shadow-sm"}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getTipeColor(materi.tipe_materi)}`}>{getTipeIcon(materi.tipe_materi)}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-navy text-sm">{materi.judul}</h4>
                            {/* Show indicators for available content */}
                            <div className="flex gap-2 mt-1">
                              {materi.file_attachment && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">File</span>}
                              {materi.zoom_link && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Zoom
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">Materi {materi.urutan}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Materi Content */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={400}>
              {selectedMateri ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="bg-linear-to-r from-navy to-blue-900 text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-white/20`}>{getTipeIcon(selectedMateri.tipe_materi)}</div>
                        <div>
                          <h3 className="text-2xl font-bold">{selectedMateri.judul}</h3>
                          <p className="text-silver">Materi {selectedMateri.urutan}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-silver leading-relaxed">{selectedMateri.deskripsi}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Action Buttons - Show at top for better visibility */}
                    <div className="flex gap-3 mb-6">
                      {selectedMateri.file_attachment && (
                        <a
                          href={selectedMateri.file_attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-navy text-white text-center py-3 px-4 rounded-lg hover:bg-navy/90 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download {selectedMateri.tipe_materi.toUpperCase()}
                        </a>
                      )}

                      {selectedMateri.zoom_link && (
                        <a
                          href={selectedMateri.zoom_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gold text-white text-center py-3 px-4 rounded-lg hover:bg-gold/90 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Join Zoom Meeting
                        </a>
                      )}
                    </div>

                    {selectedMateri.tipe_materi === "video" && selectedMateri.file_attachment && (
                      <div className="mb-6">
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                          <iframe src={selectedMateri.file_attachment} className="w-full h-full" allowFullScreen title={selectedMateri.judul} />
                        </div>
                      </div>
                    )}

                    {selectedMateri.tipe_materi === "pdf" && selectedMateri.file_attachment && (
                      <div className="mb-6">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <iframe src={selectedMateri.file_attachment} className="w-full h-full" title={selectedMateri.judul} />
                        </div>
                      </div>
                    )}

                    <div className="prose max-w-none">
                      <div className="text-gray-700 leading-relaxed">
                        <p className="text-base">{selectedMateri.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">Pilih Materi</h3>
                  <p className="text-gray-600">Klik pada materi di sebelah kiri untuk mulai belajar</p>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
