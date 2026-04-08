"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { generateOTP, hashOTP } from "../lib/otp";
import { sendOTPEmail } from "../lib/email";

interface RegisterPayload {
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  verifyToken?: string;
  message: string;
  error?: string;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  try {
    const { email, password } = payload;

    // Validate payload
    if (!email || !password) {
      return { success: false, error: "Email and password are required", message: "" };
    }

    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters", message: "" };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists", message: "" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User and Account
    const user = await prisma.user.create({
      data: {
        email,
        username: email.split("@")[0], // Temporary username
        accounts: {
          create: {
            provider: "credentials",
            providerAccountID: email,
            password: hashedPassword,
          },
        },
      },
    });

    // Generate OTP and verification token
    const otp = generateOTP();
    const verifyToken = randomUUID();
    const otpHash = await hashOTP(otp);

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verifyToken,
        otpHash,
        email,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, "EMAIL_VERIFICATION");

    return {
      success: true,
      verifyToken,
      message: "Registration successful. Please check your email for the verification code.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An error occurred during registration",
      message: "",
    };
  }
}
