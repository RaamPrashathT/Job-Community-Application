"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createSession } from "../lib/session";

interface AdminLoginPayload {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  success: boolean;
  message: string;
  error?: string;
  redirectTo?: string;
}

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
  try {
    const { email, password } = payload;

    if (!email || !password) {
      return { success: false, error: "Email and password are required", message: "" };
    }

    // Find user and check if they're an admin
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { provider: "credentials" },
        },
      },
    });

    if (!user || user.accounts.length === 0) {
      return { success: false, error: "Invalid credentials", message: "" };
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return { success: false, error: "Access denied. Admin privileges required.", message: "" };
    }

    const account = user.accounts[0];

    if (!account.password) {
      return { success: false, error: "Invalid credentials", message: "" };
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid credentials", message: "" };
    }

    // Create session
    await createSession(user.id, true); // Admins are always considered onboarded

    return {
      success: true,
      message: "Admin login successful",
      redirectTo: "/organizations",
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      error: "An error occurred during login",
      message: "",
    };
  }
}
