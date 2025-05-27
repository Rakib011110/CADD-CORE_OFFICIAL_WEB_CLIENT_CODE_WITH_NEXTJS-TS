import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./services/AuthService";

// Publicly accessible routes for unauthenticated users
const publicRoutes = ["/login", "/register", "/verify-email"]; // Add verify-email route

const roleBasedRoutes = {
  ADMIN: [/^\/dashboard(\/.*)?$/], // All dashboard routes
  USER: [/^\/user-profile(\/.*)?$/], // All user-profile routes
};

type Role = keyof typeof roleBasedRoutes;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access for login/register/verify-email
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const user = await getCurrentUser();


  // If not logged in and trying to access protected route
  if (!user) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/user-profile")) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
    return NextResponse.next();
  }

  // Check if email is verified
// Fix: Ensure boolean comparison
const isEmailVerified = user.emailVerified === true || user.emailVerified === 'true';
if (!isEmailVerified && (pathname.startsWith("/dashboard") || pathname.startsWith("/user-profile"))) {
  return NextResponse.redirect(new URL('/verify-email', request.url));
}
  // Check if user has access to the requested path
  const userRole = user.role as Role;
  const allowedRoutes = roleBasedRoutes[userRole];

  // If route is allowed for the user's role
  if (allowedRoutes?.some((routeRegex) => routeRegex.test(pathname))) {
    return NextResponse.next();
  }

  // If user is trying to access a route not allowed for their role
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/user-profile")) {
    // Redirect to default page based on role
    const redirectPath = userRole === "ADMIN" ? "/dashboard" : "/user-profile";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Allow access to other public pages
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user-profile/:path*",
    "/login",
    "/register",
    "/verify-email"
  ],
};