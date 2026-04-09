"use server";

import { prisma } from "@/lib/prisma";
import { getSession, updateSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";

interface CreateProfilePayload {
  profileName: string;
  isDefault: boolean;
  whyWorkHere?: string;
  resumeUrl?: string;
  skills: string[];
  experiences: Array<{
    company: string;
    title: string;
    location?: string;
    startDate: Date;
    endDate?: Date | null;
    isCurrent: boolean;
    description: string;
  }>;
  projects: Array<{
    name: string;
    url?: string;
    repoUrl?: string;
    description: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    location?: string;
  }>;
  courses: Array<{
    title: string;
    description: string;
    certificateUrl?: string;
  }>;
  educations: Array<{
    institution: string;
    degree: string;
    startDate: Date;
    endDate?: Date | null;
  }>;
  links: Array<{
    platform: string;
    url: string;
  }>;
}

export async function createProfile(payload: CreateProfilePayload) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // If this profile is set as default, unset all other defaults
    if (payload.isDefault) {
      await prisma.professionalProfile.updateMany({
        where: { userId: session.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Handle skills - find existing or create new
    const skillConnections = await Promise.all(
      payload.skills.map(async (skillName) => {
        const skill = await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName },
        });
        return { id: skill.id };
      })
    );

    // Create profile with all nested relations
    const profile = await prisma.professionalProfile.create({
      data: {
        userId: session.userId,
        profileName: payload.profileName,
        isDefault: payload.isDefault,
        whyWorkHere: payload.whyWorkHere,
        resumeUrl: payload.resumeUrl,
        skills: {
          connect: skillConnections,
        },
        experiences: {
          create: payload.experiences.map((exp) => ({
            company: exp.company,
            title: exp.title,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isCurrent: exp.isCurrent,
            description: exp.description,
          })),
        },
        projects: {
          create: payload.projects.map((proj) => ({
            name: proj.name,
            url: proj.url,
            repoUrl: proj.repoUrl,
            description: proj.description,
          })),
        },
        achievements: {
          create: payload.achievements.map((ach) => ({
            title: ach.title,
            description: ach.description,
            location: ach.location,
          })),
        },
        courses: {
          create: payload.courses.map((course) => ({
            title: course.title,
            description: course.description,
            certificateUrl: course.certificateUrl,
          })),
        },
        educations: {
          create: payload.educations.map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            startDate: edu.startDate,
            endDate: edu.endDate,
          })),
        },
        links: {
          create: payload.links.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        },
      },
    });

    // Check if this is the user's first profile
    const profileCount = await prisma.professionalProfile.count({
      where: { userId: session.userId },
    });

    if (profileCount === 1) {
      // First profile - mark user as onboarded
      await prisma.user.update({
        where: { id: session.userId },
        data: { onboarded: true },
      });
      await updateSession({ onboarded: true });
    }

    revalidatePath("/profiles");
    return { success: true, profileId: profile.id };
  } catch (error) {
    console.error("Create profile error:", error);
    return { success: false, error: "Failed to create profile" };
  }
}
