import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // proposal 페이지에 pathname 헤더 주입 (root layout에서 헤더/푸터 제거용)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);

  if (isDashboard && !token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (isAuthPage && token && pathname !== "/reset-password") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/proposal/:path*",
  ],
};
