'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import AuthorList from '@/components/author-list';
import { fetchAuthors } from '@/lib/authors/fetchAuthors';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 10;

/**
 * Home page that displays a paginated list of authors.
 *
 * Features:
 * - Fetches authors using React Query
 * - Supports pagination via query parameter (?page=)
 * - Shows loading and error states
 */
export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read the current page from the URL query string
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Number.parseInt(pageParam) : 1;

  /**
   * Fetches authors using React Query with pagination.
   */
  const { data, error, isLoading } = useQuery({
    queryKey: ['authors', currentPage],
    queryFn: () => fetchAuthors(currentPage, ITEMS_PER_PAGE),
    staleTime: 5000, // Avoid refetching within 5 seconds
  });

  /**
   * Updates the page in the URL query string.
   * @param page - Page number to navigate to
   */
  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      <AuthorList
        authors={data?.authors || []}
        totalPages={data?.totalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
