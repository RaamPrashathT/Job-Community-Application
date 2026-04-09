import { getMyOrganization } from "@/features/organizations/actions/get-my-org";
import { getMyApplications } from "@/features/jobs/actions/get-my-applications";
import { ProviderDashboard } from "@/features/dashboard/components/ProviderDashboard";
import { SeekerDashboard } from "@/features/dashboard/components/SeekerDashboard";

export default async function DashboardPage() {
  const orgResult = await getMyOrganization();

  // If user has an organization, show Provider Dashboard
  if (orgResult.organization) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1
              className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Provider Dashboard
            </h1>
            <p className="text-[#AAAAAA] mt-2">Manage your organization and job postings</p>
          </div>
          <ProviderDashboard organization={orgResult.organization} />
        </div>
      </div>
    );
  }

  // If no organization, show Seeker Dashboard with applications
  const appResult = await getMyApplications();

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <SeekerDashboard applications={appResult.applications} />
      </div>
    </div>
  );
}
