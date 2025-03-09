import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = req.auth?.user?.role === "ADMIN";

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
});

export const config = {
  matcher: ["/login", "/dashboard", "/admin"],
};