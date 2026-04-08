import { getCurrentUser } from "@/features/auth/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(null, { status: 401 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
