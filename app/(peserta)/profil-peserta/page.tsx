import { Suspense } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfilPesertaClient from "./components/ProfilPesertaClient";

async function ProfilPesertaContent() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase.from("profil_pengguna").select("*").eq("user_id", user.id).single();

  if (error) {
    console.error("Error fetching profile:", error);
    return <ProfilPesertaClient initialData={null} error="Gagal memuat profil pengguna." />;
  }

  // Get peserta statistics (mock data for now)
  const stats = {
    enrolledCourses: 5,
    completedCourses: 3,
    certificates: 2,
    totalHours: 45,
    progressPercentage: 75,
  };

  return (
    <ProfilPesertaClient
      initialData={{
        profile,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        stats,
      }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>

        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-8 animate-pulse"></div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-6 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilPesertaPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProfilPesertaContent />
    </Suspense>
  );
}
