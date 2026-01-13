import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { ApiError } from "@/lib/api-error";

export async function POST(req: Request) {
  const { email, token, newPassword } = await req.json();

  try {
    await verifyToken(token);

    await prisma.user.update({
      where: { email },
      data: { password: await hashPassword(newPassword) },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
