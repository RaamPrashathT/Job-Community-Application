import { getMyJobs } from "../actions/get-my-jobs";
import { MapPin, Briefcase, Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProviderDashboardProps {
  organization: {
    id: string;
    name: string;
    location: string;
    description: string;
    status: string;
  };
}

export async function ProviderDashboard({ organization }: Readonly<ProviderDashboardProps>) {
  const result = await getMyJobs();

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

  const getJobTypeBadge = (type: string) => {
    const colors = {
      Remote: "bg-[#0D2E1A] text-[#7EE8A2] border-[#1A5C30]",
      "On-site": "bg-[#2E1A0D] text-[#E8A27E] border-[#5C3A1A]",
      Hybrid: "bg-[#1A1A2E] text-[#7E9FE8] border-[#2A3A5C]",
    };
    return colors[type as keyof typeof colors] || "bg-[#1C1C1C] text-[#AAAAAA] border-[#2A2A2A]";
  };

  return (
    <div className="space-y-8">
      {/* Organization Info */}
      <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                {organization.name}
              </h2>
              {getStatusBadge(organization.status)}
            </div>
            <div className="flex items-center gap-2 text-[#666666] text-sm">
              <MapPin className="h-4 w-4" />
              {organization.location}
            </div>
          </div>
        </div>
        <p className="text-[#AAAAAA] leading-relaxed">{organization.description}</p>
      </div>

      {/* Gatekeeper Logic */}
      {organization.status === "PENDING" && (
        <div className="p-6 bg-[#2E2A0D] border border-[#5C5330] rounded-xl">
          <h3 className="text-[17px] font-bold text-[#E8D87E] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Pending Approval
          </h3>
          <p className="text-[#E8D87E] text-sm">
            Your organization is pending admin approval. You cannot post jobs until your organization is activated.
          </p>
        </div>
      )}

      {organization.status === "REJECTED" && (
        <div className="p-6 bg-[#2E0D0D] border border-[#5C1A1A] rounded-xl">
          <h3 className="text-[17px] font-bold text-[#F97C7C] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Organization Rejected
          </h3>
          <p className="text-[#F97C7C] text-sm">
            Your organization request was rejected. Please contact support for more information.
          </p>
        </div>
      )}

      {/* Post Job Button - Only for ACTIVE organizations */}
      {organization.status === "ACTIVE" && (
        <Link href="/jobs/new">
          <Button className="w-full bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      )}

      {/* Posted Jobs List */}
      <div className="space-y-4">
        <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
          Your Posted Jobs ({result.jobs.length})
        </h3>

        {result.jobs.length === 0 ? (
          <div className="p-8 bg-[#111111] border border-[#2A2A2A] rounded-xl text-center">
            <Briefcase className="h-12 w-12 text-[#666666] mx-auto mb-3" />
            <p className="text-[#666666]">No jobs posted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.jobs.map((job) => (
              <div key={job.id} className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl hover:border-[#7EE8A2] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[17px] font-semibold text-[#F0F0F0]">{job.title}</h4>
                  <span className={`px-2 py-1 border rounded-full text-xs ${getJobTypeBadge(job.type)}`}>
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#666666] mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-[#AAAAAA] text-sm line-clamp-2">{job.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
