import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOTP } from "@/lib/auth/otp";
import { signToken } from "@/lib/auth/jwt";
import { ApiError } from "@/lib/api-error";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!tokenRecord) {
      return NextResponse.json({ message: "OTP not found" }, { status: 404 });
    }

    // check expiration
    if (new Date() > tokenRecord.expiresAt) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // check OTP
    if (tokenRecord.tokenHash !== hashOTP(otp)) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // Optionally: delete the token after verification
    await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });

    // create a token for resetting password
    const resetToken = await signToken({ email }, "5m");

    return NextResponse.json({ message: "OTP verified", token: resetToken });
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
