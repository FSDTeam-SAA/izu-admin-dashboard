import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    path.startsWith(route)
  );

  // Logged-in users should not see the auth pages.
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Guests trying to reach a protected page get bounced to login.
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next static/image
     * - static assets / favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
