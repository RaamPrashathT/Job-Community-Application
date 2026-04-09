"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getProfiles() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated", profiles: [] };
    }

    const profiles = await prisma.professionalProfile.findMany({
      where: { userId: session.userId },
      include: {
        _count: {
          select: {
            experiences: true,
            projects: true,
            skills: true,
          },
        },
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, profiles };
  } catch (error) {
    console.error("Get profiles error:", error);
    return { success: false, error: "Failed to fetch profiles", profiles: [] };
  }
}
