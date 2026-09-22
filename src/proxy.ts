import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isAccountRoute = pathname.startsWith("/account");

  if (isAdminRoute) {
    if (!session) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
      }
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== "ADMIN") {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "ممنوع" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAccountRoute && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account/:path*"],
};
