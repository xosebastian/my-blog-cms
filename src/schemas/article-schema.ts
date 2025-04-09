import { z } from 'zod'

/**
 * Zod schema for validating article form data.
 *
 * Fields:
 * - title: required non-empty string
 * - content: required non-empty string
 * - coverImage: required valid URL string
 */
export const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url(),
})

/**
 * Type derived from `articleSchema` to be used in forms and mutations.
 */
export type ArticleFormData = z.infer<typeof articleSchema>
