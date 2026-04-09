"use client";

import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ApplyJobModal } from "./ApplyJobModal";
import { MapPin, Calendar, Building2, Briefcase, CheckCircle2, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  requiredSkills: string[];
  createdAt: Date;
  matchScore: number;
  matchingSkills: string[];
  totalRequiredSkills: number;
  hasApplied: boolean;
  organization: {
    id: string;
    name: string;
    location: string;
  };
}

async function fetchJobs({ pageParam, search }: { pageParam?: string; search: string }) {
  const params = new URLSearchParams();
  if (pageParam) params.append("cursor", pageParam);
  if (search) params.append("search", search);
  params.append("limit", "10");

  const response = await fetch(`/api/jobs?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch jobs");
  return response.json();
}

export function JobFeed() {
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string; company: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["jobs", debouncedSearch],
    queryFn: ({ pageParam }) => fetchJobs({ pageParam, search: debouncedSearch }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allJobs = data?.pages.flatMap((page) => page.jobs) || [];

  const getJobTypeBadge = (type: string) => {
    const colors = {
      Remote: "bg-[#0D2E1A] text-[#7EE8A2] border-[#1A5C30]",
      "On-site": "bg-[#2E1A0D] text-[#E8A27E] border-[#5C3A1A]",
      Hybrid: "bg-[#1A1A2E] text-[#7E9FE8] border-[#2A3A5C]",
    };
    return colors[type as keyof typeof colors] || "bg-[#1C1C1C] text-[#AAAAAA] border-[#2A2A2A]";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#7EE8A2] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <Input
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
        </div>
      </div>

      {allJobs.length === 0 ? (
        <div className="p-12 bg-[#111111] border border-[#2A2A2A] rounded-xl text-center">
          <Briefcase className="h-16 w-16 text-[#666666] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F0F0F0] mb-2">
            {debouncedSearch ? "No Jobs Found" : "No Jobs Available"}
          </h3>
          <p className="text-[#666666]">
            {debouncedSearch ? "Try adjusting your search" : "Check back later for new opportunities"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allJobs.map((job: Job) => (
            <div
              key={job.id}
              className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl hover:border-[#7EE8A2] transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                      {job.title}
                    </h3>
                    {job.hasApplied && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-xs">
                        <CheckCircle2 className="h-3 w-3" />
                        Applied
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[#7EE8A2] text-sm mb-3">
                    <Building2 className="h-4 w-4" />
                    {job.organization.name}
                  </div>
                </div>
                <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getJobTypeBadge(job.type)}`}>
                  {job.type}
                </span>
              </div>

              <p className="text-[#AAAAAA] leading-relaxed mb-4">{job.description}</p>

              {/* Required Skills */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-widest text-[#666666] mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => {
                    const isMatching = job.matchingSkills.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`px-2 py-1 border rounded-full text-xs ${
                          isMatching
                            ? "bg-[#0D2E1A] text-[#7EE8A2] border-[#1A5C30]"
                            : "bg-[#1C1C1C] text-[#666666] border-[#2A2A2A]"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                <div className="flex items-center gap-6 text-xs text-[#666666]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                {!job.hasApplied && (
                  <Button
                    onClick={() => setSelectedJob({ id: job.id, title: job.title, company: job.organization.name })}
                    className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Intersection Observer Target */}
          <div ref={observerTarget} className="py-4">
            {isFetchingNextPage && (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-4 border-[#7EE8A2] border-t-transparent rounded-full" />
              </div>
            )}
            {!hasNextPage && allJobs.length > 0 && (
              <p className="text-center text-[#666666] text-sm">No more jobs to load</p>
            )}
          </div>
        </div>
      )}

      {selectedJob && (
        <ApplyJobModal
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}
