"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createProfile } from "../actions/create-profile";
import { getProfiles } from "../actions/get-profiles";
import { getProfile } from "../actions/get-profile";
import { updateProfile } from "../actions/update-profile";
import { uploadResume } from "@/lib/supabase";
import type { ProfileFormData } from "../schema/profile.schema";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const result = await getProfiles();
      return result.profiles;
    },
  });
}

export function useProfile(profileId: string) {
  return useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => {
      const result = await getProfile(profileId);
      return result.profile;
    },
    enabled: !!profileId,
  });
}

export function useCreateProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileFormData & { userId: string }) => {
      // Handle file uploads first
      let resumeUrl = data.resumeUrl;
      if (data.resumeFile) {
        resumeUrl = await uploadResume(data.resumeFile, data.userId);
      }

      // Handle certificate uploads
      const coursesWithUrls = await Promise.all(
        data.courses.map(async (course) => {
          if (course.certificateFile) {
            const certUrl = await uploadResume(course.certificateFile, data.userId);
            return { ...course, certificateUrl: certUrl, certificateFile: undefined };
          }
          return { ...course, certificateFile: undefined };
        })
      );

      // Prepare payload
      const payload = {
        profileName: data.profileName,
        isDefault: data.isDefault,
        whyWorkHere: data.whyWorkHere,
        resumeUrl,
        skills: data.skills,
        experiences: data.experiences,
        projects: data.projects,
        achievements: data.achievements,
        courses: coursesWithUrls,
        educations: data.educations,
        links: data.links,
      };

      return createProfile(payload);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        router.push("/profiles");
      }
    },
  });
}

export function useUpdateProfile(profileId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileFormData & { userId: string }) => {
      // Handle file uploads first
      let resumeUrl = data.resumeUrl;
      if (data.resumeFile) {
        resumeUrl = await uploadResume(data.resumeFile, data.userId);
      }

      // Handle certificate uploads
      const coursesWithUrls = await Promise.all(
        data.courses.map(async (course) => {
          if (course.certificateFile) {
            const certUrl = await uploadResume(course.certificateFile, data.userId);
            return { ...course, certificateUrl: certUrl, certificateFile: undefined };
          }
          return { ...course, certificateFile: undefined };
        })
      );

      // Prepare payload
      const payload = {
        profileId,
        profileName: data.profileName,
        isDefault: data.isDefault,
        whyWorkHere: data.whyWorkHere,
        resumeUrl,
        skills: data.skills,
        experiences: data.experiences,
        projects: data.projects,
        achievements: data.achievements,
        courses: coursesWithUrls,
        educations: data.educations,
        links: data.links,
      };

      return updateProfile(payload);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
        queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
        router.push(`/profiles/${profileId}`);
      }
    },
  });
}
