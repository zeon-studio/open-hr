import { NextRequest, NextResponse } from "next/server";

// Routes that should be reachable when the user is NOT authenticated.
// A logged-in user landing on one of these is bounced to "/".
const publicUrl = [
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/onboard",
];

// NextAuth v5 cookie names. The dev cookie is unprefixed; production uses
// the __Secure- prefix because the cookie is marked Secure.
const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  // NextAuth v4 fallback in case anyone is on an older shape.
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

const hasSessionCookie = (request: NextRequest) =>
  SESSION_COOKIE_NAMES.some((name) => Boolean(request.cookies.get(name)));

export function proxy(request: NextRequest) {
  // We deliberately do NOT call `auth()` here. NextAuth's auth() decodes
  // and verifies the JWE on every invocation, which adds ~100-150ms per
  // navigation and runs again in the root layout (src/app/layout.tsx).
  // A presence check on the session cookie is enough to drive the
  // redirect logic; a stolen or stale cookie is rejected the moment a
  // real API call returns 401 (apiSlice.ts triggers signOut on that
  // path).
  const isAuth = hasSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  if (publicUrl.some((u) => pathname.startsWith(u))) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuth) {
    let from = pathname;
    if (request.nextUrl.search) from += request.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except Next internals, the API routes (NextAuth's
  // own routes need to run unimpeded), favicon, and any path that looks
  // like a static asset (contains a dot).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)"],
};
