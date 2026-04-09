"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getProfile(profileId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated", profile: null };
    }

    const profile = await prisma.professionalProfile.findUnique({
      where: { 
        id: profileId,
        userId: session.userId, // Ensure user owns this profile
      },
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
      return { success: false, error: "Profile not found", profile: null };
    }

    return { success: true, profile };
  } catch (error) {
    console.error("Get profile error:", error);
    return { success: false, error: "Failed to fetch profile", profile: null };
  }
}
