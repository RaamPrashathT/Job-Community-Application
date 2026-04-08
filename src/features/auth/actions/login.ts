"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { generateOTP, hashOTP } from "../lib/otp";
import { sendOTPEmail } from "../lib/email";
import { createSession } from "../lib/session";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  error?: string;
  require2fa?: boolean;
  requireVerification?: boolean;
  verifyToken?: string;
  redirectTo?: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const { email, password } = payload;

    // Validate payload
    if (!email || !password) {
      return { success: false, error: "Email and password are required", message: "" };
    }

    // Find user and credentials account
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { provider: "credentials" },
        },
      },
    });

    if (!user || user.accounts.length === 0) {
      return { success: false, error: "Invalid email or password", message: "" };
    }

    const account = user.accounts[0];

    // Compare password
    if (!account.password) {
      return { success: false, error: "Invalid email or password", message: "" };
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password", message: "" };
    }

    // Check if email is verified
    if (!user.emailVerified) {
      const otp = generateOTP();
      const verifyToken = randomUUID();
      const otpHash = await hashOTP(otp);

      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          token: verifyToken,
          otpHash,
          email,
          type: "EMAIL_VERIFICATION",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      await sendOTPEmail(email, otp, "EMAIL_VERIFICATION");

      return {
        success: false,
        requireVerification: true,
        verifyToken,
        message: "Please verify your email. Check your inbox for the verification code.",
      };
    }

    // Check if 2FA is enabled
    if (user.TFAEnabled) {
      const otp = generateOTP();
      const verifyToken = randomUUID();
      const otpHash = await hashOTP(otp);

      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          token: verifyToken,
          otpHash,
          email,
          type: "TWO_FACTOR",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      await sendOTPEmail(email, otp, "TWO_FACTOR");

      return {
        success: false,
        require2fa: true,
        verifyToken,
        message: "Two-factor authentication required. Check your email for the code.",
      };
    }

    // Create session
    await createSession(user.id, user.onboarded);

    const redirectTo = user.onboarded ? "/discover" : "/onboarding";

    return {
      success: true,
      message: "Login successful",
      redirectTo,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login",
      message: "",
    };
  }
}
