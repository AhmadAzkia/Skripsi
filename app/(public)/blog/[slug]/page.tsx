import { notFound } from "next/navigation";
import PublicBlogDetail from "./PublicBlogDetail";
import { getPublicBlogDetail } from "./actions";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  try {
    // Get blog detail data using server action
    const result = await getPublicBlogDetail(slug);

    if (!result.success || !result.data) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-navy/5 via-white to-gold/5">
        <PublicBlogDetail data={result.data} />
      </div>
    );
  } catch (error) {
    console.error("Error in BlogDetailPage:", error);
    notFound();
  }
}
