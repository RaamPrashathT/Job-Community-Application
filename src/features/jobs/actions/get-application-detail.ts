"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getApplicationDetail(applicationId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        jobPost: {
          include: {
            organization: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    // Verify user owns the organization
    if (application.jobPost.organization.creatorId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the profile that was submitted with the application
    const profile = await prisma.professionalProfile.findUnique({
      where: { id: application.profileId },
      include: {
        experiences: {
          orderBy: { startDate: "desc" },
        },
        projects: true,
        achievements: true,
        courses: true,
        educations: {
          orderBy: { startDate: "desc" },
        },
        links: true,
        skills: true,
      },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    return { success: true, application, profile };
  } catch (error) {
    console.error("Get application detail error:", error);
    return { success: false, error: "Failed to fetch application details" };
  }
}
