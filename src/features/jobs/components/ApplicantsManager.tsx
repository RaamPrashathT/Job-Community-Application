"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getJobApplicants } from "../actions/get-job-applicants";
import { recruitApplicants } from "../actions/recruit-applicants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Mail, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

interface ApplicantsManagerProps {
  readonly jobId: string;
}

export function ApplicantsManager({ jobId }: ApplicantsManagerProps) {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["job-applicants", jobId],
    queryFn: async () => {
      const result = await getJobApplicants(jobId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  const recruitMutation = useMutation({
    mutationFn: () => recruitApplicants(jobId, selectedApplicants),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setSelectedApplicants([]);
        refetch();
      } else {
        toast.error(result.error || "Failed to recruit applicants");
      }
    },
  });

  const toggleApplicant = (applicantId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(applicantId)
        ? prev.filter((id) => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const toggleAll = () => {
    if (!data?.applicants) return;
    
    const pendingApplicants = data.applicants
      .filter((app: any) => app.status === "PENDING")
      .map((app: any) => app.id);

    if (selectedApplicants.length === pendingApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(pendingApplicants);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#7EE8A2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data?.job) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#F0F0F0] mb-3">Job Not Found</h2>
          <Link href="/dashboard">
            <Button className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { job, applicants } = data;
  const pendingApplicants = applicants.filter((app: any) => app.status === "PENDING");
  const recruitedApplicants = applicants.filter((app: any) => app.status === "RECRUITED");
  const remainingOpenings = job.openings - recruitedApplicants.length;

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { icon: Clock, color: "bg-[#2E1A0D] text-[#E8A27E] border-[#5C3A1A]", label: "Pending" },
      RECRUITED: { icon: CheckCircle2, color: "bg-[#0D2E1A] text-[#7EE8A2] border-[#1A5C30]", label: "Recruited" },
      REJECTED: { icon: XCircle, color: "bg-[#2E0D0D] text-[#F97C7C] border-[#5C1A1A]", label: "Rejected" },
    };
    const badge = badges[status as keyof typeof badges] || badges.PENDING;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] bg-[#050505]">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#AAAAAA] hover:text-[#F0F0F0] mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[36px] font-extrabold text-[#F0F0F0] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                {job.title}
              </h1>
              <p className="text-[#AAAAAA] text-lg mb-4">{job.organization.name}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#7EE8A2]" />
                  <span className="text-[#AAAAAA]">
                    <span className="text-[#F0F0F0] font-semibold">{applicants.length}</span> Total Applicants
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#7EE8A2]" />
                  <span className="text-[#AAAAAA]">
                    <span className="text-[#F0F0F0] font-semibold">{recruitedApplicants.length}/{job.openings}</span> Positions Filled
                  </span>
                </div>
              </div>
            </div>

            {pendingApplicants.length > 0 && remainingOpenings > 0 && (
              <Button
                onClick={() => recruitMutation.mutate()}
                disabled={selectedApplicants.length === 0 || recruitMutation.isPending}
                className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891] h-12 px-6"
              >
                <Mail className="h-4 w-4 mr-2" />
                {recruitMutation.isPending 
                  ? "Recruiting..." 
                  : `Recruit ${selectedApplicants.length} ${selectedApplicants.length === 1 ? "Applicant" : "Applicants"}`
                }
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {remainingOpenings === 0 && (
          <div className="p-6 bg-[#0D2E1A] border border-[#1A5C30] rounded-2xl mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-[#7EE8A2]" />
              <div>
                <h3 className="text-[#F0F0F0] font-bold text-lg">All Positions Filled</h3>
                <p className="text-[#7EE8A2] text-sm">You've recruited {job.openings} {job.openings === 1 ? "applicant" : "applicants"} for this position.</p>
              </div>
            </div>
          </div>
        )}

        {applicants.length === 0 ? (
          <div className="p-16 bg-[#111111] border border-[#2A2A2A] rounded-2xl text-center">
            <div className="w-20 h-20 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-[#666666]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              No Applicants Yet
            </h3>
            <p className="text-[#AAAAAA]">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bulk Actions */}
            {pendingApplicants.length > 0 && remainingOpenings > 0 && (
              <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedApplicants.length === pendingApplicants.length && pendingApplicants.length > 0}
                    onCheckedChange={toggleAll}
                    className="border-[#2A2A2A]"
                  />
                  <span className="text-[#AAAAAA] text-sm">
                    {selectedApplicants.length > 0 
                      ? `${selectedApplicants.length} selected` 
                      : "Select all pending applicants"}
                  </span>
                </div>
                <span className="text-[#666666] text-sm">
                  {remainingOpenings} {remainingOpenings === 1 ? "position" : "positions"} remaining
                </span>
              </div>
            )}

            {/* Applicants List */}
            {applicants.map((application: any) => (
              <Link key={application.id} href={`/jobs/${jobId}/applications/${application.id}`}>
                <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl hover:border-[#7EE8A2] transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    {application.status === "PENDING" && remainingOpenings > 0 && (
                      <div onClick={(e) => e.preventDefault()}>
                        <Checkbox
                          checked={selectedApplicants.includes(application.id)}
                          onCheckedChange={() => toggleApplicant(application.id)}
                          className="mt-1 border-[#2A2A2A]"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-[20px] font-bold text-[#F0F0F0] mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                            {application.user.username}
                          </h3>
                          <div className="flex flex-col gap-1 text-sm text-[#AAAAAA]">
                            <span>{application.user.email}</span>
                            {application.user.phone && <span>{application.user.phone}</span>}
                          </div>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-[#666666]">
                        <span>Applied {format(new Date(application.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                        <span className="text-[#7EE8A2]">Click to view profile →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
