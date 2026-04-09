"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  description: z.string().max(500, "Description must be less than 500 characters"),
});

export async function updateMyOrganization(data: z.infer<typeof updateOrgSchema>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    const validated = updateOrgSchema.parse(data);

    // Find user's organization
    const organization = await prisma.organization.findFirst({
      where: { creatorId: session.userId },
    });

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    // Update organization
    await prisma.organization.update({
      where: { id: organization.id },
      data: {
        name: validated.name,
        location: validated.location,
        description: validated.description,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Organization updated successfully" };
  } catch (error) {
    console.error("Update organization error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update organization" };
  }
}
