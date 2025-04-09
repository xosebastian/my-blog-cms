"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Article } from "@/models/article";
import { fetchById } from "@/lib/articles/fetch-by-id";
import Head from "next/head";

/**
 * Displays a single article in a detailed view.
 *
 * Features:
 * - Fetches article data by ID using React Query
 * - Handles loading and error states
 * - Displays title, content, author info, and publish date
 * - Includes navigation buttons to go back or see more from the same author
 */
export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params?.id as string;

  /**
   * Fetch the article data from the API using the article ID from route params.
   */
  const {
    data: article,
    error,
    isLoading,
  } = useQuery<Article, Error>({
    queryKey: ["article", articleId],
    queryFn: () => fetchById(articleId),
    enabled: !!articleId,
  });

  if (isLoading) {
    return <div className="py-12 text-center">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">Failed to load the article</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} - Article View</title>
        <meta name="description" content={article.title} />
      </Head>
      <div className="mx-auto max-w-3xl">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>

        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <Link
                  href={`/articles/${article.authorId}`}
                  className="hover:underline"
                >
                  {article.authorName}
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose max-w-none">
              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Link href={`/articles/author/${article.authorId}`}>
              <Button variant="outline">More from {article.authorName}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
