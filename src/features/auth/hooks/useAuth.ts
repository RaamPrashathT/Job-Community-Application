"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  register,
  login,
  verify,
  logout,
  completeOnboarding,
  initiateGoogleOAuth,
  initiateGitHubOAuth,
} from "../actions";

async function fetchCurrentUser() {
  const response = await fetch("/api/auth/me");
  if (!response.ok) return null;
  return response.json();
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRegister() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.success && data.verifyToken) {
        router.push(`/verify?token=${data.verifyToken}&type=email`);
      }
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.success && data.redirectTo) {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.push(data.redirectTo);
      } else if (data.requireVerification && data.verifyToken) {
        router.push(`/verify?token=${data.verifyToken}&type=email`);
      } else if (data.require2fa && data.verifyToken) {
        router.push(`/verify?token=${data.verifyToken}&type=2fa`);
      }
    },
  });
}

export function useVerify() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: verify,
    onSuccess: (data) => {
      if (data.success && data.redirectTo) {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.push(data.redirectTo);
      }
    },
  });
}

export function useOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (data) => {
      if (data.success && data.redirectTo) {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.push(data.redirectTo);
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
    },
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: initiateGoogleOAuth,
    onSuccess: (authUrl) => {
      window.location.href = authUrl;
    },
  });
}

export function useGitHubOAuth() {
  return useMutation({
    mutationFn: initiateGitHubOAuth,
    onSuccess: (authUrl) => {
      window.location.href = authUrl;
    },
  });
}
