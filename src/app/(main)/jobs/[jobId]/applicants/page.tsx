import React from "react";
import { ApplicantsManager } from "@/features/jobs/components/ApplicantsManager";

export default async function JobApplicantsPage({ params }: { readonly params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  return <ApplicantsManager jobId={jobId} />;
}
