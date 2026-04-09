import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  url: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
});

export const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
});

export const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Description is required"),
  certificateUrl: z.string().optional(),
  certificateFile: z.instanceof(File).optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid URL"),
});

export const profileFormSchema = z.object({
  profileName: z.string().min(1, "Profile name is required"),
  isDefault: z.boolean().default(false),
  whyWorkHere: z.string().optional(),
  resumeUrl: z.string().optional(),
  resumeFile: z.instanceof(File).optional(),
  skills: z.array(z.string()).default([]),
  experiences: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
  courses: z.array(courseSchema).default([]),
  educations: z.array(educationSchema).default([]),
  links: z.array(socialLinkSchema).default([]),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type AchievementFormData = z.infer<typeof achievementSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;
