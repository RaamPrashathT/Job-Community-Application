"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { revalidatePath } from "next/cache";

interface UpdateProfilePayload {
  profileId: string;
  profileName: string;
  isDefault: boolean;
  whyWorkHere?: string;
  resumeUrl?: string;
  skills: string[];
  experiences: Array<{
    id?: string;
    company: string;
    title: string;
    location?: string;
    startDate: Date;
    endDate?: Date | null;
    isCurrent: boolean;
    description: string;
  }>;
  projects: Array<{
    id?: string;
    name: string;
    url?: string;
    repoUrl?: string;
    description: string;
  }>;
  achievements: Array<{
    id?: string;
    title: string;
    description: string;
    location?: string;
  }>;
  courses: Array<{
    id?: string;
    title: string;
    description: string;
    certificateUrl?: string;
  }>;
  educations: Array<{
    id?: string;
    institution: string;
    degree: string;
    startDate: Date;
    endDate?: Date | null;
  }>;
  links: Array<{
    id?: string;
    platform: string;
    url: string;
  }>;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify ownership
    const existingProfile = await prisma.professionalProfile.findUnique({
      where: { id: payload.profileId },
      select: { userId: true },
    });

    if (!existingProfile || existingProfile.userId !== session.userId) {
      return { success: false, error: "Profile not found or unauthorized" };
    }

    // If setting as default, unset other defaults
    if (payload.isDefault) {
      await prisma.professionalProfile.updateMany({
        where: { userId: session.userId, isDefault: true, id: { not: payload.profileId } },
        data: { isDefault: false },
      });
    }

    // Handle skills
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

    // Delete all existing relations and recreate
    await prisma.professionalProfile.update({
      where: { id: payload.profileId },
      data: {
        experiences: { deleteMany: {} },
        projects: { deleteMany: {} },
        achievements: { deleteMany: {} },
        courses: { deleteMany: {} },
        educations: { deleteMany: {} },
        links: { deleteMany: {} },
      },
    });

    // Update profile with new data
    await prisma.professionalProfile.update({
      where: { id: payload.profileId },
      data: {
        profileName: payload.profileName,
        isDefault: payload.isDefault,
        whyWorkHere: payload.whyWorkHere,
        resumeUrl: payload.resumeUrl,
        skills: {
          set: [],
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

    revalidatePath("/profiles");
    revalidatePath(`/profiles/${payload.profileId}`);
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
