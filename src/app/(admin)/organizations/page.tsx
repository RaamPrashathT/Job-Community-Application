import { getPendingOrganizations } from "@/features/organizations/actions/get-pending-orgs";
import { PendingOrgsTable } from "@/features/organizations/components/PendingOrgsTable";
import { redirect } from "next/navigation";

export default async function AdminOrganizationsPage() {
  const result = await getPendingOrganizations();

  if (!result.success) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Pending Organizations
          </h1>
          <p className="text-[#AAAAAA] mt-2">
            Review and approve organization requests
          </p>
        </div>
        <PendingOrgsTable organizations={result.organizations} />
      </div>
    </div>
  );
}
