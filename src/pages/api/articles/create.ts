import { NextApiRequest, NextApiResponse } from 'next'
import { getMongoDB } from '@/lib/mongo'
import { articleSchema } from '@/schemas/article-schema'
import { toArticleDto } from '@/models/article'
import { z } from 'zod'
import { verifyAuth } from '@/lib/auth'
/**
 * API handler for creating a new article.
 * 
 * - This handler accepts a POST request to create a new article.
 * - Validates the request body using Zod schema (`articleSchema`).
 * - Verifies if the user is authenticated.
 * - Inserts the article into the `articles` collection in MongoDB.
 * - Returns the created article as a DTO.
 * 
 * @param req - The incoming Next.js API request.
 * @param res - The response object to send back the result or errors.
 * 
 * @returns {NextApiResponse} - The response containing the created article in DTO format, or an error message.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Validate request body with Zod schema (articleSchema)
            const validatedData = articleSchema.parse(req.body)

            // Verify if the user is logged in using the `verifyAuth` function (assumes user authentication)
            const user = await verifyAuth(req) // Throws an error if the user is not authenticated

            // Create the article object using validated data and the authenticated user's info
            const { title, content, coverImage } = validatedData
            const article = {
                title,
                content,
                coverImage,
                authorId: user.id, // Use the authenticated user's id
                authorName: user.name, // Use the authenticated user's name
                createdAt: new Date(), // Set the current date as the article creation date
            }

            // Get the MongoDB client and database instance
            const { db } = await getMongoDB()

            // Insert the article into the "articles" collection
            const result = await db.collection('articles').insertOne(article)

            // Convert the created article to a DTO (Data Transfer Object) format for better structuring
            const articleDto = toArticleDto({
                _id: result.insertedId, // Include the generated MongoDB ObjectId
                ...article,
            })

            // Return the created article as a response
            return res.status(201).json(articleDto)

        } catch (error) {
            // Handle validation errors from Zod
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') })
            }
            // Handle other types of errors (e.g., Unauthorized, Database Errors, etc.)
            return res.status(500).json({ error: 'Failed to create article' })
        }
    } else {
        // Handle unsupported HTTP methods (e.g., anything other than POST)
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
