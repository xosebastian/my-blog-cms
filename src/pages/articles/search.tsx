import { GetServerSideProps } from "next";
import { fetchSearchArticles } from "@/lib/articles/fetch-search-articles";
import ArticleList from "@/components/article-list";
import { ArticleDto } from "@/models/article";
import Head from "next/head";

/**
 * Props for the SearchPage component.
 */
interface SearchPageProps {
  /** Search query string from the URL */
  query: string;
  /** Current page number for pagination */
  currentPage: number;
  /** Total number of matched articles */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** List of articles for the current page */
  articles: ArticleDto[];
}

const ITEMS_PER_PAGE = 10;

/**
 * Page that displays search results for articles filtered by title, content, or author name.
 *
 * @param query - The search string
 * @param currentPage - Current pagination page
 * @param total - Total number of results
 * @param totalPages - Total number of pages
 * @param articles - List of matching articles
 */
export default function SearchPage({
  query,
  currentPage,
  total,
  totalPages,
  articles,
}: SearchPageProps) {
  return (
    <>
      <Head>
        <title>Search Results for “{query}”</title>
        <meta name="description" content={`Search results for "${query}"`} />
      </Head>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              {total} result{total === 1 ? "" : "s"} for “{query}”
            </p>
          )}
        </div>

        <ArticleList
          articles={articles}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => {
            // Full page reload to preserve SSR behavior
            window.location.href = `/articles/search?q=${encodeURIComponent(
              query
            )}&page=${page}`;
          }}
          title=""
        />
      </div>
    </>
  );
}

/**
 * Server-side function to fetch search results before rendering the page.
 *
 * @param context - Next.js server-side context
 * @returns Search results and pagination data as props
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const q = (context.query.q as string) || "";
  const page = parseInt((context.query.page as string) || "1", 10);

  const { articles, total, totalPages, currentPage } =
    await fetchSearchArticles(q, page, ITEMS_PER_PAGE);

  return {
    props: {
      query: q,
      currentPage,
      total,
      totalPages,
      articles,
    },
  };
};
