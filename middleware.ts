import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("next-auth.session-token");

  if (!sessionToken) {
    console.log("No session token found. Redirecting to sign-in page.");
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
}
