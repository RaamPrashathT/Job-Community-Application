"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";

export async function approveOrganization(orgId: string, newStatus: "ACTIVE" | "REJECTED") {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    await prisma.organization.update({
      where: { id: orgId },
      data: { status: newStatus },
    });

    revalidatePath("/organizations");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Approve organization error:", error);
    return { success: false, error: "Failed to update organization status" };
  }
}
