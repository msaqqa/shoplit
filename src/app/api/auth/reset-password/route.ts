import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { RouteError } from "@/lib/error/route-error-handler";

export async function POST(req: Request) {
  const { email, token, newPassword } = await req.json();
  if (!email || !token || !newPassword) {
    throw new RouteError("Missing required fields.", 400);
  }
  try {
    await verifyToken(token);
    await prisma.user.update({
      where: { email },
      data: { password: await hashPassword(newPassword) },
    });
    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error: unknown) {
    if (error instanceof RouteError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
