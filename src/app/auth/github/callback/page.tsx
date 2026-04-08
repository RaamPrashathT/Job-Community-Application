"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleGitHubCallback } from "@/features/auth/actions";
import { Suspense } from "react";

function GitHubCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      handleGitHubCallback(code, state)
        .then((result) => {
          router.push(result.redirectTo);
        })
        .catch((error) => {
          console.error("GitHub OAuth error:", error);
          router.push("/login?error=oauth_failed");
        });
    } else {
      router.push("/login?error=invalid_callback");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#7EE8A2] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#AAAAAA]">Completing GitHub sign in...</p>
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#7EE8A2]">Loading...</div>
      </div>
    }>
      <GitHubCallbackContent />
    </Suspense>
  );
}
