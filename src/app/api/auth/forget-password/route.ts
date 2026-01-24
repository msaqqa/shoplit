import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/error/route-error-handler";
import { NextResponse } from "next/server";
import { generateOTP, hashOTP } from "@/lib/auth/otp";
import { sendEmailOTP } from "@/lib/email/send-email-otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("This email is not registered.", 404);
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
    // 4. create response
    return NextResponse.json({ message: "OTP sent to email." });
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
