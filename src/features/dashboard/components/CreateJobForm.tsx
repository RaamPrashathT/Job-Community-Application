"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createJob } from "../actions/create-job";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["Remote", "On-site", "Hybrid"]),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
});

type JobData = z.infer<typeof jobSchema>;

export function CreateJobForm() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<JobData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      requiredSkills: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        reset();
        setSkills([]);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create job");
      }
    },
  });

  const addSkill = () => {
    if (skillInput.trim()) {
      const normalizedSkill = skillInput.trim().toLowerCase().replaceAll(" ", "-");
      if (!skills.includes(normalizedSkill)) {
        const newSkills = [...skills, normalizedSkill];
        setSkills(newSkills);
        setValue("requiredSkills", newSkills, { shouldValidate: true });
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setValue("requiredSkills", newSkills, { shouldValidate: true });
  };

  const onSubmit = async (data: JobData) => {
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Plus className="h-5 w-5 text-[#7EE8A2]" />
        <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
          Post New Job
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Job Title</Label>
          <Input
            {...register("title")}
            placeholder="e.g., Senior Full-Stack Developer"
            className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
          {errors.title && <p className="text-xs text-[#F97C7C] mt-1">{errors.title.message}</p>}
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
      </div>

      <div>
        <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Job Type</Label>
        <Select onValueChange={(value) => setValue("type", value as "Remote" | "On-site" | "Hybrid")}>
          <SelectTrigger className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]">
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-[#2A2A2A]">
            <SelectItem value="Remote" className="text-[#F0F0F0] focus:bg-[#1C1C1C] focus:text-[#F0F0F0]">
              Remote
            </SelectItem>
            <SelectItem value="On-site" className="text-[#F0F0F0] focus:bg-[#1C1C1C] focus:text-[#F0F0F0]">
              On-site
            </SelectItem>
            <SelectItem value="Hybrid" className="text-[#F0F0F0] focus:bg-[#1C1C1C] focus:text-[#F0F0F0]">
              Hybrid
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-xs text-[#F97C7C] mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Required Skills</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill..."
            className="bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
          <Button type="button" onClick={addSkill} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill) => (
            <div key={skill} className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-xs">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="hover:text-[#F97C7C]">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        {errors.requiredSkills && <p className="text-xs text-[#F97C7C] mt-1">{errors.requiredSkills.message}</p>}
      </div>

      <div>
        <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Job Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Describe the role, responsibilities, and requirements..."
          className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[150px]"
        />
        {errors.description && <p className="text-xs text-[#F97C7C] mt-1">{errors.description.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]"
      >
        {mutation.isPending ? "Posting..." : "Post Job"}
      </Button>
    </form>
  );
}
