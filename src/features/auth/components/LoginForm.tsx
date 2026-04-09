"use client";

import { useState } from "react";
import { useLogin, useGoogleOAuth, useGitHubOAuth } from "../hooks/useAuth";
import { validateEmail } from "../utils/validation";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const loginMutation = useLogin();
  const googleOAuth = useGoogleOAuth();
  const githubOAuth = useGitHubOAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <header className="space-y-2">
        <h1 className="text-[32px] font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          NIGHT<span className="text-[#7EE8A2]">SHIFT</span>
        </h1>
        <p className="text-sm text-[#AAAAAA]" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Your next role is one login away.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="dev@obsidian.foundry"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-medium uppercase tracking-widest text-[#AAAAAA]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs uppercase tracking-widest text-[#7EE8A2] hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full h-10 px-4 bg-[#0D0D0D] border rounded-lg text-[#F0F0F0] placeholder:text-[#666666] focus:outline-none focus:border-[#7EE8A2] transition-colors ${
              errors.password ? "border-[#F97C7C]" : "border-[#2A2A2A]"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-[#F97C7C] mt-2">{errors.password}</p>
          )}
        </div>

        {(loginMutation.isError || loginMutation.data?.error) && (
          <div className="p-3 bg-[#2E1010] border border-[#5C2020] rounded-lg">
            <p className="text-sm text-[#F97C7C]">
              {loginMutation.data?.error || "Login failed. Please try again."}
            </p>
          </div>
        )}

        <AuthButton type="submit" variant="primary" isLoading={loginMutation.isPending} className="w-full">
          Sign In
        </AuthButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2A2A2A]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-[#0A0A0A] text-xs uppercase tracking-widest text-[#666666]">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AuthButton
          variant="subtle"
          onClick={() => googleOAuth.mutate()}
          isLoading={googleOAuth.isPending}
          type="button"
        >
          Google
        </AuthButton>
        <AuthButton
          variant="subtle"
          onClick={() => githubOAuth.mutate()}
          isLoading={githubOAuth.isPending}
          type="button"
        >
          GitHub
        </AuthButton>
      </div>

      <p className="text-center text-xs text-[#666666]">
        New to the foundry?{" "}
        <Link href="/register" className="text-[#7EE8A2] font-semibold hover:underline">
          Request access
        </Link>
      </p>

      <div className="pt-4 border-t border-[#2A2A2A]">
        <p className="text-center text-xs text-[#666666]">
          Administrative access?{" "}
          <Link href="/admin-login" className="text-[#7EE8A2] font-semibold hover:underline">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
