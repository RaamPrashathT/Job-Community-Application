"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getApplicationDetail } from "../actions/get-application-detail";
import { updateApplicationStatus } from "../actions/update-application-status";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Mail, Phone, Briefcase, GraduationCap, 
  Award, BookOpen, Link as LinkIcon, Code, CheckCircle2, XCircle,
  Calendar, MapPin, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface ApplicationDetailProps {
  readonly applicationId: string;
  readonly jobId: string;
}

export function ApplicationDetail({ applicationId, jobId }: ApplicationDetailProps) {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["application-detail", applicationId],
    queryFn: async () => {
      const result = await getApplicationDetail(applicationId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: "RECRUITED" | "REJECTED") =>
      updateApplicationStatus(applicationId, status),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        refetch();
        setTimeout(() => router.push(`/jobs/${jobId}/applicants`), 1500);
      } else {
        toast.error(result.error || "Failed to update status");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#7EE8A2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data?.application || !data?.profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F0F0F0] mb-3">Application Not Found</h2>
          <Link href={`/jobs/${jobId}/applicants`}>
            <Button className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]">
              Back to Applicants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { application, profile } = data;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] bg-[#050505]">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Link 
            href={`/jobs/${jobId}/applicants`} 
            className="inline-flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applicants
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[36px] font-extrabold text-[#F0F0F0] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                {application.user.username}
              </h1>
              <p className="text-[#AAAAAA] text-lg mb-4">
                Applied for: {application.jobPost.title}
              </p>
              <div className="flex flex-col gap-2 text-[#AAAAAA]">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{application.user.email}</span>
                </div>
                {application.user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{application.user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {application.status === "PENDING" && (
              <div className="flex gap-3">
                <Button
                  onClick={() => updateStatusMutation.mutate("REJECTED")}
                  disabled={updateStatusMutation.isPending}
                  className="bg-transparent border border-[#5C1A1A] text-[#F97C7C] hover:bg-[#2E0D0D]"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => updateStatusMutation.mutate("RECRUITED")}
                  disabled={updateStatusMutation.isPending}
                  className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accept & Recruit
                </Button>
              </div>
            )}

            {application.status === "RECRUITED" && (
              <div className="px-4 py-2 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-lg">
                <CheckCircle2 className="h-5 w-5 inline mr-2" />
                Recruited
              </div>
            )}

            {application.status === "REJECTED" && (
              <div className="px-4 py-2 bg-[#2E0D0D] text-[#F97C7C] border border-[#5C1A1A] rounded-lg">
                <XCircle className="h-5 w-5 inline mr-2" />
                Rejected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
        {/* Profile Header */}
        <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
          <h2 className="text-[28px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            {profile.profileName}
          </h2>
          {profile.whyWorkHere && (
            <p className="text-[#AAAAAA] leading-relaxed mb-4">{profile.whyWorkHere}</p>
          )}
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#7EE8A2] hover:text-[#6DD891]"
            >
              <ExternalLink className="h-4 w-4" />
              View Resume
            </a>
          )}
        </div>

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-[#7EE8A2]" />
              <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                Skills
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experiences.length > 0 && (
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-[#7EE8A2]" />
              <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                Experience
              </h3>
            </div>
            <div className="space-y-4">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl">
                  <h4 className="text-[17px] font-semibold text-[#F0F0F0] mb-1">{exp.title}</h4>
                  <p className="text-[#7EE8A2] mb-2">{exp.company}</p>
                  <div className="flex items-center gap-4 text-sm text-[#666666] mb-3">
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                      {exp.isCurrent ? "Present" : format(new Date(exp.endDate!), "MMM yyyy")}
                    </span>
                  </div>
                  <p className="text-[#AAAAAA] text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.educations.length > 0 && (
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-[#7EE8A2]" />
              <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                Education
              </h3>
            </div>
            <div className="space-y-4">
              {profile.educations.map((edu) => (
                <div key={edu.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl">
                  <h4 className="text-[17px] font-semibold text-[#F0F0F0] mb-1">{edu.degree}</h4>
                  <p className="text-[#7EE8A2] mb-2">{edu.institution}</p>
                  <span className="text-sm text-[#666666]">
                    {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                    {edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "Present"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {profile.projects.length > 0 && (
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-[#7EE8A2]" />
              <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                Projects
              </h3>
            </div>
            <div className="space-y-4">
              {profile.projects.map((project) => (
                <div key={project.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl">
                  <h4 className="text-[17px] font-semibold text-[#F0F0F0] mb-2">{project.name}</h4>
                  <p className="text-[#AAAAAA] text-sm mb-3">{project.description}</p>
                  <div className="flex gap-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7EE8A2] text-sm hover:text-[#6DD891] flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7EE8A2] text-sm hover:text-[#6DD891] flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Repository
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {profile.achievements.length > 0 && (
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-[#7EE8A2]" />
              <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                Achievements
              </h3>
            </div>
            <div className="space-y-3">
              {profile.achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl">
                  <h4 className="text-[17px] font-semibold text-[#F0F0F0] mb-1">{achievement.title}</h4>
                  {achievement.location && (
                    <p className="text-[#666666] text-sm mb-2">{achievement.location}</p>
                  )}
                  <p className="text-[#AAAAAA] text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {profile.courses.length > 0 && (
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-[#7EE8A2]" />
              <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                Courses & Certifications
              </h3>
            </div>
            <div className="space-y-3">
              {profile.courses.map((course) => (
                <div key={course.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl">
                  <h4 className="text-[17px] font-semibold text-[#F0F0F0] mb-2">{course.title}</h4>
                  <p className="text-[#AAAAAA] text-sm mb-2">{course.description}</p>
                  {course.certificateUrl && (
                    <a
                      href={course.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7EE8A2] text-sm hover:text-[#6DD891] flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile.links.length > 0 && (
          <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="h-5 w-5 text-[#7EE8A2]" />
              <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                Links
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-[#7EE8A2] hover:text-[#6DD891] hover:border-[#7EE8A2] transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
