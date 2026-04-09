import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    const organization = await prisma.organization.findUnique({
      where: { id, status: "ACTIVE" },
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
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Check if current user has reviewed
    let canReview = false;
    if (session) {
      const userReview = await prisma.organizationReview.findUnique({
        where: {
          organizationId_userId: {
            organizationId: id,
            userId: session.userId,
          },
        },
      });
      canReview = !userReview;
    }

    return NextResponse.json({ organization, canReview });
  } catch (error) {
    console.error("Get organization detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
