"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getJobApplicants(jobId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user owns the organization that posted this job
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
      include: {
        organization: true,
        applications: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    if (job.organization.creatorId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    return { success: true, job, applicants: job.applications };
  } catch (error) {
    console.error("Get job applicants error:", error);
    return { success: false, error: "Failed to fetch applicants" };
  }
}
