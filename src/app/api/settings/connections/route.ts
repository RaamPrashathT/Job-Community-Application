import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
      where: { userId: session.userId },
      select: { provider: true },
    });

    const connections = {
      google: accounts.some((acc) => acc.provider === "google"),
      github: accounts.some((acc) => acc.provider === "github"),
    };

    return NextResponse.json(connections);
  } catch (error) {
    console.error("Get connections error:", error);
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }
}
