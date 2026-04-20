"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Building2, MapPin, Star, Briefcase, Calendar, User, Award, Users, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./ReviewForm";
import Link from "next/link";

async function fetchOrganizationDetail(id: string) {
  const response = await fetch(`/api/community/organizations/${id}`);
  if (!response.ok) throw new Error("Failed to fetch organization");
  return response.json();
}

interface OrganizationDetailProps {
  organizationId: string;
}

export function OrganizationDetail({ organizationId }: Readonly<OrganizationDetailProps>) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "reviews">("overview");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["organization-detail", organizationId],
    queryFn: () => fetchOrganizationDetail(organizationId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#7EE8A2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data?.organization) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-10 w-10 text-[#666666]" />
          </div>
          <h2 className="text-2xl font-bold text-[#F0F0F0] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            Company Not Found
          </h2>
          <p className="text-[#AAAAAA] mb-6">This company doesn't exist or has been removed</p>
          <Link href="/community">
            <Button className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]">
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { organization, canReview } = data;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = organization.reviews.filter((r: any) => r.rating === rating).length;
    const percentage = organization.reviews.length > 0 ? (count / organization.reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const getJobTypeBadge = (type: string) => {
    const colors = {
      Remote: "bg-[#0D2E1A] text-[#7EE8A2] border-[#1A5C30]",
      "On-site": "bg-[#2E1A0D] text-[#E8A27E] border-[#5C3A1A]",
      Hybrid: "bg-[#1A1A2E] text-[#7E9FE8] border-[#2A3A5C]",
    };
    return colors[type as keyof typeof colors] || "bg-[#1C1C1C] text-[#AAAAAA] border-[#2A2A2A]";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header Section */}
      <div className="border-b border-[#2A2A2A] bg-[#050505]">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex gap-8">
            {/* Logo */}
            {organization.logoUrl ? (
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="w-28 h-28 rounded-2xl object-cover border border-[#2A2A2A] shrink-0"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                <Building2 className="h-14 w-14 text-[#666666]" />
              </div>
            )}

            {/* Company Info */}
            <div className="flex-1">
              <h1 
                className="text-[36px] font-extrabold text-[#F0F0F0] mb-2" 
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {organization.name}
              </h1>
              <div className="flex items-center gap-2 text-[#AAAAAA] mb-4">
                <MapPin className="h-4 w-4" />
                <span>{organization.location}</span>
              </div>
              <p className="text-[#AAAAAA] text-base leading-relaxed max-w-3xl">
                {organization.description}
              </p>
            </div>

            {/* Rating Card */}
            <div className="shrink-0">
              <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl text-center min-w-[180px]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6 fill-[#E8D87E] text-[#E8D87E]" />
                  <span className="text-[40px] font-extrabold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                    {organization.rating > 0 ? organization.rating.toFixed(1) : "—"}
                  </span>
                </div>
                <p className="text-[#666666] text-sm">
                  {organization._count?.reviews || 0} {organization._count?.reviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0D2E1A] border border-[#1A5C30] rounded-lg">
                  <Briefcase className="h-5 w-5 text-[#7EE8A2]" />
                </div>
                <div>
                  <p className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                    {organization.jobs.length}
                  </p>
                  <p className="text-[#666666] text-sm">Open Positions</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2E1A0D] border border-[#5C3A1A] rounded-lg">
                  <Users className="h-5 w-5 text-[#E8A27E]" />
                </div>
                <div>
                  <p className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                    {organization._count?.reviews || 0}
                  </p>
                  <p className="text-[#666666] text-sm">Employee Reviews</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1A1A2E] border border-[#2A3A5C] rounded-lg">
                  <Award className="h-5 w-5 text-[#7E9FE8]" />
                </div>
                <div>
                  <p className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                    {organization.rating > 0 ? organization.rating.toFixed(1) : "—"}
                  </p>
                  <p className="text-[#666666] text-sm">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2A2A2A] bg-[#050505]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "jobs", label: `Jobs (${organization.jobs.length})` },
              { id: "reviews", label: `Reviews (${organization.reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 transition-colors font-medium ${
                  activeTab === tab.id
                    ? "border-[#7EE8A2] text-[#F0F0F0]"
                    : "border-transparent text-[#666666] hover:text-[#AAAAAA]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - About */}
            <div className="col-span-2 space-y-6">
              <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
                <h2 className="text-[24px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  About {organization.name}
                </h2>
                <p className="text-[#AAAAAA] leading-relaxed">
                  {organization.description}
                </p>
              </div>

              {/* Recent Jobs */}
              {organization.jobs.length > 0 && (
                <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[24px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
                      Recent Openings
                    </h2>
                    <Button
                      onClick={() => setActiveTab("jobs")}
                      className="bg-transparent border border-[#2A2A2A] text-[#AAAAAA] hover:bg-[#1C1C1C] hover:text-[#F0F0F0]"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {organization.jobs.slice(0, 3).map((job: any) => (
                      <div key={job.id} className="p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-[17px] font-semibold text-[#F0F0F0]">{job.title}</h3>
                          <span className={`px-2 py-1 border rounded-full text-xs ${getJobTypeBadge(job.type)}`}>
                            {job.type}
                          </span>
                        </div>
                        <p className="text-[#666666] text-sm">{job.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Rating Breakdown */}
            <div className="space-y-6">
              <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
                <h3 className="text-[20px] font-bold text-[#F0F0F0] mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                  Rating Breakdown
                </h3>
                {organization.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm text-[#AAAAAA]">{rating}</span>
                          <Star className="h-3 w-3 fill-[#E8D87E] text-[#E8D87E]" />
                        </div>
                        <div className="flex-1 h-2 bg-[#1C1C1C] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#7EE8A2] rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#666666] w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#666666] text-sm text-center py-4">No ratings yet</p>
                )}
              </div>

              {canReview && (
                <Button
                  onClick={() => {
                    setActiveTab("reviews");
                    setShowReviewForm(true);
                  }}
                  className="w-full bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891] h-12 text-base font-semibold"
                >
                  Write a Review
                </Button>
              )}
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-4">
            {organization.jobs.length === 0 ? (
              <div className="p-16 bg-[#111111] border border-[#2A2A2A] rounded-2xl text-center">
                <div className="w-20 h-20 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-10 w-10 text-[#666666]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                  No Open Positions
                </h3>
                <p className="text-[#AAAAAA]">Check back later for new opportunities</p>
              </div>
            ) : (
              organization.jobs.map((job: any) => (
                <div key={job.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl hover:border-[#7EE8A2] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-[20px] font-bold text-[#F0F0F0] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#666666]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 border rounded-full text-sm font-medium ${getJobTypeBadge(job.type)}`}>
                      {job.type}
                    </span>
                  </div>
                  <p className="text-[#AAAAAA] leading-relaxed mb-4">{job.description}</p>
                  {job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {canReview && showReviewForm && (
              <ReviewForm
                organizationId={organizationId}
                onSuccess={() => {
                  setShowReviewForm(false);
                  refetch();
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            {organization.reviews.length === 0 ? (
              <div className="p-16 bg-[#111111] border border-[#2A2A2A] rounded-2xl text-center">
                <div className="w-20 h-20 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="h-10 w-10 text-[#666666]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                  No Reviews Yet
                </h3>
                <p className="text-[#AAAAAA] mb-6">Be the first to share your experience</p>
                {canReview && (
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]"
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {organization.reviews.map((review: any) => (
                  <div key={review.id} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-[#7EE8A2]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-[#F0F0F0] text-lg">{review.user.username}</p>
                            <p className="text-sm text-[#666666]">
                              {format(new Date(review.createdAt), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-[#E8D87E] text-[#E8D87E]"
                                    : "text-[#2A2A2A]"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#AAAAAA] leading-relaxed text-[15px] mb-4">{review.comment}</p>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
