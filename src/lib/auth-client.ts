import { createAuthClient } from "better-auth/react"
 
/**
 * Initializes the BetterAuth client for authentication handling.
 * 
 * This function creates and configures the BetterAuth client with the necessary environment variables,
 * including the `baseURL` for the BetterAuth service and the `projectId` for identifying the project.
 * The client is used to handle authentication-related tasks, such as login, signup, and token management.
 * 
 * @returns {object} The initialized BetterAuth client.
 * 
 * @example
 * // Usage example:
 * const authClient = createAuthClient({
 *   baseURL: process.env.BETTER_AUTH_URL,
 *   projectId: process.env.BETTER_AUTH_URL_PROJECT_ID,
 * });
 */
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    projectId: process.env.BETTER_AUTH_URL_PROJECT_ID,
  });
  