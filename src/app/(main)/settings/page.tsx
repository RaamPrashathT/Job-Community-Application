import { getCurrentUser } from "@/features/auth/lib/getCurrentUser";
import { UserSettingsForm } from "@/features/settings/components/UserSettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Account Settings
          </h1>
          <p className="text-[#AAAAAA] mt-2">Manage your account preferences and security</p>
        </div>
        <UserSettingsForm user={user} />
      </div>
    </div>
  );
}
