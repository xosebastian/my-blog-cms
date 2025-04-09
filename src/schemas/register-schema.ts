import { z } from "zod"

/**
 * Zod schema for validating user registration form input.
 *
 * Fields:
 * - name: required string with minimum 2 characters
 * - email: required valid email address
 * - password: required string with minimum 6 characters
 * - confirmPassword: required string with minimum 6 characters (must be validated separately to match `password`)
 */
export const registerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password is required'),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  

/**
 * Type derived from `registerSchema` for form validation and submission.
 */
export type RegisterFormData = z.infer<typeof registerSchema>
