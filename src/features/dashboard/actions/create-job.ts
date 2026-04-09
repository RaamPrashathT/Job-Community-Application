"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createJobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["Remote", "On-site", "Hybrid"], {
    message: "Please select a valid job type",
  }),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
  openings: z.number().min(1, "At least 1 opening is required").max(100, "Maximum 100 openings allowed"),
});

export async function createJob(data: z.infer<typeof createJobSchema>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's organization
    const organization = await prisma.organization.findFirst({
      where: { creatorId: session.userId },
    });

    if (!organization) {
      return { success: false, error: "No organization found" };
    }

    if (organization.status !== "ACTIVE") {
      return { success: false, error: "Organization must be active to post jobs" };
    }

    const validated = createJobSchema.parse(data);

    await prisma.jobPost.create({
      data: {
        title: validated.title,
        description: validated.description,
        location: validated.location,
        type: validated.type,
        requiredSkills: validated.requiredSkills,
        openings: validated.openings,
        organizationId: organization.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Job posted successfully" };
  } catch (error) {
    console.error("Create job error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create job" };
  }
}
