"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ArticleList from "@/components/article-list";
import { fetchAuthorArticles } from "@/lib/articles/fetch-author-articles";
import { Button } from "@/components/ui/button";

/**
 * Page to display a paginated list of articles written by a specific author.
 *
 * Features:
 * - Fetches articles server-side by `authorId` using React Query.
 * - Supports pagination via query params.
 * - Displays total article count and author name.
 */
export default function AuthorArticlesPage() {
  const router = useRouter();
  const params = useParams();
  const authorId = params?.authorId as string;
  const searchParams = useSearchParams();

  // Get current page number from query params (?page=)
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Number.parseInt(pageParam) : 1;
  const ITEMS_PER_PAGE = 10;

  /**
   * Fetches articles for the specified author using React Query.
   */
  const { data, error, isLoading } = useQuery({
    queryKey: ["author-articles", authorId, currentPage],
    queryFn: () => fetchAuthorArticles(authorId, currentPage, ITEMS_PER_PAGE),
    enabled: !!authorId && !!currentPage,
  });

  /**
   * Updates the page number in the URL when pagination changes.
   *
   * @param page - The page number to navigate to
   */
  const handlePageChange = (page: number) => {
    router.push(`/articles/${authorId}?page=${page}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">
          Error fetching articles for author: {error.message}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data?.author && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Articles by {data.author.name}</h1>
          <p className="text-muted-foreground">
            {data.author.articleCount}{" "}
            {data.author.articleCount === 1 ? "article" : "articles"} published
          </p>
        </div>
      )}

      <ArticleList
        articles={data?.articles || []}
        totalPages={data?.totalPages || 1}
        currentPage={data?.currentPage || 1}
        onPageChange={handlePageChange}
        showAuthor={false}
        title=""
      />
    </div>
  );
}
