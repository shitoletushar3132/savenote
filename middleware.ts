import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("next-auth.session-token");

  const { pathname } = req.nextUrl;

  // Exclude the sign-in page and static files from the middleware
  if (
    pathname.startsWith("/api/auth/signin") || // Exclude sign-in page
    pathname.startsWith("/_next") || // Exclude Next.js internal files
    pathname.startsWith("/static") || // Exclude static files
    pathname === "/favicon.ico" // Exclude favicon
  ) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    console.log("No session token found. Redirecting to sign-in page.");
    const signInUrl = new URL("/api/auth/signin", req.url); // Ensure proper URL resolution
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
