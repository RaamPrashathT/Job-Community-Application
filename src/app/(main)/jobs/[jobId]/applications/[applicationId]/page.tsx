import React from "react";
import { ApplicationDetail } from "@/features/jobs/components/ApplicationDetail";

export default async function ApplicationDetailPage({ 
  params 
}: { 
  readonly params: Promise<{ jobId: string; applicationId: string }> 
}) {
  const { jobId, applicationId } = await params;

  return <ApplicationDetail applicationId={applicationId} jobId={jobId} />;
}
