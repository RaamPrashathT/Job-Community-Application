"use client";

import Link from "next/link";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/discover" className="flex items-center">
            <h1 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
              NIGHT<span className="text-[#7EE8A2]">SHIFT</span>
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/discover"
              className="text-sm text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-[#AAAAAA] hover:text-[#F0F0F0] transition-colors"
            >
              Dashboard
            </Link>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-9 w-9 border border-[#2A2A2A] hover:border-[#7EE8A2] transition-colors cursor-pointer">
                      <AvatarFallback className="bg-[#1C1C1C] text-[#7EE8A2] text-sm font-semibold">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#111111] border-[#2A2A2A] text-[#F0F0F0]"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-[#666666]">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                  <DropdownMenuItem
                    onClick={() => router.push("/profiles")}
                    className="cursor-pointer focus:bg-[#1C1C1C] focus:text-[#F0F0F0]"
                  >
                    My Profiles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/organization")}
                    className="cursor-pointer focus:bg-[#1C1C1C] focus:text-[#F0F0F0]"
                  >
                    My Organization
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/organization/settings")}
                    className="cursor-pointer focus:bg-[#1C1C1C] focus:text-[#F0F0F0]"
                  >
                    Organization Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/organizations/new")}
                    className="cursor-pointer focus:bg-[#1C1C1C] focus:text-[#F0F0F0]"
                  >
                    Create Organization
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/organizations")}
                      className="cursor-pointer focus:bg-[#1C1C1C] focus:text-[#F0F0F0]"
                    >
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer focus:bg-[#1C1C1C] focus:text-[#F0F0F0]"
                  >
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    className="cursor-pointer text-[#F97C7C] focus:bg-[#2E1010] focus:text-[#F97C7C]"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
