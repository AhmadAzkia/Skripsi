"use client";

import BlogDetailView from "../../../components/blog/BlogDetailView";
import { PublicBlogDetailData } from "./actions";

interface PublicBlogDetailProps {
  data: PublicBlogDetailData;
}

export default function PublicBlogDetail({ data }: PublicBlogDetailProps) {
  const { article, relatedArticles, authorArticles } = data;

  return <BlogDetailView article={article} relatedArticles={relatedArticles} authorArticles={authorArticles} mode="public" showEditButton={false} backUrl="/blog" />;
}
