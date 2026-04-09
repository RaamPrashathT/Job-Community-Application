"use server";

import { prisma } from "@/lib/prisma";

interface GetJobsParams {
  cursor?: string;
  limit?: number;
}

export async function getJobs({ cursor, limit = 10 }: GetJobsParams = {}) {
  try {
    const jobs = await prisma.jobPost.findMany({
      take: limit + 1, // Fetch one extra to determine if there's a next page
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor
      }),
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            location: true,
            status: true,
          },
        },
      },
      where: {
        organization: {
          status: "ACTIVE", // Only show jobs from active organizations
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasNextPage = jobs.length > limit;
    const jobsToReturn = hasNextPage ? jobs.slice(0, -1) : jobs;
    const nextCursor = hasNextPage ? jobsToReturn[jobsToReturn.length - 1].id : null;

    return {
      success: true,
      jobs: jobsToReturn,
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    console.error("Get jobs error:", error);
    return {
      success: false,
      error: "Failed to fetch jobs",
      jobs: [],
      nextCursor: null,
      hasNextPage: false,
    };
  }
}
