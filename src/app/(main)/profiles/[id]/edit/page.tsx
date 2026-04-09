"use client";

import { use } from "react";
import { useProfile } from "@/features/profiles/hooks/useProfiles";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { ProfileEditForm } from "@/features/profiles/components/ProfileEditForm";

export default function EditProfilePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = use(params);
  const { data: profile, isLoading } = useProfile(id);
  const { data: user } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-[#7EE8A2] border-t-transparent rounded-full mx-auto" />
            <p className="text-[#AAAAAA] mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-xl font-bold text-[#F0F0F0] mb-2">Profile Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
          Edit Profile
        </h1>
        <p className="text-[#AAAAAA] mt-2">Update your professional persona</p>
      </div>
      <ProfileEditForm profile={profile} userId={user.id} profileId={id} />
    </div>
  );
}
