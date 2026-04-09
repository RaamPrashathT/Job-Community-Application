"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getMyJobs() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated", jobs: [] };
    }

    // Get user's organization
    const organization = await prisma.organization.findFirst({
      where: { creatorId: session.userId },
    });

    if (!organization) {
      return { success: false, error: "No organization found", jobs: [] };
    }

    const jobs = await prisma.jobPost.findMany({
      where: { organizationId: organization.id },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, jobs };
  } catch (error) {
    console.error("Get my jobs error:", error);
    return { success: false, error: "Failed to fetch jobs", jobs: [] };
  }
}
