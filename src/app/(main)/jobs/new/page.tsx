import { getMyOrganization } from "@/features/organizations/actions/get-my-org";
import { CreateJobForm } from "@/features/dashboard/components/CreateJobForm";
import { redirect } from "next/navigation";

export default async function NewJobPage() {
  const result = await getMyOrganization();

  if (!result.organization) {
    redirect("/dashboard");
  }

  if (result.organization.status !== "ACTIVE") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Post New Job
          </h1>
          <p className="text-[#AAAAAA] mt-2">Create a job posting for {result.organization.name}</p>
        </div>
        <CreateJobForm />
      </div>
    </div>
  );
}
