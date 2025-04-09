import { ArticleDto } from "@/models/article";

/**
 * Fetches paginated articles created by the authenticated user via API.
 *
 * @param page - The page number (1-indexed).
 * @param limit - Number of articles per page.
 * @returns An object containing the paginated list of articles, total count, total pages, and current page.
 */
export async function fetchUserArticles(
  page = 1,
  limit = 10
): Promise<{ articles: ArticleDto[]; total: number; totalPages: number; currentPage: number }> {
  const res = await fetch(`/api/articles/my/?page=${page}&limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data = await res.json();

  return {
    articles: data.articles,  
    total: data.total,        
    totalPages: data.totalPages, 
    currentPage: data.currentPage, 
  };
}
