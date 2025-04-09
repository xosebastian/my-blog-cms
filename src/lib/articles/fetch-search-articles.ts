import { getMongoDB } from '@/lib/mongo';
import { toArticleDto } from '@/models/article';
import { ArticleDto } from '@/models/article';

/**
 * Fetches articles based on the search query with pagination.
 *
 * This function performs a search on the `articles` collection in the MongoDB database.
 * It searches by title, content, and author name using regular expressions, and it supports pagination.
 *
 * @param {string} query - The search query string.
 * @param {number} [page=1] - The current page number for pagination (default is 1).
 * @param {number} [limit=10] - The number of articles to return per page (default is 10).
 * @returns {Promise<{ articles: ArticleDto[]; total: number; totalPages: number; currentPage: number }>} A promise containing the paginated articles, total count, total pages, and current page number.
 */
export async function fetchSearchArticles(
  query: string,
  page = 1,
  limit = 10
): Promise<{ articles: ArticleDto[]; total: number; totalPages: number; currentPage: number }> {
  const { db } = await getMongoDB();

  const q = query.trim();
  const skip = (page - 1) * limit;

  const filter = q
    ? {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
          { authorName: { $regex: q, $options: 'i' } },
        ],
      }
    : {};

  const articles = await db
    .collection('articles')
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await db.collection('articles').countDocuments(filter);

  return {
    articles: articles.map((article) =>
      toArticleDto({
        _id: article._id,
        title: article.title,
        content: article.content,
        coverImage: article.coverImage,
        authorId: article.authorId,
        authorName: article.authorName,
        createdAt: article.createdAt,
      })
    ),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
