import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/verify");
  const isProtectedPage = pathname.startsWith("/dashboard");

  // not logged in → block dashboard
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // logged in → block auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/dashboard/:path*"],
};
