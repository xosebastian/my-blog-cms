import { Article } from "@/models/article";

/**
 * Fetches a single article by its ID via API.
 *
 * @param id - The ID of the article to fetch.
 * @returns The full article document if found.
 * @throws {Error} If the article is not found or the request fails.
 */
export async function fetchById(id: string): Promise<Article> {
  const res = await fetch(`/api/articles/${id}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Article not found");
    }

    throw new Error("Failed to fetch article");
  }

  const article = await res.json();

  return article;
}
