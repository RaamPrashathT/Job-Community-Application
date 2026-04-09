"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { requestOrganization } from "../actions/request-org";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const orgRequestSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  description: z.string().max(500, "Description must be less than 500 characters"),
});

type OrgRequestData = z.infer<typeof orgRequestSchema>;

export function OrgRequestForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrgRequestData>({
    resolver: zodResolver(orgRequestSchema),
  });

  const mutation = useMutation({
    mutationFn: requestOrganization,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to request organization");
      }
    },
  });

  const onSubmit = async (data: OrgRequestData) => {
    await mutation.mutateAsync(data);
  };

  const descriptionLength = watch("description")?.length || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
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
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="flex-1 bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]"
        >
          {isSubmitting || mutation.isPending ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}
