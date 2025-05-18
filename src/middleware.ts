import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./services/AuthService";

// Publicly accessible routes for unauthenticated users
const publicRoutes = ["/login", "/register"];

const roleBasedRoutes = {
  ADMIN: [/^\/dashboard/],
};

type Role = keyof typeof roleBasedRoutes;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access for login/register
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const user = await getCurrentUser(); // gets token from cookies and decodes

  // If not logged in and trying to access dashboard
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    );
  }

  // If user is logged in and trying to access dashboard
  if (user?.role && roleBasedRoutes[user.role as Role]) {
    const allowedRoutes = roleBasedRoutes[user.role as Role];
    if (allowedRoutes.some((routeRegex) => routeRegex.test(pathname))) {
      return NextResponse.next();
    } else if (pathname.startsWith("/dashboard/all-courses")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow access to public pages for everyone else
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
