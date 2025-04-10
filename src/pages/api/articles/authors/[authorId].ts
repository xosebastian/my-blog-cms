import { NextApiRequest, NextApiResponse } from "next";
import { getMongoDB } from "@/lib/mongo";
import { toArticleDto } from "@/models/article";
import { ObjectId } from "mongodb";
import { logger } from "better-auth";

/**
 * API handler to fetch articles for a specific author with pagination.
 *
 * This handler retrieves articles from the "articles" collection, filters them by the given author ID,
 * and returns a paginated list of articles. It also returns basic information about the author, such as
 * the author's name, image, and the total number of articles they have published.
 *
 * @param req - The incoming Next.js API request object, which contains query parameters (`authorId`, `page`, `limit`).
 * @param res - The response object to send the result or error back to the client.
 *
 * @returns {NextApiResponse} - A response containing the author's details, paginated articles, and pagination info.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info("Fetching author articles...");
  if (req.method === "GET") {
    try {
      // Get authorId from query params
      const { authorId } = req.query; // Expected to be a string

      // Validate the authorId
      if (!authorId || typeof authorId !== "string") {
        return res.status(400).json({ error: "Author ID is required and must be a string" });
      }

      // Get page and limit from query params with defaults
      const { page = 1, limit = 10 } = req.query;
      const currentPage = parseInt(page as string, 10) || 1;
      const pageLimit = parseInt(limit as string, 10) || 10;
      const skip = (currentPage - 1) * pageLimit;

      const { db } = await getMongoDB();

      // Fetch the author's details from the 'users' collection
      const author = await db.collection("user").findOne({ _id: new ObjectId(authorId) });

      if (!author) {
        return res.status(404).json({ error: "Author not found" });
      }

      // Fetch articles by the author from the 'articles' collection
      const articles = await db
        .collection("articles")
        .find({ authorId: authorId }) // Filter articles by authorId
        .sort({ createdAt: -1 }) // Sort articles by creation date, most recent first (this guarantees consistent ordering)
        .skip(skip) // Skip the number of articles based on the page
        .limit(pageLimit) // Limit the number of articles fetched per page
        .toArray();

      // Get the total count of articles for pagination
      const totalArticles = await db.collection("articles").countDocuments({ authorId: authorId });

      // Convert articles to DTO format for better response structure
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

      // Return the paginated articles along with the author info and pagination details
      return res.status(200).json({
        author: {
          name: author.name,
          articleCount: totalArticles,
          image: author.image, // Include the author's image
        },
        articles: articleDtos,
        total: totalArticles,
        totalPages: Math.ceil(totalArticles / pageLimit), // Calculate the total number of pages
        currentPage,
      });
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Return 405 if the request method is not GET
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
