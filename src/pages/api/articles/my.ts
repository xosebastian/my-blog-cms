import { NextApiRequest, NextApiResponse } from 'next';
import { getMongoDB } from '@/lib/mongo';
import { toArticleDto } from '@/models/article';
import { UnauthorizedError } from '@/errors/unauthorized-error'; // Import the custom UnauthorizedError
import { verifyAuth } from '@/lib/auth'; // Function to verify if the user is logged in

/**
 * Handler to fetch the user's articles with pagination.
 *
 * This API route allows an authenticated user to retrieve their articles from the database.
 * It supports pagination by accepting `page` and `limit` query parameters, and 
 * returns a paginated list of articles along with total article count and pagination information.
 *
 * If the user is not authenticated, it throws an UnauthorizedError.
 *
 * @param req - The incoming Next.js API request object containing query parameters (`page`, `limit`) for pagination.
 * @param res - The Next.js API response object to send the response back to the client.
 *
 * @returns {NextApiResponse} - A paginated response containing articles, total count, and pagination info.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching user articles...');
      
      // Verify if the user is authenticated
      const user = await verifyAuth(req); // This will throw an UnauthorizedError if the user is not logged in

      // Get the page and limit from query params (default values if not provided)
      const { page = 1, limit = 10 } = req.query;

      // Convert page and limit to integers
      const currentPage = parseInt(page as string, 10) || 1;
      const pageLimit = parseInt(limit as string, 10) || 10;

      // Calculate skip based on currentPage and pageLimit
      const skip = (currentPage - 1) * pageLimit;

      // Fetch the articles from the database
      const { db } = await getMongoDB();
      const articles = await db
        .collection('articles')
        .find({ authorId: user.id }) // Filter by the author's ID
        .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
        .skip(skip) // Skip articles based on the page
        .limit(pageLimit) // Limit the number of articles fetched per page
        .toArray();

      // Get the total count of articles (for pagination purposes)
      const totalArticles = await db.collection('articles').countDocuments({ authorId: user.id });

      // Convert the articles to DTOs
      const articleDtos = articles.map((article) =>
        toArticleDto({
          _id: article._id,
          title: article.title,
          content: article.content,
          coverImage: article.coverImage,
          authorId: article.authorId,
          authorName: article.authorName,
          createdAt: article.createdAt,
        })
      );

      // Return the paginated articles and total count
      return res.status(200).json({
        articles: articleDtos,
        total: totalArticles,
        totalPages: Math.ceil(totalArticles / pageLimit), // Calculate the total number of pages
        currentPage,
      });

    } catch (error) {
      // If an error occurs, such as user not authenticated, return a 401 error using the custom UnauthorizedError
      if (error instanceof UnauthorizedError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      // Handle any other errors (e.g., database issues)
      return res.status(500).json({ error: 'Failed to fetch articles' });
    }
  } else {
    // If the request method is not GET, return a 405 (Method Not Allowed) error
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
