import { AuthorDto } from "@/models/author"; // Asegúrate de tener este DTO

/**
 * Fetches paginated authors along with the total count of articles each author has.
 *
 * @param page - The page number (1-indexed).
 * @param limit - Number of authors per page.
 * @returns An object containing the list of authors, total count, total pages, and current page.
 */
export async function fetchAuthors(
  page = 1,
  limit = 10
): Promise<{ authors: AuthorDto[]; total: number; totalPages: number; currentPage: number }> {
  const res = await fetch(`/api/authors?page=${page}&limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch authors");
  }

  const data = await res.json();

  return {
    authors: data.authors,
    total: data.total,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  };
}
