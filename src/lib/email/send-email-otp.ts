import { emailTemplate } from "./email-template";
import { sendEmail } from "./send-email";

export async function sendEmailOTP(email: string, otp: string) {
  const html = emailTemplate({
    subject: "Verify OTP to reset your password",
    title: `Your OTP code is: ${otp}`,
    description: "This code will expire in 10 minutes.",
  });
  await sendEmail({
    to: email,
    subject: "Verify OTP to reset your password",
    html,
  });
}
