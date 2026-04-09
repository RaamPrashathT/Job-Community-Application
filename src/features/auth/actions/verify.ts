"use server";

import { prisma } from "@/lib/prisma";
import { verifyOTP } from "../lib/otp";
import { createSession } from "../lib/session";

interface VerifyPayload {
  verifyToken: string;
  otp: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
  error?: string;
  redirectTo?: string;
}

export async function verify(payload: VerifyPayload): Promise<VerifyResponse> {
  try {
    const { verifyToken, otp } = payload;

    if (!verifyToken || !otp) {
      return { success: false, error: "Verification token and OTP are required", message: "" };
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: verifyToken },
      include: { user: true },
    });

    if (!verificationToken) {
      return { success: false, error: "Invalid verification token", message: "" };
    }

    // Check expiration
    if (verificationToken.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
      return { success: false, error: "Verification code has expired", message: "" };
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, verificationToken.otpHash);
    if (!isValid) {
      return { success: false, error: "Invalid verification code", message: "" };
    }

    // Update user based on verification type
    if (verificationToken.type === "EMAIL_VERIFICATION") {
      await prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      });
    }

    // Delete verification token
    await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

    // Create session
    await createSession(verificationToken.user.id, verificationToken.user.onboarded);

    // Determine redirect - admins go to admin dashboard
    let redirectTo = "/discover";
    if (verificationToken.user.role === "ADMIN") {
      redirectTo = "/organizations";
    } else if (!verificationToken.user.onboarded) {
      redirectTo = "/onboarding";
    }

    return {
      success: true,
      message: "Verification successful",
      redirectTo,
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      success: false,
      error: "An error occurred during verification",
      message: "",
    };
  }
}
