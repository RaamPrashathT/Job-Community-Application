import { getMyOrganization } from "@/features/organizations/actions/get-my-org";
import { MyOrganizationView } from "@/features/organizations/components/MyOrganizationView";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const result = await getMyOrganization();

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            My Organization
          </h1>
          <p className="text-[#AAAAAA] mt-2">Manage your organization details</p>
        </div>

        {result.organization ? (
          <MyOrganizationView organization={result.organization} />
        ) : (
          <div className="text-center py-12 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <h2 className="text-xl font-bold text-[#F0F0F0] mb-2">No Organization Yet</h2>
            <p className="text-[#666666] mb-6">Create your organization to get started</p>
            <Link href="/organizations/new">
              <Button className="bg-[#7EE8A2] text-[#060F0A] hover:bg-[#6DD891]">
                Create Organization
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
