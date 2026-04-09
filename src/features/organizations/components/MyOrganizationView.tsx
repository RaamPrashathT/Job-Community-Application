"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateMyOrganization } from "../actions/update-my-org";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Save, X, MapPin, FileText } from "lucide-react";

const orgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  description: z.string().max(500, "Description must be less than 500 characters"),
});

type OrgData = z.infer<typeof orgSchema>;

interface MyOrganizationViewProps {
  organization: {
    id: string;
    name: string;
    location: string;
    description: string;
    status: string;
    createdAt: Date;
  };
}

export function MyOrganizationView({ organization }: Readonly<MyOrganizationViewProps>) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<OrgData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: organization.name,
      location: organization.location,
      description: organization.description,
    },
  });

  const mutation = useMutation({
    mutationFn: updateMyOrganization,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update organization");
      }
    },
  });

  const onSubmit = async (data: OrgData) => {
    await mutation.mutateAsync(data);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const descriptionLength = watch("description")?.length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-3 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-xs font-medium uppercase tracking-wider">
            Active
          </span>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-[#2E2A0D] text-[#E8D87E] border border-[#5C5330] rounded-full text-xs font-medium uppercase tracking-wider">
            Pending Approval
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 bg-[#2E0D0D] text-[#F97C7C] border border-[#5C1A1A] rounded-full text-xs font-medium uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                {organization.name}
              </h2>
              {getStatusBadge(organization.status)}
            </div>
            {organization.status !== "REJECTED" && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#7EE8A2] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-widest text-[#666666] mb-1">Location</p>
                <p className="text-[#F0F0F0]">{organization.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-[#7EE8A2] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-[#666666] mb-1">Description</p>
                <p className="text-[#AAAAAA] leading-relaxed">{organization.description}</p>
              </div>
            </div>
          </div>

          {organization.status === "PENDING" && (
            <div className="mt-6 p-4 bg-[#2E2A0D] border border-[#5C5330] rounded-lg">
              <p className="text-sm text-[#E8D87E]">
                Your organization is pending admin approval. You'll be notified once it's reviewed.
              </p>
            </div>
          )}

          {organization.status === "REJECTED" && (
            <div className="mt-6 p-4 bg-[#2E0D0D] border border-[#5C1A1A] rounded-lg">
              <p className="text-sm text-[#F97C7C]">
                Your organization request was rejected. Please contact support for more information.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
            Edit Organization
          </h2>
          {getStatusBadge(organization.status)}
        </div>

        <div>
          <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Organization Name</Label>
          <Input
            {...register("name")}
            placeholder="e.g., Tech Innovators Inc."
            className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
          {errors.name && <p className="text-xs text-[#F97C7C] mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Location</Label>
          <Input
            {...register("location")}
            placeholder="e.g., San Francisco, CA"
            className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
          {errors.location && <p className="text-xs text-[#F97C7C] mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Description</Label>
            <span className="text-xs text-[#666666]">{descriptionLength}/500</span>
          </div>
          <Textarea
            {...register("description")}
            placeholder="Tell us about your organization..."
            className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[150px]"
          />
          {errors.description && <p className="text-xs text-[#F97C7C] mt-1">{errors.description.message}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || mutation.isPending}
            className="flex-1 bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
