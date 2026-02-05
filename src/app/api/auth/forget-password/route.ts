import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/error/route-error-handler";
import { NextResponse } from "next/server";
import { generateOTP, hashOTP } from "@/lib/auth/otp";
import { sendEmailOTP } from "@/lib/email/send-email-otp";
import { forgetPasswordSchema } from "@/lib/schemas/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validations = forgetPasswordSchema.safeParse(body);
    if (!validations.success) {
      const errorMessage = validations.error.issues[0].message;
      throw new AppError(errorMessage || "Invalid forget password data.", 400);
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new AppError("This email is not registered.", 404);
    // 1. create OTP
    const otp = generateOTP();
    // 2. save OTP hash in DB
    await prisma.passwordResetToken.create({
      data: {
        email: body.email,
        tokenHash: hashOTP(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
    });
    // 3. send email OTP
    sendEmailOTP(body.email, otp);
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
