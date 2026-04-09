import { use } from "react";
import { ProfileForm } from "@/features/profiles/components/ProfileForm";

export default function CreateProfilePage({ searchParams }: Readonly<{ searchParams: Promise<{ name?: string }> }>) {
  const params = use(searchParams);
  const defaultName = params.name;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]" style={{ fontFamily: "Syne, sans-serif" }}>
          Create Profile
        </h1>
        <p className="text-[#AAAAAA] mt-2">Build a targeted professional persona</p>
      </div>
      <ProfileForm defaultName={defaultName} />
    </div>
  );
}
