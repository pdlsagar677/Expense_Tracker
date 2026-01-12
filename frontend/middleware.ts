import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/expenses", "/profile", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip non-protected routes
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check cookie (JWT stored as httpOnly)
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // JWT verification happens on backend → frontend middleware just redirects
  return NextResponse.next();
}

// Apply middleware only to protected paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
