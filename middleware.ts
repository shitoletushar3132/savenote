import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("next-auth.session-token");
  const { pathname } = req.nextUrl;

  // List of paths to exclude from authentication
  const excludedPaths = [
    "/api/auth", // Allow any route under /api/auth to bypass the middleware
    "/favicon.ico",
    "/logo.png",
    "/_next",
    "/static",
  ];

  // Check if the path starts with any excluded path
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Redirect to sign-in if session token is missing
  if (!sessionToken) {
    console.log("No session token found. Redirecting to sign-in page.");
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
}
