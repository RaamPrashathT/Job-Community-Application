"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { applyToJob } from "../actions/apply-job";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { X, Plus, Briefcase } from "lucide-react";

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
}

async function fetchProfiles() {
  const response = await fetch("/api/profiles");
  if (!response.ok) throw new Error("Failed to fetch profiles");
  return response.json();
}

export function ApplyJobModal({ jobId, jobTitle, companyName, onClose }: Readonly<ApplyJobModalProps>) {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
  });

  const mutation = useMutation({
    mutationFn: () => applyToJob(jobId, selectedProfile),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to apply");
      }
    },
  });

  const handleApply = () => {
    if (!selectedProfile) {
      toast.error("Please select a profile");
      return;
    }
    mutation.mutate();
  };

  const handleCreateNew = () => {
    const profileName = `${jobTitle} at ${companyName}`;
    router.push(`/profiles/create?name=${encodeURIComponent(profileName)}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-start">
          <div>
            <h2 className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
              Apply to {jobTitle}
            </h2>
            <p className="text-[#666666] text-sm mt-1">{companyName}</p>
          </div>
          <button onClick={onClose} className="text-[#666666] hover:text-[#F0F0F0]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label className="text-sm text-[#AAAAAA] mb-4 block">Select a profile to apply with:</Label>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-4 border-[#7EE8A2] border-t-transparent rounded-full" />
              </div>
            ) : profiles && profiles.length > 0 ? (
              <RadioGroup value={selectedProfile} onValueChange={setSelectedProfile}>
                <div className="space-y-3">
                  {profiles.map((profile: any) => {
                    const isSelected = selectedProfile === profile.id;
                    return (
                      <label
                        key={profile.id}
                        htmlFor={`profile-${profile.id}`}
                        className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "border-[#7EE8A2] bg-[#0D2E1A]"
                            : "border-[#2A2A2A] hover:border-[#7EE8A2]/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={profile.id} id={`profile-${profile.id}`} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#F0F0F0]">{profile.profileName}</p>
                              {profile.isDefault && (
                                <span className="px-2 py-0.5 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded text-[10px] uppercase">
                                  Default
                                </span>
                              )}
                            </div>
                            {profile.skills && profile.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {profile.skills.slice(0, 5).map((skill: any) => (
                                  <span
                                    key={skill.id}
                                    className="px-2 py-0.5 bg-[#1C1C1C] text-[#AAAAAA] border border-[#2A2A2A] rounded-full text-xs"
                                  >
                                    {skill.name}
                                  </span>
                                ))}
                                {profile.skills.length > 5 && (
                                  <span className="px-2 py-0.5 text-[#666666] text-xs">
                                    +{profile.skills.length - 5} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </RadioGroup>
            ) : (
              <div className="text-center py-8 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg">
                <Briefcase className="h-12 w-12 text-[#666666] mx-auto mb-3" />
                <p className="text-[#666666] mb-4">No profiles found</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#2A2A2A]">
            <Button
              type="button"
              onClick={handleCreateNew}
              className="w-full bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525] mb-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Profile for This Job
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={!selectedProfile || mutation.isPending}
                className="flex-1 bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891] disabled:opacity-50"
              >
                {mutation.isPending ? "Applying..." : "Apply Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
