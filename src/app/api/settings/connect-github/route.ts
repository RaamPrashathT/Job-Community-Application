import { initiateGitHubOAuth } from "@/features/auth/actions/oauth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = await initiateGitHubOAuth();
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Connect GitHub error:", error);
    return NextResponse.json({ error: "Failed to connect GitHub" }, { status: 500 });
  }
}
