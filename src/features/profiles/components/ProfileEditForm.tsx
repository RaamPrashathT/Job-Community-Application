"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormData } from "../schema/profile.schema";
import { useUpdateProfile } from "../hooks/useProfiles";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "./DatePicker";
import { useState, useEffect } from "react";

interface ProfileEditFormProps {
  profile: any;
  userId: string;
  profileId: string;
}

export function ProfileEditForm({ profile, userId, profileId }: Readonly<ProfileEditFormProps>) {
  const updateProfileMutation = useUpdateProfile(profileId);
  const [skills, setSkills] = useState<string[]>(profile.skills.map((s: any) => s.name));
  const [skillInput, setSkillInput] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      profileName: profile.profileName,
      isDefault: profile.isDefault,
      whyWorkHere: profile.whyWorkHere || "",
      resumeUrl: profile.resumeUrl || "",
      skills: profile.skills.map((s: any) => s.name),
      experiences: profile.experiences.map((exp: any) => ({
        company: exp.company,
        title: exp.title,
        location: exp.location || "",
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        isCurrent: exp.isCurrent,
        description: exp.description,
      })),
      projects: profile.projects.map((proj: any) => ({
        name: proj.name,
        url: proj.url || "",
        repoUrl: proj.repoUrl || "",
        description: proj.description,
      })),
      achievements: profile.achievements.map((ach: any) => ({
        title: ach.title,
        description: ach.description,
        location: ach.location || "",
      })),
      courses: profile.courses.map((course: any) => ({
        title: course.title,
        description: course.description,
        certificateUrl: course.certificateUrl || "",
      })),
      educations: profile.educations.map((edu: any) => ({
        institution: edu.institution,
        degree: edu.degree,
        startDate: new Date(edu.startDate),
        endDate: edu.endDate ? new Date(edu.endDate) : null,
      })),
      links: profile.links.map((link: any) => ({
        platform: link.platform,
        url: link.url,
      })),
    },
  });

  const { fields: experiences, append: appendExperience, remove: removeExperience } = useFieldArray({ control, name: "experiences" });
  const { fields: projects, append: appendProject, remove: removeProject } = useFieldArray({ control, name: "projects" });
  const { fields: achievements, append: appendAchievement, remove: removeAchievement } = useFieldArray({ control, name: "achievements" });
  const { fields: courses, append: appendCourse, remove: removeCourse } = useFieldArray({ control, name: "courses" });
  const { fields: educations, append: appendEducation, remove: removeEducation } = useFieldArray({ control, name: "educations" });
  const { fields: links, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "links" });

  // Watch for changes
  useEffect(() => {
    const subscription = watch(() => {
      setHasChanges(isDirty || skills.length !== profile.skills.length);
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, skills, profile.skills.length]);

  const addSkill = () => {
    if (skillInput.trim()) {
      const normalizedSkill = skillInput.trim().toLowerCase().replaceAll(" ", "_");
      if (!skills.includes(normalizedSkill)) {
        const newSkills = [...skills, normalizedSkill];
        setSkills(newSkills);
        setValue("skills", newSkills, { shouldDirty: true });
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setValue("skills", newSkills, { shouldDirty: true });
  };

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfileMutation.mutateAsync({ ...data, userId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-12">
      {/* Basic Info - Same as ProfileForm */}
      <section className="space-y-6">
        <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Profile Identity</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Profile Name</Label>
            <Input {...register("profileName")} placeholder="e.g., Full-Stack Developer" className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" />
            {errors.profileName && <p className="text-xs text-[#F97C7C] mt-1">{errors.profileName.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="isDefault" checked={watch("isDefault")} onCheckedChange={(checked) => setValue("isDefault", checked as boolean, { shouldDirty: true })} className="border-[#2A2A2A]" />
            <Label htmlFor="isDefault" className="text-sm text-[#AAAAAA] cursor-pointer">Set as default profile</Label>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Why Work Here?</Label>
            <Textarea {...register("whyWorkHere")} placeholder="Your pitch to employers..." className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[120px]" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Resume</Label>
            {profile.resumeUrl && (
              <p className="text-xs text-[#666666] mb-2">Current: <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[#7EE8A2] hover:underline">View</a></p>
            )}
            <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { const file = e.target.files?.[0]; if (file) setValue("resumeFile", file, { shouldDirty: true }); }} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" />
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

      {/* All other sections - same structure as ProfileForm but with edit context */}
      {/* Experiences */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Experience</h2>
          <Button type="button" onClick={() => { appendExperience({ company: "", title: "", location: "", startDate: new Date(), endDate: null, isCurrent: false, description: "" }); setHasChanges(true); }} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Experience
          </Button>
        </div>
        {experiences.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Experience #{index + 1}</h3>
              <button type="button" onClick={() => { removeExperience(index); setHasChanges(true); }} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Company</Label><Input {...register(`experiences.${index}.company`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Title</Label><Input {...register(`experiences.${index}.title`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Location</Label><Input {...register(`experiences.${index}.location`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Start Date</Label><DatePicker value={watch(`experiences.${index}.startDate`)} onChange={(date) => setValue(`experiences.${index}.startDate`, date || new Date(), { shouldDirty: true })} /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">End Date</Label><DatePicker value={watch(`experiences.${index}.endDate`)} onChange={(date) => setValue(`experiences.${index}.endDate`, date || null, { shouldDirty: true })} disabled={watch(`experiences.${index}.isCurrent`)} /></div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={watch(`experiences.${index}.isCurrent`)} onCheckedChange={(checked) => setValue(`experiences.${index}.isCurrent`, checked as boolean, { shouldDirty: true })} className="border-[#2A2A2A]" />
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
          <Button type="button" onClick={() => { appendProject({ name: "", url: "", repoUrl: "", description: "" }); setHasChanges(true); }} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Project
          </Button>
        </div>
        {projects.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Project #{index + 1}</h3>
              <button type="button" onClick={() => { removeProject(index); setHasChanges(true); }} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
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
          <Button type="button" onClick={() => { appendAchievement({ title: "", description: "", location: "" }); setHasChanges(true); }} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Achievement
          </Button>
        </div>
        {achievements.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Achievement #{index + 1}</h3>
              <button type="button" onClick={() => { removeAchievement(index); setHasChanges(true); }} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
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
          <Button type="button" onClick={() => { appendCourse({ title: "", description: "", certificateUrl: "" }); setHasChanges(true); }} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Course
          </Button>
        </div>
        {courses.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Course #{index + 1}</h3>
              <button type="button" onClick={() => { removeCourse(index); setHasChanges(true); }} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Course Title</Label><Input {...register(`courses.${index}.title`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Description</Label><Textarea {...register(`courses.${index}.description`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0] min-h-[100px]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Certificate</Label><Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setValue(`courses.${index}.certificateFile`, file, { shouldDirty: true }); setHasChanges(true); } }} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Education</h2>
          <Button type="button" onClick={() => { appendEducation({ institution: "", degree: "", startDate: new Date(), endDate: null }); setHasChanges(true); }} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Education
          </Button>
        </div>
        {educations.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Education #{index + 1}</h3>
              <button type="button" onClick={() => { removeEducation(index); setHasChanges(true); }} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Institution</Label><Input {...register(`educations.${index}.institution`)} className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Degree</Label><Input {...register(`educations.${index}.degree`)} placeholder="e.g., Bachelor of Science in Computer Science" className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Start Date</Label><DatePicker value={watch(`educations.${index}.startDate`)} onChange={(date) => setValue(`educations.${index}.startDate`, date || new Date(), { shouldDirty: true })} /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">End Date</Label><DatePicker value={watch(`educations.${index}.endDate`)} onChange={(date) => setValue(`educations.${index}.endDate`, date || null, { shouldDirty: true })} placeholder="Present or expected" /></div>
            </div>
          </div>
        ))}
      </section>

      {/* Social Links */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>Social Links</h2>
          <Button type="button" onClick={() => { appendLink({ platform: "", url: "" }); setHasChanges(true); }} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">
            <Plus className="h-4 w-4 mr-2" />Add Link
          </Button>
        </div>
        {links.map((field, index) => (
          <div key={field.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-[#F0F0F0]">Link #{index + 1}</h3>
              <button type="button" onClick={() => { removeLink(index); setHasChanges(true); }} className="text-[#F97C7C] hover:text-[#FF6B6B]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Platform</Label><Input {...register(`links.${index}.platform`)} placeholder="e.g., GitHub, LinkedIn" className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
              <div><Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">URL</Label><Input {...register(`links.${index}.url`)} placeholder="https://..." className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]" /></div>
            </div>
          </div>
        ))}
      </section>

      {/* Submit Button - Only shows when there are changes */}
      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="flex gap-4 p-4 bg-[#111111] border border-[#7EE8A2] rounded-xl shadow-lg">
            <Button type="button" onClick={() => globalThis.history.back()} className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]">Cancel</Button>
            <Button type="submit" disabled={isSubmitting || updateProfileMutation.isPending} className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]">
              {isSubmitting || updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
