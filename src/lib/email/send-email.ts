import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
  // Resend resolves with `{ data, error }` instead of throwing, so surface
  // the failure explicitly rather than silently "succeeding".
  const { error } = await resend.emails.send({
    from: "Your Store <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
  if (error) {
    throw new Error(error.message || "Failed to send email.");
  }
};
