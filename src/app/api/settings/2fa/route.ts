import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { TFAEnabled: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newStatus = !user.TFAEnabled;

    await prisma.user.update({
      where: { id: session.userId },
      data: { TFAEnabled: newStatus },
    });

    return NextResponse.json({ success: true, enabled: newStatus });
  } catch (error) {
    console.error("Toggle 2FA error:", error);
    return NextResponse.json({ error: "Failed to toggle 2FA" }, { status: 500 });
  }
}
