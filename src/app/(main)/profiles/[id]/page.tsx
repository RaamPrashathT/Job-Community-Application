"use client";

import { use } from "react";
import { useProfile } from "@/features/profiles/hooks/useProfiles";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Link as LinkIcon, Award, GraduationCap, FileText, Edit } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function ProfileViewPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = use(params);
  const { data: profile, isLoading } = useProfile(id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
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
        <div className="max-w-5xl mx-auto text-center py-12">
          <h2 className="text-xl font-bold text-[#F0F0F0] mb-2">Profile Not Found</h2>
          <Button onClick={() => router.push("/profiles")} className="mt-4">Back to Profiles</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                {profile.profileName}
              </h1>
              {profile.isDefault && (
                <span className="px-2 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded text-[10px] font-medium uppercase tracking-wider">
                  Default
                </span>
              )}
            </div>
            <p className="text-[#666666] text-sm">Created {format(new Date(profile.createdAt), "PPP")}</p>
          </div>
          <Button
            onClick={() => router.push(`/profiles/${id}/edit`)}
            className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Why Work Here */}
        {profile.whyWorkHere && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>Why Work Here?</h2>
            <p className="text-[#AAAAAA] leading-relaxed">{profile.whyWorkHere}</p>
          </section>
        )}

        {/* Resume */}
        {profile.resumeUrl && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>Resume</h2>
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#7EE8A2] hover:underline">
              <FileText className="h-4 w-4" />
              View Resume
            </a>
          </section>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-xs">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {profile.experiences.length > 0 && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Experience</h2>
            <div className="space-y-6">
              {profile.experiences.map((exp) => {
                let endDateDisplay = "N/A";
                if (exp.isCurrent) {
                  endDateDisplay = "Present";
                } else if (exp.endDate) {
                  endDateDisplay = format(new Date(exp.endDate), "MMM yyyy");
                }
                
                return (
                <div key={exp.id} className="border-l-2 border-[#7EE8A2] pl-4">
                  <h3 className="text-[15px] font-semibold text-[#F0F0F0]">{exp.title}</h3>
                  <p className="text-sm text-[#7EE8A2] mt-1">{exp.company}</p>
                  <div className="flex items-center gap-4 text-xs text-[#666666] mt-2">
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(exp.startDate), "MMM yyyy")} - {endDateDisplay}
                    </span>
                  </div>
                  <p className="text-[#AAAAAA] text-sm mt-3 leading-relaxed">{exp.description}</p>
                </div>
              )})}
            </div>
          </section>
        )}

        {/* Projects */}
        {profile.projects.length > 0 && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Projects</h2>
            <div className="grid gap-4">
              {profile.projects.map((project) => (
                <div key={project.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg">
                  <h3 className="text-[15px] font-semibold text-[#F0F0F0]">{project.name}</h3>
                  <div className="flex gap-3 mt-2">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#7EE8A2] hover:underline flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#7EE8A2] hover:underline flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        Repository
                      </a>
                    )}
                  </div>
                  <p className="text-[#AAAAAA] text-sm mt-3">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {profile.achievements.length > 0 && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Achievements</h2>
            <div className="space-y-4">
              {profile.achievements.map((achievement) => (
                <div key={achievement.id} className="flex gap-3">
                  <Award className="h-5 w-5 text-[#7EE8A2] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#F0F0F0]">{achievement.title}</h3>
                    {achievement.location && <p className="text-xs text-[#666666] mt-1">{achievement.location}</p>}
                    <p className="text-[#AAAAAA] text-sm mt-2">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.educations.length > 0 && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Education</h2>
            <div className="space-y-4">
              {profile.educations.map((edu) => (
                <div key={edu.id} className="flex gap-3">
                  <GraduationCap className="h-5 w-5 text-[#7EE8A2] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#F0F0F0]">{edu.degree}</h3>
                    <p className="text-sm text-[#7EE8A2] mt-1">{edu.institution}</p>
                    <p className="text-xs text-[#666666] mt-1">
                      {format(new Date(edu.startDate), "MMM yyyy")} - {edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Courses */}
        {profile.courses.length > 0 && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Courses & Certifications</h2>
            <div className="space-y-4">
              {profile.courses.map((course) => (
                <div key={course.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg">
                  <h3 className="text-[15px] font-semibold text-[#F0F0F0]">{course.title}</h3>
                  <p className="text-[#AAAAAA] text-sm mt-2">{course.description}</p>
                  {course.certificateUrl && (
                    <a href={course.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-[#7EE8A2] hover:underline mt-3">
                      <FileText className="h-3 w-3" />
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {profile.links.length > 0 && (
          <section className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-[17px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Social Links</h2>
            <div className="flex flex-wrap gap-3">
              {profile.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-sm text-[#7EE8A2] hover:border-[#7EE8A2] transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  {link.platform}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
