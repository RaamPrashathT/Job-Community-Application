"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useVerify } from "../hooks/useAuth";
import { AuthButton } from "./AuthButton";

interface VerifyFormProps {
  verifyToken: string;
  type: "email" | "2fa";
}

export function VerifyForm({ verifyToken, type }: VerifyFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyMutation = useVerify();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      return;
    }

    verifyMutation.mutate({ verifyToken, otp: otpString });
  };

  const title = type === "email" ? "Verify Your Email" : "Two-Factor Authentication";
  const description = type === "email" 
    ? "We've sent a 6-digit code to your email. Enter it below to verify your account."
    : "Enter the 6-digit code sent to your email to complete authentication.";

  return (
    <div className="w-full max-w-md space-y-8">
      <header className="space-y-2">
        <h1 className="text-[32px] font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          NIGHT<span className="text-[#7EE8A2]">SHIFT</span>
        </h1>
        <h2 className="text-[22px] font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
          {title}
        </h2>
        <p className="text-sm text-[#AAAAAA]" style={{ fontFamily: "DM Sans, sans-serif" }}>
          {description}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg text-[#F0F0F0] focus:outline-none focus:border-[#7EE8A2] transition-colors"
            />
          ))}
        </div>

        {(verifyMutation.isError || verifyMutation.data?.error) && (
          <div className="p-3 bg-[#2E1010] border border-[#5C2020] rounded-lg">
            <p className="text-sm text-[#F97C7C]">
              {verifyMutation.data?.error || "Verification failed. Please try again."}
            </p>
          </div>
        )}

        <AuthButton
          type="submit"
          variant="primary"
          isLoading={verifyMutation.isPending}
          className="w-full"
          disabled={otp.join("").length !== 6}
        >
          Verify Code
        </AuthButton>

        <p className="text-center text-xs text-[#666666]">
          Didn't receive the code?{" "}
          <button type="button" className="text-[#7EE8A2] font-semibold hover:underline">
            Resend
          </button>
        </p>
      </form>
    </div>
  );
}
