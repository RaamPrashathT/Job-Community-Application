"use client";

import { useCurrentUser } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}

export function ProtectedRoute({ children, requireOnboarded = false }: ProtectedRouteProps) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (requireOnboarded && !user.onboarded) {
        router.push("/onboarding");
      }
    }
  }, [user, isLoading, requireOnboarded, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#7EE8A2] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#AAAAAA]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (requireOnboarded && !user.onboarded)) {
    return null;
  }

  return <>{children}</>;
}
