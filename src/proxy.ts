import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0, isAuth0Configured } from "@/lib/auth/auth0";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { logger } from "@/utils/logger";

const protectedPrefixes = [
  "/pocketDashboard",
  "/lobby",
  "/urZeel",
  "/settings",
  "/api",
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const startedAt = Date.now();
  const pathname = request.nextUrl.pathname;
  const authResponse = await auth0.middleware(request);

  // Public auth endpoints must remain accessible without session.
  if (
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/signup" ||
    pathname === "/api/auth/forgot-pass" ||
    pathname === "/api/auth/logout"
  ) {
    logger.info("proxy.pass.publicAuth", {
      path: pathname,
      durationMs: Date.now() - startedAt,
    });
    return NextResponse.next();
  }
  if (!isProtectedPath(pathname)) {
    logger.info("proxy.pass.public", {
      path: pathname,
      durationMs: Date.now() - startedAt,
    });
    return authResponse;
  }

  if (isAuth0Configured) {
    const session = await auth0.getSession(request);
    if (!session) {
      const loginUrl = new URL("/auth/login", request.nextUrl.origin);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      logger.warn("proxy.redirect.unauthorized", {
        path: pathname,
        durationMs: Date.now() - startedAt,
        mode: "auth0",
      });
      return NextResponse.redirect(loginUrl);
    }

    logger.info("proxy.pass.protected", {
      path: pathname,
      durationMs: Date.now() - startedAt,
      mode: "auth0",
    });
    return authResponse;
  }

  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
    logger.warn("proxy.redirect.unauthorized", {
      path: pathname,
      durationMs: Date.now() - startedAt,
      mode: "local",
    });
    return NextResponse.redirect(loginUrl);
  }

  logger.info("proxy.pass.protected", {
    path: pathname,
    durationMs: Date.now() - startedAt,
    mode: "local",
  });
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
