import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value as string;
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/cart", "/account"];

  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  try {
    const decoded: Record<string, unknown> = await verifyToken(token);
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cart", "/account"],
};
