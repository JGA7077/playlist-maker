import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/create") && !request.cookies.get(COOKIE_NAME)) {
    const url = request.nextUrl.clone();
    url.pathname = "/connect";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create/:path*", "/create"],
};
