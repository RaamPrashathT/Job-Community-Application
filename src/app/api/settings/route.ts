import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/auth/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateSchema.parse(body);

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        username: validated.username,
        email: validated.email,
        phone: validated.phone || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
