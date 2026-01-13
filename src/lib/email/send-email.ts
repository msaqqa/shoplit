import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
  await resend.emails.send({
    from: "Your Store <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
};
