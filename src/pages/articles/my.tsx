"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import ArticleList from "@/components/article-list";
import { fetchUserArticles } from "@/lib/articles/fetch-user-articles";
import { deleteArticle } from "@/lib/articles/delete";
import { toast } from "sonner";

/**
 * Page that displays all articles created by the authenticated user.
 *
 * Features:
 * - Pagination via URL query (?page=1)
 * - React Query to fetch and cache user articles
 * - Ability to edit or delete each article
 * - Navigation to article creation page
 */
export default function MyArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Extract current page number from query string (?page=1)
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Number.parseInt(pageParam) : 1;
  const ITEMS_PER_PAGE = 10;

  /**
   * Fetch the user's articles using React Query.
   */
  const { data, error, isLoading } = useQuery({
    queryKey: ["user-articles", currentPage],
    queryFn: () => fetchUserArticles(currentPage, ITEMS_PER_PAGE),
    enabled: currentPage > 0,
  });

  /**
   * Mutation to delete an article by ID.
   * Shows toast and invalidates cache on success.
   */
  const { mutate: removeArticle } = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast.success("Article deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-articles"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete article");
    },
  });

  /**
   * Updates the page number in the URL for pagination.
   *
   * @param page - Page number to navigate to
   */
  const handlePageChange = (page: number) => {
    router.push(`/articles/my?page=${page}`);
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">
          Error fetching articles: {error.message}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Articles</h1>
        <Link href="/articles/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </Link>
      </div>

      {/* Render the list of articles */}
      <ArticleList
        articles={data?.articles || []}
        totalPages={data?.totalPages || 0}
        currentPage={data?.currentPage || 1}
        onPageChange={handlePageChange}
        showAuthor={true}
        title="Articles"
        onEdit={(id) => router.push(`/articles/edit/${id}`)}
        onDelete={(id) => {
          if (confirm("Are you sure you want to delete this article?")) {
            removeArticle(id);
          }
        }}
      />
    </div>
  );
}
