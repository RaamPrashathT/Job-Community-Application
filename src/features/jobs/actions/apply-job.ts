"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";

export async function applyToJob(jobPostId: string, profileId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify profile belongs to user
    const profile = await prisma.professionalProfile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });

    if (!profile || profile.userId !== session.userId) {
      return { success: false, error: "Invalid profile" };
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobPostId_userId: {
          jobPostId,
          userId: session.userId,
        },
      },
    });

    if (existingApplication) {
      return { success: false, error: "You have already applied to this job" };
    }

    // Create application
    await prisma.jobApplication.create({
      data: {
        jobPostId,
        userId: session.userId,
        profileId,
      },
    });

    revalidatePath("/discover");
    revalidatePath("/dashboard");
    return { success: true, message: "Application submitted successfully" };
  } catch (error) {
    console.error("Apply to job error:", error);
    return { success: false, error: "Failed to submit application" };
  }
}
