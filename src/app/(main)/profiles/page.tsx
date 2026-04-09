"use client";

import { useProfiles } from "@/features/profiles/hooks/useProfiles";
import { useRouter } from "next/navigation";
import { Plus, Briefcase, FolderGit2, Award } from "lucide-react";

export default function ProfilesPage() {
  const { data: profiles, isLoading } = useProfiles();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-[#7EE8A2] border-t-transparent rounded-full mx-auto" />
            <p className="text-[#AAAAAA] mt-4">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
              My Profiles
            </h1>
            <p className="text-[#AAAAAA] mt-2">Manage your targeted professional personas</p>
          </div>
          <button
            onClick={() => router.push("/profiles/create")}
            className="flex items-center gap-2 h-12 px-6 bg-[#7EE8A2] text-[#060F0A] rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#6DD891] transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Profile
          </button>
        </div>

        {profiles && profiles.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 bg-[#0D2E1A] rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-[#7EE8A2]" />
              </div>
              <h3 className="text-xl font-bold text-[#F0F0F0] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                No Profiles Yet
              </h3>
              <p className="text-[#666666] mb-6">
                Create your first targeted profile to start applying for jobs
              </p>
              <button
                onClick={() => router.push("/profiles/create")}
                className="inline-flex items-center gap-2 h-12 px-6 bg-[#7EE8A2] text-[#060F0A] rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#6DD891] transition-all"
              >
                <Plus className="h-4 w-4" />
                Create Your First Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles?.map((profile) => (
              <div
                key={profile.id}
                className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#7EE8A2] transition-all cursor-pointer group"
                onClick={() => router.push(`/profiles/${profile.id}`)}
              >
                {profile.isDefault && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded text-[10px] font-medium uppercase tracking-wider mb-3">
                    Default
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#F0F0F0] mb-2 group-hover:text-[#7EE8A2] transition-colors" style={{ fontFamily: "Syne, sans-serif" }}>
                  {profile.profileName}
                </h3>
                <div className="flex items-center gap-4 text-xs text-[#666666] mt-4">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    <span>{profile._count.experiences} exp</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderGit2 className="h-3 w-3" />
                    <span>{profile._count.projects} projects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>{profile._count.skills} skills</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
