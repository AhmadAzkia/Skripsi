"use client";

import { useRouter } from "next/navigation";
import BlogDetailView from "../../../components/blog/BlogDetailView";
import { BlogDetailData } from "./actions";

interface PemateriBlogDetailProps {
  data: BlogDetailData;
}

export default function PemateriBlogDetail({ data }: PemateriBlogDetailProps) {
  const router = useRouter();
  const { article, relatedArticles, authorArticles } = data;

  const handleEdit = () => {
    router.push(`/blog-pemateri/edit/${article.id}`);
  };

  return <BlogDetailView article={article} relatedArticles={relatedArticles} authorArticles={authorArticles} mode="pemateri" showEditButton={true} onEdit={handleEdit} backUrl="/blog-pemateri" />;
}
