"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Building2, MapPin, Star, Briefcase, TrendingUp } from "lucide-react";
import Link from "next/link";

async function searchOrganizations(query: string) {
  const params = new URLSearchParams();
  if (query) params.append("search", query);
  
  const response = await fetch(`/api/community/organizations?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch organizations");
  return response.json();
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["community-organizations", debouncedSearch],
    queryFn: () => searchOrganizations(debouncedSearch),
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <div className="border-b border-[#2A2A2A] bg-[#050505]">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <h1
            className="text-[40px] font-extrabold tracking-tight text-[#F0F0F0] mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Explore Companies
          </h1>
          <p className="text-[#AAAAAA] text-lg mb-8">
            Discover organizations, read reviews, and find your next opportunity
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]" />
            <Input
              placeholder="Search by company name, location, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-[#111111] border-[#2A2A2A] text-[#F0F0F0] text-base focus:border-[#7EE8A2]"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-[#7EE8A2] border-t-transparent rounded-full" />
          </div>
        ) : organizations && organizations.length > 0 ? (
          <div className="space-y-5">
            {organizations.map((org: any) => (
              <Link key={org.id} href={`/community/${org.id}`}>
                <div className="group p-6 bg-[#111111] border border-[#2A2A2A] rounded-2xl hover:border-[#7EE8A2] hover:bg-[#151515] transition-all cursor-pointer">
                  <div className="flex gap-6">
                    {/* Logo */}
                    {org.logoUrl ? (
                      <img
                        src={org.logoUrl}
                        alt={org.name}
                        className="w-20 h-20 rounded-xl object-cover border border-[#2A2A2A] shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                        <Building2 className="h-10 w-10 text-[#666666]" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="text-[22px] font-bold text-[#F0F0F0] mb-1 group-hover:text-[#7EE8A2] transition-colors" 
                            style={{ fontFamily: "Syne, sans-serif" }}
                          >
                            {org.name}
                          </h3>
                          <div className="flex items-center gap-2 text-[#666666] text-sm">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{org.location}</span>
                          </div>
                        </div>
                        
                        {/* Rating Badge */}
                        <div className="flex flex-col items-end shrink-0">
                          {org.rating > 0 ? (
                            <>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg">
                                <Star className="h-4 w-4 fill-[#E8D87E] text-[#E8D87E]" />
                                <span className="text-[#F0F0F0] font-bold text-lg">
                                  {org.rating.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-[#666666] text-xs mt-1">
                                {org._count?.reviews} {org._count?.reviews === 1 ? "review" : "reviews"}
                              </span>
                            </>
                          ) : (
                            <div className="px-3 py-1.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg">
                              <span className="text-[#666666] text-sm">No ratings yet</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[#AAAAAA] text-[15px] leading-relaxed line-clamp-2 mb-4">
                        {org.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1.5 bg-[#0D2E1A] border border-[#1A5C30] rounded">
                            <Briefcase className="h-3.5 w-3.5 text-[#7EE8A2]" />
                          </div>
                          <span className="text-[#AAAAAA]">
                            <span className="text-[#F0F0F0] font-semibold">{org._count?.jobs || 0}</span> open {org._count?.jobs === 1 ? "position" : "positions"}
                          </span>
                        </div>
                        
                        {org.rating > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 bg-[#2E1A0D] border border-[#5C3A1A] rounded">
                              <TrendingUp className="h-3.5 w-3.5 text-[#E8A27E]" />
                            </div>
                            <span className="text-[#AAAAAA]">
                              Rated by <span className="text-[#F0F0F0] font-semibold">{org._count?.reviews}</span> {org._count?.reviews === 1 ? "employee" : "employees"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 bg-[#111111] border border-[#2A2A2A] rounded-2xl text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-[#666666]" />
              </div>
              <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                {debouncedSearch ? "No Companies Found" : "No Companies Yet"}
              </h3>
              <p className="text-[#AAAAAA] text-base">
                {debouncedSearch 
                  ? "Try adjusting your search terms or filters" 
                  : "Companies will appear here once they're approved"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
