import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOTP } from "@/lib/auth/otp";
import { signToken } from "@/lib/auth/jwt";
import { AppError } from "@/lib/error/route-error-handler";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      throw new AppError("Missing required fields.", 400);
    }

    // Check if token record exists
    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
    if (!tokenRecord) {
      throw new AppError("OTP not found.", 404);
    }
    // check expiration
    if (new Date() > tokenRecord.expiresAt) {
      throw new AppError("OTP expired.", 400);
    }
    // check OTP
    if (tokenRecord.tokenHash !== hashOTP(otp)) {
      throw new AppError("Invalid OTP.", 400);
    }

    // Optionally: delete the token after verification
    await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });

    // create a token for resetting password
    const resetToken = await signToken({ email }, "5m");

    return NextResponse.json({
      message: "OTP verified.",
      data: { token: resetToken },
    });
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
