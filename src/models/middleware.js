import { NextResponse } from "next/server";

// Middleware function
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const publicPaths = [
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotPassword",
    "/resetPassword",
  ];


  const token = request.cookies.get("token")?.value || "";

  // 🔹
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  if (publicPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  return NextResponse.next();
}

// Paths middleware applies to
export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    "/resetPassword",
    "/forgotPassword",
  ],
};
