import { ArticleDto } from "@/models/article";

/**
 * Fetches the author details and the paginated articles created by that author.
 *
 * @param authorId - The author's ID.
 * @param page - The page number (1-indexed).
 * @param limit - Number of articles per page.
 * @returns An object containing author details, the paginated list of articles, total count, and total pages.
 */
export async function fetchAuthorArticles(
  authorId: string,
  page = 1,
  limit = 10
): Promise<{
  author: { name: string; articleCount: number; image: string };
  articles: ArticleDto[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const res = await fetch(`/api/articles/authors/${authorId}?page=${page}&limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch articles for author");
  }

  const data = await res.json();

  return {
    author: data.author,
    articles: data.articles,
    total: data.total,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  };
}

