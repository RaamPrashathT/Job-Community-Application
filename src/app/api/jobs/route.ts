import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Get user's skills
    const profiles = await prisma.professionalProfile.findMany({
      where: { userId: session.userId },
      include: {
        skills: {
          select: { name: true },
        },
      },
    });

    const userSkills = new Set<string>();
    for (const profile of profiles) {
      for (const skill of profile.skills) {
        userSkills.add(skill.name);
      }
    }

    // Build where clause
    const whereClause: any = {
      organization: {
        status: "ACTIVE",
      },
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { organization: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const jobs = await prisma.jobPost.findMany({
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      where: whereClause,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        applications: {
          where: {
            userId: session.userId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasNextPage = jobs.length > limit;
    const jobsToReturn = hasNextPage ? jobs.slice(0, -1) : jobs;
    const nextCursor = hasNextPage ? jobsToReturn[jobsToReturn.length - 1].id : null;

    // Add match information
    const jobsWithMatch = jobsToReturn.map((job) => {
      const matchingSkills = job.requiredSkills.filter((skill) => userSkills.has(skill));
      return {
        ...job,
        matchScore: matchingSkills.length,
        matchingSkills,
        totalRequiredSkills: job.requiredSkills.length,
        hasApplied: job.applications.length > 0,
      };
    });

    return NextResponse.json({
      jobs: jobsWithMatch,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
