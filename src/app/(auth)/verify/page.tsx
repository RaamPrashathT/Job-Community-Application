"use client";

import { useSearchParams } from "next/navigation";
import { VerifyForm } from "@/features/auth/components/VerifyForm";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type") as "email" | "2fa";

  if (!token || !type) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#F0F0F0] mb-2">Invalid Verification Link</h1>
          <p className="text-[#AAAAAA]">Please check your email for the correct verification link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
      <VerifyForm verifyToken={token} type={type} />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#7EE8A2]">Loading...</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
