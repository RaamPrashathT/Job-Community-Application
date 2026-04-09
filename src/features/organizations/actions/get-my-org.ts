"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getMyOrganization() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated", organization: null };
    }

    const organization = await prisma.organization.findFirst({
      where: { creatorId: session.userId },
    });

    return { success: true, organization };
  } catch (error) {
    console.error("Get my organization error:", error);
    return { success: false, error: "Failed to fetch organization", organization: null };
  }
}
