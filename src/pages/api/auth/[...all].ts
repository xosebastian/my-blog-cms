import { getServerAuth } from '@/lib/auth'
import { toNodeHandler } from 'better-auth/node'

/**
 * Route handler for BetterAuth's built-in authentication endpoints.
 * 
 * This file enables BetterAuth to handle built-in routes like:
 * - /api/auth/login
 * - /api/auth/logout
 * - /api/auth/session
 * - /api/auth/callback
 * 
 * Only works in Page Router with dynamic route [...all].ts
 */
const auth = await getServerAuth()

// Required for BetterAuth to process the raw request body
export const config = { api: { bodyParser: false } }

export default toNodeHandler(auth.handler)
