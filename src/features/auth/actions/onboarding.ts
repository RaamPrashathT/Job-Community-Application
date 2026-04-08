"use server";

import { prisma } from "@/lib/prisma";
import { getSession, updateSession } from "../lib/session";

interface OnboardingPayload {
  name: string;
  phone?: string;
  enable2FA: boolean;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  error?: string;
  redirectTo?: string;
}

export async function completeOnboarding(payload: OnboardingPayload): Promise<OnboardingResponse> {
  try {
    const { name, phone, enable2FA } = payload;

    // Validate payload
    if (!name) {
      return { success: false, error: "Name is required", message: "" };
    }

    // Get session
    const session = await getSession();
    if (!session) {
      return { success: false, error: "No active session", message: "" };
    }

    // Update user
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        username: name,
        phone: phone || null,
        TFAEnabled: enable2FA,
        onboarded: true,
      },
    });

    // Update session
    await updateSession({ onboarded: true });

    return {
      success: true,
      message: "Onboarding completed successfully",
      redirectTo: "/discover",
    };
  } catch (error) {
    console.error("Onboarding error:", error);
    return {
      success: false,
      error: "An error occurred during onboarding",
      message: "",
    };
  }
}
