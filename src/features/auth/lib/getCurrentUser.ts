import { prisma } from "@/lib/prisma";
import { getSession } from "./session";

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      username: true,
      phone: true,
      role: true,
      emailVerified: true,
      TFAEnabled: true,
      onboarded: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
