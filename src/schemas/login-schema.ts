import { z } from 'zod'

/**
 * Zod schema for validating login form input.
 *
 * Fields:
 * - email: must be a valid email address
 * - password: must be at least 6 characters long
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

/**
 * Type derived from `loginSchema` to use with form handling (e.g., React Hook Form).
 */
export type LoginFormData = z.infer<typeof loginSchema>
