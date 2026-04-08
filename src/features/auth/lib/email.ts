import { resend } from "@/lib/resend";

export async function sendOTPEmail(email: string, otp: string, type: string): Promise<void> {
  let subject: string;
  let message: string;

  if (type === "EMAIL_VERIFICATION") {
    subject = "Verify Your Email";
    message = `Your verification code is: ${otp}. This code will expire in 10 minutes.`;
  } else if (type === "TWO_FACTOR") {
    subject = "Two-Factor Authentication Code";
    message = `Your two-factor authentication code is: ${otp}. This code will expire in 10 minutes.`;
  } else {
    subject = "Password Reset Code";
    message = `Your password reset code is: ${otp}. This code will expire in 10 minutes.`;
  }

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "raamthiruna@gmail.com",
    subject,
    text: message,
  });
}
