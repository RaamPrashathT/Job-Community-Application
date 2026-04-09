"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  organizationId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export async function submitReview(data: z.infer<typeof reviewSchema>) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    const validated = reviewSchema.parse(data);

    // Check if user already reviewed
    const existingReview = await prisma.organizationReview.findUnique({
      where: {
        organizationId_userId: {
          organizationId: validated.organizationId,
          userId: session.userId,
        },
      },
    });

    if (existingReview) {
      return { success: false, error: "You have already reviewed this organization" };
    }

    // Create review
    await prisma.organizationReview.create({
      data: {
        organizationId: validated.organizationId,
        userId: session.userId,
        rating: validated.rating,
        comment: validated.comment,
      },
    });

    // Update organization average rating
    const reviews = await prisma.organizationReview.findMany({
      where: { organizationId: validated.organizationId },
      select: { rating: true },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.organization.update({
      where: { id: validated.organizationId },
      data: { rating: avgRating },
    });

    revalidatePath(`/community/${validated.organizationId}`);
    revalidatePath("/community");
    return { success: true, message: "Review submitted successfully" };
  } catch (error) {
    console.error("Submit review error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to submit review" };
  }
}
