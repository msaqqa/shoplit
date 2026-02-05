import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value as string;
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/cart", "/account"];
  const isApiRoute = pathname.startsWith("/api");

  try {
    // Prevent guests from accessing protected pages (Cart, Account)
    if (protectedRoutes.includes(pathname) && !token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    // Prevent guests from accessing any admin route
    if (pathname.startsWith("/admin") && !token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    // Prevent client user from accessing any admin route
    const decoded: Record<string, unknown> = await verifyToken(token);
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    // If the error happens on an API call, return JSON 401 instead of a page redirect
    if (isApiRoute) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cart", "/account"],
};
