import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const profiles = await prisma.professionalProfile.findMany({
      where: { userId: session.userId },
      include: {
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Get profiles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
