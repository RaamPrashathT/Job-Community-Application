import { use } from "react";
import { OrganizationDetail } from "@/features/community/components/OrganizationDetail";
import { getOrganizationDetail } from "@/features/community/actions/get-organization-detail";
import { redirect } from "next/navigation";

export default function OrganizationDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = use(params);
  
  return <OrganizationDetail organizationId={id} />;
}
