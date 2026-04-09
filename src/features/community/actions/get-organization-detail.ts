"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getOrganizationDetail(organizationId: string) {
  try {
    const session = await getSession();

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId, status: "ACTIVE" },
      include: {
        jobs: {
          where: {
            organization: {
              status: "ACTIVE",
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!organization) {
      return { success: false, error: "Organization not found", organization: null };
    }

    // Check if current user has reviewed
    let userReview = null;
    if (session) {
      userReview = await prisma.organizationReview.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: session.userId,
          },
        },
      });
    }

    return {
      success: true,
      organization,
      userReview,
      canReview: !!session && !userReview,
    };
  } catch (error) {
    console.error("Get organization detail error:", error);
    return { success: false, error: "Failed to fetch organization", organization: null };
  }
}
