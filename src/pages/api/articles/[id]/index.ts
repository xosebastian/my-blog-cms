import { NextApiRequest, NextApiResponse } from 'next'
import { getMongoDB } from '@/lib/mongo'
import { ObjectId } from 'mongodb'
import { Article, toArticleDto } from '@/models/article'
import { UnauthorizedError } from '@/errors/unauthorized-error'
import { ArticleNotFoundError } from '@/errors/article-not-found-error'
import { InvalidObjectIdError } from '@/errors/invalid-object-id-error'
import { articleSchema } from '@/schemas/article-schema'
import { verifyAuth } from '@/lib/auth'
import { logger } from '@/lib/logger'

/**
 * API handler to manage articles, including GET, PUT, and DELETE requests.
 *
 * This handler allows authenticated users to:
 * 1. Fetch a single article by its ID (GET).
 * 2. Update an article if the user is the author (PUT), with validation using Zod.
 * 3. Delete an article if the user is the author (DELETE).
 * 
 * @param req - The incoming API request object, which includes the HTTP method and query parameters.
 * @param res - The API response object to send the result or error back to the client.
 * 
 * @returns {NextApiResponse} - The response containing the requested article, success message, or error message.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate the article ID in the request query
  if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid article ID' });
  }

  const objectId = new ObjectId(id);

  try {
    const { db } = await getMongoDB();
    const collection = db.collection('articles');

    // Handle different request methods: GET, PUT, DELETE
    switch (req.method) {
      // GET: Fetch a single article by its ID
      case 'GET': {
        const article = await collection.findOne({ _id: objectId }) as Article;

        if (!article) {
          throw new ArticleNotFoundError(id);
        }

        return res.status(200).json(toArticleDto(article));
      }

      // PUT: Update an article if the user is the author, with validation using Zod
      case 'PUT': {
        // Validate the request body using Zod schema
        const parsed = articleSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            error: 'Invalid article data',
            issues: parsed.error.flatten(), // Return validation issues if any
          });
        }

        // Verify if the user is authenticated
        const user = await verifyAuth(req);

        if (!user) {
          throw new UnauthorizedError();
        }

        // Update the article in the database
        const updateResult = await collection.updateOne(
          { _id: objectId, authorId: user.id },
          { $set: parsed.data }
        );

        // If no article was updated (e.g., article not found or user not the author)
        if (updateResult.matchedCount === 0) {
          throw new ArticleNotFoundError(id);
        }

        return res.status(200).json({ message: 'Article updated successfully' });
      }

      // DELETE: Delete an article if the user is the author
      case 'DELETE': {
        const user = await verifyAuth(req);

        if (!user) {
          throw new UnauthorizedError();
        }

        const deleteResult = await collection.deleteOne({ _id: objectId, authorId: user.id });

        if (deleteResult.deletedCount === 0) {
          throw new ArticleNotFoundError(id);
        }

        return res.status(204).end(); // No content to return
      }

      // If the HTTP method is not GET, PUT, or DELETE, return 405 Method Not Allowed
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    // Handle different errors
    if (error instanceof UnauthorizedError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error instanceof InvalidObjectIdError || error instanceof ArticleNotFoundError) {
      return res.status(400).json({ error: error.message });
    }

    logger.error('[api/articles/[id]] Error:', {
      message: (error as Error)?.message ?? 'unknown',
      stack: (error as Error)?.stack,
    });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
