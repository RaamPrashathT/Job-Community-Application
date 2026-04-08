"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-widest text-[#AAAAAA]">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full h-10 px-4 bg-[#0D0D0D] border rounded-lg text-[#F0F0F0] placeholder:text-[#666666] focus:outline-none focus:border-[#7EE8A2] transition-colors ${
            error ? "border-[#F97C7C]" : "border-[#2A2A2A]"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#F97C7C]">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
