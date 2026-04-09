import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    const whereClause: any = {
      status: "ACTIVE", // Only show active organizations
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const organizations = await prisma.organization.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            jobs: true,
            reviews: true,
          },
        },
      },
      orderBy: [
        { rating: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Get organizations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
