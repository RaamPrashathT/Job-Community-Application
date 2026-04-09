import { getMyOrganization } from "@/features/organizations/actions/get-my-org";
import { MyOrganizationView } from "@/features/organizations/components/MyOrganizationView";
import { redirect } from "next/navigation";

export default async function OrganizationSettingsPage() {
  const result = await getMyOrganization();

  if (!result.organization) {
    redirect("/organizations/new");
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Organization Settings
          </h1>
          <p className="text-[#AAAAAA] mt-2">Manage your organization details</p>
        </div>
        <MyOrganizationView organization={result.organization} />
      </div>
    </div>
  );
}
