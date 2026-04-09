"use client";

import { useState } from "react";
import { useOnboarding } from "../hooks/useAuth";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";

export function OnboardingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const onboardingMutation = useOnboarding();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onboardingMutation.mutate({ name, phone, enable2FA });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <header className="space-y-2">
        <h1 className="text-[32px] font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          NIGHT<span className="text-[#7EE8A2]">SHIFT</span>
        </h1>
        <h2 className="text-[22px] font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
          Complete Your Profile
        </h2>
        <p className="text-sm text-[#AAAAAA]" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Just a few more details to get you started.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="Marcus Chen"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <AuthInput
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg space-y-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="enable2fa"
              checked={enable2FA}
              onChange={(e) => setEnable2FA(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#2A2A2A] bg-[#0D0D0D] text-[#7EE8A2] focus:ring-[#7EE8A2] focus:ring-offset-0"
            />
            <div className="flex-1">
              <label htmlFor="enable2fa" className="text-sm font-medium text-[#F0F0F0] cursor-pointer">
                Enable Two-Factor Authentication
              </label>
              <p className="text-xs text-[#666666] mt-1">
                Add an extra layer of security to your account with email-based 2FA.
              </p>
            </div>
          </div>
        </div>

        {(onboardingMutation.isError || onboardingMutation.data?.error) && (
          <div className="p-3 bg-[#2E1010] border border-[#5C2020] rounded-lg">
            <p className="text-sm text-[#F97C7C]">
              {onboardingMutation.data?.error || "Failed to complete onboarding. Please try again."}
            </p>
          </div>
        )}

        <AuthButton type="submit" variant="primary" isLoading={onboardingMutation.isPending} className="w-full">
          Complete Setup
        </AuthButton>
      </form>
    </div>
  );
}
