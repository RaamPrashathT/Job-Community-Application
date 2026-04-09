"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getPendingOrganizations() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated", organizations: [] };
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized. Admin access required.", organizations: [] };
    }

    const organizations = await prisma.organization.findMany({
      where: { status: "PENDING" },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, organizations };
  } catch (error) {
    console.error("Get pending organizations error:", error);
    return { success: false, error: "Failed to fetch organizations", organizations: [] };
  }
}
