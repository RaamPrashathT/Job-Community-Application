"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getMyApplications() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated", applications: [] };
    }

    const applications = await prisma.jobApplication.findMany({
      where: { userId: session.userId },
      include: {
        jobPost: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, applications };
  } catch (error) {
    console.error("Get my applications error:", error);
    return { success: false, error: "Failed to fetch applications", applications: [] };
  }
}
