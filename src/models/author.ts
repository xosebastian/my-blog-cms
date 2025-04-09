/**
 * Represents basic aggregated statistics for an author (raw from DB).
 * 
 * This interface represents the raw data from the database for an author, including the 
 * author's ID (used as the grouping key in MongoDB), the author's name, the total number 
 * of articles they have written, and their image URL.
 * 
 * @interface AuthorStats
 * @property {string} _id - The author's unique ID (used as the MongoDB grouping key).
 * @property {string} authorName - The name of the author.
 * @property {number} totalArticles - The total number of articles authored by the user.
 * @property {string} image - The URL of the author's image (optional).
 */
export interface AuthorStats {
  _id: string      // authorId (as the MongoDB group key)
  authorName: string
  totalArticles: number
  image: string     // URL of the author's image (optional)
}

/**
 * DTO version of AuthorStats with id instead of _id.
 * 
 * This is the DTO (Data Transfer Object) that will be used to send author data to 
 * the client. It is a modified version of `AuthorStats` where the MongoDB `_id` is replaced 
 * by `id`, making it more suitable for client-side consumption.
 * 
 * @type AuthorDto
 * @property {string} id - The author's unique ID, instead of MongoDB's _id.
 * @property {string} name - The name of the author.
 * @property {number} totalArticles - The total number of articles written by the author.
 * @property {string} image - The URL of the author's image (optional).
 */
export type AuthorDto = {
  id: string
  name: string
  totalArticles: number
  image: string
}

/**
 * Converts raw MongoDB AuthorStats into a serializable DTO.
 * 
 * This function takes the raw MongoDB author statistics (AuthorStats) and converts it 
 * into a frontend-friendly AuthorDto by renaming the `_id` field to `id` and retaining 
 * only the necessary fields.
 * 
 * @param {AuthorStats} author - The raw MongoDB author data to convert.
 * @returns {AuthorDto} - The converted AuthorDto with `id` instead of `_id`.
 */
export function toAuthorDto(author: AuthorStats): AuthorDto {
  return {
    id: author._id,
    name: author.authorName,
    totalArticles: author.totalArticles,
    image: author.image,
  }
}
