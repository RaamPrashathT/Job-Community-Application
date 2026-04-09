"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminLogin } from "../actions/admin-login";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginData = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const mutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      if (data.success && data.redirectTo) {
        router.push(data.redirectTo);
      }
    },
  });

  const onSubmit = async (data: AdminLoginData) => {
    await mutation.mutateAsync(data);
  };

  const errorMessage = mutation.isError || mutation.data?.error 
    ? mutation.data?.error || "An error occurred" 
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="p-3 bg-[#2E1010] border border-[#5C1A1A] rounded-lg">
          <p className="text-sm text-[#F97C7C]">{errorMessage}</p>
        </div>
      )}

      <AuthInput
        label="Admin Email"
        type="email"
        placeholder="admin@nightshift.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />

      <AuthButton
        type="submit"
        isLoading={mutation.isPending}
      >
        {mutation.isPending ? "Authenticating..." : "Access Admin Panel"}
      </AuthButton>
    </form>
  );
}
