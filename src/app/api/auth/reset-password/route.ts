import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { AppError } from "@/lib/error/route-error-handler";
import { resetPasswordServerSchema } from "@/lib/schemas/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const validations = resetPasswordServerSchema.safeParse(body);
  if (!validations.success) {
    const errorMessage = validations.error.issues[0].message;
    throw new AppError(errorMessage || "Invalid reset password data.", 400);
  }
  try {
    await verifyToken(body.token as string);
    await prisma.user.update({
      where: { email: body.email },
      data: { password: await hashPassword(body.newPassword) },
    });
    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error: unknown) {
    if (error instanceof AppError) {
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
