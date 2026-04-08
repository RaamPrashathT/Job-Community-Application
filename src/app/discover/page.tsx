"use client";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export default function DiscoverPage() {
  return (
    <ProtectedRoute requireOnboarded>
      <div className="min-h-screen bg-[#050505] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
            Discover
          </h1>
          <p className="text-[#AAAAAA] mt-2">Your personalized job feed coming soon...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
