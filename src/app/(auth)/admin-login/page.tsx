"use client";

import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1
              className="text-[40px] font-extrabold tracking-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              ADMIN <span className="text-[#7EE8A2]">LOGIN</span>
            </h1>
            <p className="text-[#666666] mt-3 text-sm">
              Administrative access only
            </p>
          </div>

          <AdminLoginForm />

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-[#666666] hover:text-[#7EE8A2] transition-colors"
            >
              ← Back to user login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <img
          src="https://res.cloudinary.com/datgb606y/image/upload/q_auto/f_auto/v1775664377/Gemini_Generated_Image_6oc10f6oc10f6oc1_1_os8auv.png"
          alt="Admin"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
