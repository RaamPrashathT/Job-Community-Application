"use client";

import { MapPin, Calendar, Building2, Briefcase } from "lucide-react";
import { format } from "date-fns";

interface Application {
  id: string;
  createdAt: Date;
  jobPost: {
    id: string;
    title: string;
    description: string;
    location: string;
    type: string;
    requiredSkills: string[];
    createdAt: Date;
    organization: {
      id: string;
      name: string;
      location: string;
    };
  };
}

interface SeekerDashboardProps {
  applications: Application[];
}

export function SeekerDashboard({ applications }: Readonly<SeekerDashboardProps>) {
  const getJobTypeBadge = (type: string) => {
    const colors = {
      Remote: "bg-[#0D2E1A] text-[#7EE8A2] border-[#1A5C30]",
      "On-site": "bg-[#2E1A0D] text-[#E8A27E] border-[#5C3A1A]",
      Hybrid: "bg-[#1A1A2E] text-[#7E9FE8] border-[#2A3A5C]",
    };
    return colors[type as keyof typeof colors] || "bg-[#1C1C1C] text-[#AAAAAA] border-[#2A2A2A]";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-extrabold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
          My Applications
        </h2>
        <p className="text-[#666666] text-sm mt-1">
          {applications.length} {applications.length === 1 ? "application" : "applications"}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 bg-[#111111] border border-[#2A2A2A] rounded-xl text-center">
          <Briefcase className="h-16 w-16 text-[#666666] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F0F0F0] mb-2">No Applications Yet</h3>
          <p className="text-[#666666]">Visit the Discover page to find jobs matching your skills</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-[20px] font-bold text-[#F0F0F0] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                    {application.jobPost.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[#7EE8A2] text-sm mb-3">
                    <Building2 className="h-4 w-4" />
                    {application.jobPost.organization.name}
                  </div>
                </div>
                <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getJobTypeBadge(application.jobPost.type)}`}>
                  {application.jobPost.type}
                </span>
              </div>

              <p className="text-[#AAAAAA] leading-relaxed mb-4">{application.jobPost.description}</p>

              {/* Required Skills */}
              {application.jobPost.requiredSkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-widest text-[#666666] mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {application.jobPost.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 text-xs text-[#666666] pt-4 border-t border-[#2A2A2A]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {application.jobPost.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Applied {format(new Date(application.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
