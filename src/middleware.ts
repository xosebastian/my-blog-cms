import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to check if the user is authenticated by verifying the session.
 * 
 * This middleware checks for a valid session by making a request to the `/api/auth/get-session` endpoint
 * and verifies if the user is authenticated. If not, the user is redirected to the login page.
 * 
 * @param request - The incoming NextRequest containing headers and other request data.
 * @returns {NextResponse} - A redirect to the login page if no session is found, or proceeds to the next middleware/handler.
 */
export async function middleware(request: NextRequest) {
  // Fetch the session data from the authentication API endpoint
  const { data: session } = await betterFetch("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,  // Get the base URL from the request's origin
    headers: {
      cookie: request.headers.get("cookie") || "",  // Pass cookies from the request to maintain session state
    },
  });

  // If no session is found, redirect to the login page
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If a valid session exists, proceed with the request
  return NextResponse.next();
}

/**
 * Configuration for the middleware to apply to specific routes.
 * 
 * The middleware will be triggered for any request to `/articles/my/*` routes.
 */
export const config = {
  matcher: ["/articles/my/:path*", "/articles/edit/:path*"],  // Matches any path under `/articles/my/`
};
