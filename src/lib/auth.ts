import { betterAuth, User } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { getMongoDB } from './mongo'
import { NextApiRequest } from 'next'
import { UnauthorizedError } from '@/errors/unauthorized-error'
import { nextCookies } from "better-auth/next-js";

type BetterAuthInstance = ReturnType<typeof betterAuth>

let betterAuthServerInstance: BetterAuthInstance | null = null

/**
 * Returns a singleton instance of BetterAuth configured for the server (API routes, middleware, server components).
 * 
 * This instance uses your MongoDB connection via the native driver and the BetterAuth MongoDB adapter.
 * 
 * @example
 * const auth = await getServerAuth()
 * const session = await auth.getSession(req)
 * 
 * @returns {Promise<BetterAuthInstance>} The initialized BetterAuth server instance
 * @throws {Error} If MongoDB connection fails or credentials are missing
 */
export async function getServerAuth(): Promise<BetterAuthInstance> {
  if (betterAuthServerInstance) return betterAuthServerInstance

  const { db } = await getMongoDB()

  betterAuthServerInstance = betterAuth({
    projectId: process.env.BETTER_AUTH_PROJECT_ID!,
    apiKey: process.env.BETTER_AUTH_SECRET!,
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [nextCookies()] 
  })

  return betterAuthServerInstance
}

/**
 * Verifies the authentication of the user based on the session.
 * 
 * @param req - The API request object (Next.js API route).
 * @returns {Promise<SessionUser>} The authenticated user from the session.
 * @throws {Error} If the user is not authenticated (Unauthorized).
 */
export async function verifyAuth(req: NextApiRequest) : Promise<User> {
  const auth = await getServerAuth()

  // Convert req.headers (IncomingHttpHeaders) to Headers for better-auth
  const headers = new Headers(req.headers as Record<string, string>)

  const session = await auth.api.getSession({ headers })
  
  if (!session?.user) {
    throw new UnauthorizedError('Unauthorized: User not logged in or session expired')
  }

  return session.user
}
