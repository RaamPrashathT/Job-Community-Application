import { initiateGoogleOAuth } from "@/features/auth/actions/oauth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = await initiateGoogleOAuth();
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Connect Google error:", error);
    return NextResponse.json({ error: "Failed to connect Google" }, { status: 500 });
  }
}
