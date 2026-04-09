import { JobFeed } from "@/features/jobs/components/JobFeed";

export default function DiscoverPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-[32px] font-extrabold tracking-tight text-[#F0F0F0]"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Discover Jobs
          </h1>
          <p className="text-[#AAAAAA] mt-2">
            Find opportunities that match your skills
          </p>
        </div>
        <JobFeed />
      </div>
    </div>
  );
}
