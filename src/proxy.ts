import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Only check protected routes
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/goals") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/savings") ||
    pathname.startsWith("/budgets") ||
    pathname.startsWith("/activity") ||
    pathname.startsWith("/tips");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Get session from better-auth
    // Better-auth automatically handles expired sessions and returns null
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If no session (expired or not authenticated), redirect to login
    if (!session?.user) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Additional check: verify session expiration if expiresAt is available
    // Better-auth should handle this, but we check as a safety measure
    if (session.session?.expiresAt) {
      const expiresAt = new Date(session.session.expiresAt);
      const now = new Date();

      if (expiresAt < now) {
        const loginUrl = new URL("/", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    // On error, redirect to login
    console.error("Proxy auth error:", error);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/goals/:path*",
    "/settings/:path*",
    "/reports/:path*",
    "/savings/:path*",
    "/budgets/:path*",
    "/activity/:path*",
    "/tips/:path*",
  ],
};
