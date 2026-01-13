import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api-error";
import { NextResponse } from "next/server";
import { generateOTP, hashOTP } from "@/lib/auth/otp";
import { sendEmailOTP } from "@/lib/email/send-email-otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError("This email is not registered", 404);

    // 1. create OTP
    const otp = generateOTP();
    // 2. save OTP hash in DB
    await prisma.passwordResetToken.create({
      data: {
        email,
        tokenHash: hashOTP(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
    });
    // 3. send email OTP
    sendEmailOTP(email, otp);
    // create response
    return NextResponse.json({ message: "OTP sent to email" });
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
