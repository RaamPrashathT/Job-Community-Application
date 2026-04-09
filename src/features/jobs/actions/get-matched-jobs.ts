"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";

export async function getMatchedJobs() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated", jobs: [] };
    }

    // Get user's skills from their profiles
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

    // Get all active jobs
    const jobs = await prisma.jobPost.findMany({
      where: {
        organization: {
          status: "ACTIVE",
        },
      },
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

    // Calculate match score for each job
    const jobsWithScore = jobs.map((job) => {
      const matchingSkills = job.requiredSkills.filter((skill) => userSkills.has(skill));
      const matchScore = matchingSkills.length;
      const hasApplied = job.applications.length > 0;

      return {
        ...job,
        matchScore,
        matchingSkills,
        totalRequiredSkills: job.requiredSkills.length,
        hasApplied,
      };
    });

    // Show all jobs, sorted by creation date (newest first)
    const sortedJobs = jobsWithScore.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { success: true, jobs: sortedJobs };
  } catch (error) {
    console.error("Get matched jobs error:", error);
    return { success: false, error: "Failed to fetch jobs", jobs: [] };
  }
}
