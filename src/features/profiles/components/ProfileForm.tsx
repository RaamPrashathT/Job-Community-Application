"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormData } from "../schema/profile.schema";
import { useCreateProfile } from "../hooks/useProfiles";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "./DatePicker";
import { useState } from "react";

export function ProfileForm() {
  const { data: user } = useCurrentUser();
  const createProfileMutation = useCreateProfile();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      profileName: "",
      isDefault: false,
      whyWorkHere: "",
      skills: [],
      experiences: [],
      projects: [],
      achievements: [],
      courses: [],
      educations: [],
      links: [],
    },
  });

  const { fields: experiences, append: appendExperience, remove: removeExperience } = useFieldArray({ control, name: "experiences" });
  const { fields: projects, append: appendProject, remove: removeProject } = useFieldArray({ control, name: "projects" });
  const { fields: achievements, append: appendAchievement, remove: removeAchievement } = useFieldArray({ control, name: "achievements" });
  const { fields: courses, append: appendCourse, remove: removeCourse } = useFieldArray({ control, name: "courses" });
  const { fields: educations, append: appendEducation, remove: removeEducation } = useFieldArray({ control, name: "educations" });
  const { fields: links, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "links" });

  const addSkill = () => {
    if (skillInput.trim()) {
      const normalizedSkill = skillInput.trim().toLowerCase().replaceAll(" ", "_");
      if (!skills.includes(normalizedSkill)) {
        const newSkills = [...skills, normalizedSkill];
        setSkills(newSkills);
        setValue("skills", newSkills);
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setValue("skills", newSkills);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    await createProfileMutation.mutateAsync({ ...data, userId: user.id });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-12">
      {/* Basic Info */}
      <section className="space-y-6">
        <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Profile Identity</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Profile Name</Label>
            <Input {...register("profileName")} placeholder="e.g., Full-Stack Developer" className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" />
            {errors.profileName && <p className="text-xs text-[#F97C7C] mt-1">{errors.profileName.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="isDefault" checked={watch("isDefault")} onCheckedChange={(checked) => setValue("isDefault", checked as boolean)} className="border-[#2A2A2A]" />
            <Label htmlFor="isDefault" className="text-sm text-[#AAAAAA] cursor-pointer">Set as default profile</Label>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Why Work Here?</Label>
            <Textarea {...register("whyWorkHere")} placeholder="Your pitch to employers..." className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[120px]" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Resume</Label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { const file = e.target.files?.[0]; if (file) setValue("resumeFile", file); }} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Skills</h2>
        <div className="flex gap-2">
          <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add a skill..." className="bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" />
          <Button type="button" onClick={addSkill} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div key={skill} className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-xs">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="hover:text-[#F97C7C]"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Experience</h2>
          <Button type="button" onClick={() => appendExperience({ company: "", title: "", location: "", startDate: new Date(), endDate: null, isCurrent: false, description: "" })} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Experience
          </Button>
        </div>
        {experiences.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Experience #{index + 1}</h3>
              <button type="button" onClick={() => removeExperience(index)} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Company</Label><Input {...register(`experiences.${index}.company`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Title</Label><Input {...register(`experiences.${index}.title`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Location</Label><Input {...register(`experiences.${index}.location`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Start Date</Label><DatePicker value={watch(`experiences.${index}.startDate`)} onChange={(date) => setValue(`experiences.${index}.startDate`, date || new Date())} /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">End Date</Label><DatePicker value={watch(`experiences.${index}.endDate`)} onChange={(date) => setValue(`experiences.${index}.endDate`, date || null)} disabled={watch(`experiences.${index}.isCurrent`)} /></div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={watch(`experiences.${index}.isCurrent`)} onCheckedChange={(checked) => setValue(`experiences.${index}.isCurrent`, checked as boolean)} className="border-[#2A2A2A]" />
              <Label className="text-sm text-[#AAAAAA]">Currently working here</Label>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Description</Label><Textarea {...register(`experiences.${index}.description`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[100px]" /></div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Projects</h2>
          <Button type="button" onClick={() => appendProject({ name: "", url: "", repoUrl: "", description: "" })} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Project
          </Button>
        </div>
        {projects.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Project #{index + 1}</h3>
              <button type="button" onClick={() => removeProject(index)} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Project Name</Label><Input {...register(`projects.${index}.name`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Live URL</Label><Input {...register(`projects.${index}.url`)} placeholder="https://..." className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Repository URL</Label><Input {...register(`projects.${index}.repoUrl`)} placeholder="https://github.com/..." className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Description</Label><Textarea {...register(`projects.${index}.description`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[100px]" /></div>
          </div>
        ))}
      </section>

      {/* Achievements */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Achievements</h2>
          <Button type="button" onClick={() => appendAchievement({ title: "", description: "", location: "" })} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Achievement
          </Button>
        </div>
        {achievements.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Achievement #{index + 1}</h3>
              <button type="button" onClick={() => removeAchievement(index)} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Title</Label><Input {...register(`achievements.${index}.title`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Location</Label><Input {...register(`achievements.${index}.location`)} placeholder="Optional" className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Description</Label><Textarea {...register(`achievements.${index}.description`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[100px]" /></div>
          </div>
        ))}
      </section>

      {/* Courses */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Courses & Certifications</h2>
          <Button type="button" onClick={() => appendCourse({ title: "", description: "", certificateUrl: "" })} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Course
          </Button>
        </div>
        {courses.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Course #{index + 1}</h3>
              <button type="button" onClick={() => removeCourse(index)} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Course Title</Label><Input {...register(`courses.${index}.title`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Description</Label><Textarea {...register(`courses.${index}.description`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[100px]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Certificate</Label><Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const file = e.target.files?.[0]; if (file) setValue(`courses.${index}.certificateFile`, file); }} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Education</h2>
          <Button type="button" onClick={() => appendEducation({ institution: "", degree: "", startDate: new Date(), endDate: null })} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Education
          </Button>
        </div>
        {educations.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Education #{index + 1}</h3>
              <button type="button" onClick={() => removeEducation(index)} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Institution</Label><Input {...register(`educations.${index}.institution`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Degree</Label><Input {...register(`educations.${index}.degree`)} placeholder="e.g., Bachelor of Science in Computer Science" className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Start Date</Label><DatePicker value={watch(`educations.${index}.startDate`)} onChange={(date) => setValue(`educations.${index}.startDate`, date || new Date())} /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">End Date</Label><DatePicker value={watch(`educations.${index}.endDate`)} onChange={(date) => setValue(`educations.${index}.endDate`, date || null)} placeholder="Present or expected" /></div>
            </div>
          </div>
        ))}
      </section>

      {/* Social Links */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Social Links</h2>
          <Button type="button" onClick={() => appendLink({ platform: "", url: "" })} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Link
          </Button>
        </div>
        {links.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Link #{index + 1}</h3>
              <button type="button" onClick={() => removeLink(index)} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Platform</Label><Input {...register(`links.${index}.platform`)} placeholder="e.g., GitHub, LinkedIn" className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">URL</Label><Input {...register(`links.${index}.url`)} placeholder="https://..." className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            </div>
          </div>
        ))}
      </section>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-6 border-t border-[#2A2A2A]">
        <Button type="button" onClick={() => globalThis.history.back()} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">Cancel</Button>
        <Button type="submit" disabled={isSubmitting || createProfileMutation.isPending} className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]">
          {isSubmitting || createProfileMutation.isPending ? "Creating..." : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}
