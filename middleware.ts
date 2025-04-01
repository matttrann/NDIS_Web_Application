import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';

export const runtime = 'experimental-edge';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Get the token directly using JWT
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isAdmin = token?.role === "ADMIN";

  // Redirect logged-in users from auth pages
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/dashboard/questionnaire", req.url)
    );
  }

  // Redirect non-admin users from /admin paths
  if (isLoggedIn && !isAdmin && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard/questionnaire", req.url));
  }

  // Redirect admin users from /dashboard to /admin
  if (isLoggedIn && isAdmin && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard", "/admin"],
};