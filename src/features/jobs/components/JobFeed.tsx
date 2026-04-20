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
      <div className="mb-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3ECF8E] to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B8B8B] z-10" />
          <Input
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative pl-12 bg-[#0B0C10] border-[#2E2E2E] text-white focus-visible:border-[#3ECF8E] focus-visible:ring-1 focus-visible:ring-[#3ECF8E]/50 transition-all rounded-xl h-14 shadow-lg text-lg"
          />
        </div>
      </div>

      {allJobs.length === 0 ? (
        <div className="p-16 bg-[#111111] border border-[#1F1F1F] rounded-xl text-center shadow-2xl">
          <Briefcase className="h-20 w-20 text-[#2E2E2E] mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            {debouncedSearch ? "No matching roles found" : "No roles available"}
          </h3>
          <p className="text-[#8B8B8B] text-lg">
            {debouncedSearch ? "Try adjusting your search criteria" : "Check back later for new opportunities"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allJobs.map((job: Job) => (
            <div
              key={job.id}
              className="p-8 bg-[#111111] border border-[#1F1F1F] rounded-xl hover:border-[#3ECF8E] hover:bg-[#151515] hover:shadow-[0_0_20px_rgba(62,207,142,0.15)] transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[24px] font-bold text-white group-hover:text-[#3ECF8E] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {job.title}
                    </h3>
                    {job.hasApplied && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/20 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Applied
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[#8B8B8B] font-medium text-sm mb-4">
                    <Building2 className="h-4 w-4" />
                    {job.organization.name}
                  </div>
                </div>
                <span className={`px-4 py-1.5 border rounded-full text-xs font-bold ${getJobTypeBadge(job.type)}`}>
                  {job.type}
                </span>
              </div>

              <p className="text-[#AAAAAA] leading-relaxed mb-4">{job.description}</p>

              {/* Required Skills */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-[#555] font-bold mb-3">Required Stack</p>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => {
                    const isMatching = job.matchingSkills.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`px-3 py-1.5 border rounded opacity-90 text-xs font-mono tracking-tight ${
                          isMatching
                            ? "bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/30"
                            : "bg-[#1C1C1C] text-[#8B8B8B] border-[#2E2E2E]"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#1F1F1F]">
                <div className="flex items-center gap-6 text-sm text-[#555]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4" />
                    Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                {!job.hasApplied && (
                  <Button
                    onClick={() => setSelectedJob({ id: job.id, title: job.title, company: job.organization.name })}
                    className="bg-[#3ECF8E] border border-[#3ECF8E] text-black hover:bg-[#24B47E] hover:border-[#24B47E] hover:shadow-[0_0_15px_rgba(62,207,142,0.4)] transition-all font-bold px-6"
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
