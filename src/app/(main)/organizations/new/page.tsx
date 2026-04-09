import { getMyOrganization } from "@/features/organizations/actions/get-my-org";
import { OrgRequestForm } from "@/features/organizations/components/OrgRequestForm";
import { redirect } from "next/navigation";

export default async function NewOrganizationPage() {
  const result = await getMyOrganization();

  // If user already has an organization, redirect to dashboard
  if (result.organization) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1
          className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Request New Organization
        </h1>
        <p className="text-[#AAAAAA] mt-2">
          Submit your organization details for admin approval
        </p>
      </div>
      <OrgRequestForm />
    </div>
  );
}
