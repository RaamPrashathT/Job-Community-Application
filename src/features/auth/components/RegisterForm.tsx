"use client";

import { useState } from "react";
import { useRegister, useGoogleOAuth, useGitHubOAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/validation";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import Link from "next/link";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const registerMutation = useRegister();
  const googleOAuth = useGoogleOAuth();
  const githubOAuth = useGitHubOAuth();

  const passwordStrength = validatePassword(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password is too weak";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    registerMutation.mutate({ email, password });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <header className="space-y-2">
        <h1 className="text-[32px] font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          NIGHT<span className="text-[#7EE8A2]">SHIFT</span>
        </h1>
        <p className="text-sm text-[#AAAAAA]" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Join the foundry. Build your career.
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
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          {password && <PasswordStrengthIndicator strength={passwordStrength} />}
        </div>

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        {(registerMutation.isError || registerMutation.data?.error) && (
          <div className="p-3 bg-[#2E1010] border border-[#5C2020] rounded-lg">
            <p className="text-sm text-[#F97C7C]">
              {registerMutation.data?.error || "Registration failed. Please try again."}
            </p>
          </div>
        )}

        <AuthButton type="submit" variant="primary" isLoading={registerMutation.isPending} className="w-full">
          Create Account
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
        Already have an account?{" "}
        <Link href="/login" className="text-[#7EE8A2] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
