"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

type RecentActivity = {
  id: string;
  title: string;
  type: "pendaftaran" | "kursus" | "sertifikat" | "pembayaran";
  date: string;
  status: "completed" | "in-progress" | "pending";
  peserta?: string;
};

interface DashboardPemateriRecentActivitiesProps {
  activities: RecentActivity[];
}

export default function DashboardPemateriRecentActivities({ activities }: DashboardPemateriRecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "pendaftaran":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case "kursus":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "sertifikat":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        );
      case "pembayaran":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-gold bg-gold/10 border border-gold/20";
      case "in-progress":
        return "text-navy bg-navy/10 border border-navy/20";
      case "pending":
        return "text-silver bg-silver/20 border border-silver/30";
      default:
        return "text-gray-600 bg-gray-100 border border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "in-progress":
        return "Berlangsung";
      case "pending":
        return "Menunggu";
      default:
        return "Unknown";
    }
  };

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case "pendaftaran":
        return "Pendaftaran Baru";
      case "kursus":
        return "Kursus";
      case "sertifikat":
        return "Sertifikat";
      case "pembayaran":
        return "Pembayaran";
      default:
        return "Aktivitas";
    }
  };

  return (
    <section className="py-16 bg-linear-to-br from-white to-amber-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 border border-gold rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 border border-silver rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Aktivitas <span className="text-gold">Terbaru</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Pantau aktivitas terbaru dari kursus dan peserta Anda</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {activities.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0">
                          <div className="w-10 h-10 bg-linear-to-br from-navy to-blue-700 rounded-full flex items-center justify-center text-white">{getActivityIcon(activity.type)}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{getActivityTypeText(activity.type)}</span>
                            {activity.peserta && <span className="text-xs text-gold">• {activity.peserta}</span>}
                          </div>
                          <h3 className="text-lg font-semibold text-navy mb-1">{activity.title}</h3>
                          <p className="text-gray-500 text-sm">
                            {new Date(activity.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>{getStatusText(activity.status)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-linear-to-br from-navy/10 to-navy/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-navy/20">
                  <svg className="w-8 h-8 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-navy mb-2">Belum Ada Aktivitas</h3>
                <p className="text-gray-500">Aktivitas terbaru dari kursus dan peserta akan muncul di sini</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
