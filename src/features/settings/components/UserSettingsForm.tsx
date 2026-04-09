"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Shield, Link as LinkIcon, Check } from "lucide-react";

const settingsSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type SettingsData = z.infer<typeof settingsSchema>;

interface UserSettingsFormProps {
  user: {
    id: string;
    username: string;
    email: string;
    phone: string | null;
    TFAEnabled: boolean;
  };
}

async function updateSettings(data: SettingsData) {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update settings");
  return response.json();
}

async function toggle2FA() {
  const response = await fetch("/api/settings/2fa", {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to toggle 2FA");
  return response.json();
}

async function fetchConnections() {
  const response = await fetch("/api/settings/connections");
  if (!response.ok) throw new Error("Failed to fetch connections");
  return response.json();
}

async function connectOAuth(provider: string) {
  const response = await fetch(`/api/settings/connect-${provider}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error(`Failed to connect ${provider}`);
  const data = await response.json();
  return data.url;
}

export function UserSettingsForm({ user }: Readonly<UserSettingsFormProps>) {
  const router = useRouter();
  const [twoFAEnabled, setTwoFAEnabled] = useState(user.TFAEnabled);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      phone: user.phone || "",
    },
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnections,
  });

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("Settings updated successfully");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });

  const toggle2FAMutation = useMutation({
    mutationFn: toggle2FA,
    onSuccess: (data) => {
      setTwoFAEnabled(data.enabled);
      toast.success(data.enabled ? "2FA enabled" : "2FA disabled");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to toggle 2FA");
    },
  });

  const connectMutation = useMutation({
    mutationFn: connectOAuth,
    onSuccess: (url) => {
      globalThis.location.href = url;
    },
    onError: () => {
      toast.error("Failed to connect account");
    },
  });

  const onSubmit = async (data: SettingsData) => {
    await updateMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-[#7EE8A2]" />
          <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
            Profile Information
          </h3>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Username</Label>
          <Input
            {...register("username")}
            className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
          {errors.username && <p className="text-xs text-[#F97C7C] mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Email</Label>
          <Input
            {...register("email")}
            type="email"
            className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
          {errors.email && <p className="text-xs text-[#F97C7C] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label className="text-xs uppercase tracking-widest text-[#AAAAAA]">Phone (Optional)</Label>
          <Input
            {...register("phone")}
            type="tel"
            placeholder="+1234567890"
            className="mt-2 bg-[#0D0D0D] border-[#2A2A2A] text-[#F0F0F0]"
          />
        </div>

        <Button
          type="submit"
          disabled={!isDirty || updateMutation.isPending}
          className="w-full bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891] disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      {/* Security Settings */}
      <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-[#7EE8A2]" />
          <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
            Security
          </h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg">
          <div>
            <p className="font-medium text-[#F0F0F0]">Two-Factor Authentication</p>
            <p className="text-sm text-[#666666] mt-1">
              {twoFAEnabled ? "2FA is enabled for your account" : "Add an extra layer of security"}
            </p>
          </div>
          <Button
            onClick={() => toggle2FAMutation.mutate()}
            disabled={toggle2FAMutation.isPending}
            className={twoFAEnabled ? "bg-[#2E0D0D] text-[#F97C7C] border border-[#5C1A1A] hover:bg-[#5C1A1A]" : "bg-[#0D2E1A] text-[#7EE8A2] border border-[#1A5C30] hover:bg-[#1A5C30]"}
          >
            {twoFAEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <LinkIcon className="h-5 w-5 text-[#7EE8A2]" />
          <h3 className="text-[20px] font-bold text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
            Connected Accounts
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#F0F0F0]">Google</p>
                <p className="text-sm text-[#666666]">
                  {connections?.google ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            {connections?.google ? (
              <div className="flex items-center gap-2 text-[#7EE8A2]">
                <Check className="h-4 w-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <Button
                onClick={() => connectMutation.mutate("google")}
                disabled={connectMutation.isPending}
                className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]"
              >
                Connect
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#24292e] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#F0F0F0]">GitHub</p>
                <p className="text-sm text-[#666666]">
                  {connections?.github ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            {connections?.github ? (
              <div className="flex items-center gap-2 text-[#7EE8A2]">
                <Check className="h-4 w-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <Button
                onClick={() => connectMutation.mutate("github")}
                disabled={connectMutation.isPending}
                className="bg-[#1C1C1C] border border-[#2A2A2A] text-[#CCCCCC] hover:bg-[#252525]"
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
