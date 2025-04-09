import { NextApiRequest, NextApiResponse } from "next";
import { getMongoDB } from "@/lib/mongo";
import { toAuthorDto } from "@/models/author";
import { UnauthorizedError } from "@/errors/unauthorized-error";

/**
 * API handler to fetch authors along with their article count and profile image.
 * This handler supports pagination and retrieves the authors from the articles collection.
 * 
 * @param req - The incoming request object containing query parameters for pagination.
 * @param res - The response object to return the result or errors.
 * 
 * @returns {NextApiResponse} - The response containing the authors' data, total count, and pagination details.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Extract the page and limit from query parameters, with default values if not provided
      const { page = 1, limit = 10 } = req.query;
      const currentPage = parseInt(page as string, 10) || 1;
      const pageLimit = parseInt(limit as string, 10) || 10;
      const skip = (currentPage - 1) * pageLimit;

      const { db } = await getMongoDB();

      // Aggregate query to fetch authors and count their articles
      const authors = await db
        .collection("articles")
        .aggregate([
          {
            $group: {
              _id: "$authorId", // Group articles by authorId
              articleCount: { $sum: 1 }, // Count the number of articles per author
              authorName: { $first: "$authorName" }, // Get the author's name
            },
          },
          { $skip: skip }, // Pagination: skip articles based on the page
          { $limit: pageLimit }, // Pagination: limit the number of authors per page
          {
            $lookup: {
              from: "user", // Lookup user details from the "user" collection
              let: { authorId: "$_id" }, // Pass authorId to the pipeline
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        { $toString: "$_id" }, // Convert user _id to string
                        { $toString: "$$authorId" }, // Compare to the authorId
                      ],
                    },
                  },
                },
              ],
              as: "userDetails", // Add the user data as a new field
            },
          },
          {
            $unwind: {
              path: "$userDetails", // Unwind the userDetails array
              preserveNullAndEmptyArrays: true, // Keep authors even if they don't have matching user details
            },
          },
        ])
        .toArray();

      // Get the total number of unique authors for pagination purposes
      const total = await db
        .collection("articles")
        .distinct("authorId")
        .then((authors) => authors.length);

      // Convert author data to DTO format and include image if available
      const authorDtos = authors.map((author) =>
        toAuthorDto({
          _id: author._id,
          authorName: author.authorName,
          totalArticles: author.articleCount,
          image: author.userDetails?.image, // Use default image if no user details are found
        })
      );

      // Send the response with authors' data, pagination info, and total authors count
      return res.status(200).json({
        authors: authorDtos,
        total,
        totalPages: Math.ceil(total / pageLimit), // Calculate total pages for pagination
        currentPage,
      });
    } catch {
      // Return an error if there was an issue fetching the authors
      return res.status(401).json({ error: new UnauthorizedError().message });
    }
  } else {
    // If the method is not GET, return a "Method Not Allowed" error
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
