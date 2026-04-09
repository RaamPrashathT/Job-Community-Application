"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const requestOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  description: z.string().max(500, "Description must be less than 500 characters"),
});

export async function requestOrganization(data: z.infer<typeof requestOrgSchema>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user already has an organization
    const existingOrg = await prisma.organization.findFirst({
      where: { creatorId: session.userId },
    });

    if (existingOrg) {
      return { success: false, error: "You already have an organization. You can only create one." };
    }

    const validated = requestOrgSchema.parse(data);

    await prisma.organization.create({
      data: {
        name: validated.name,
        location: validated.location,
        description: validated.description,
        status: "PENDING",
        creatorId: session.userId,
      },
    });

    revalidatePath("/organizations");
    revalidatePath("/dashboard");
    return { success: true, message: "Organization requested successfully. Pending admin approval." };
  } catch (error) {
    console.error("Request organization error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to request organization" };
  }
}
