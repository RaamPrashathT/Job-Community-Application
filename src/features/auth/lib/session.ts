import { cookies } from "next/headers";
import redis from "@/lib/redis";
import { randomUUID } from "node:crypto";

export interface SessionData {
  userId: string;
  onboarded: boolean;
}

const SESSION_COOKIE_NAME = "sessionId";
const SESSION_TTL = 86400; // 24 hours

export async function createSession(userId: string, onboarded: boolean): Promise<string> {
  const sessionId = randomUUID();
  const sessionData: SessionData = { userId, onboarded };

  await redis.setEx(`session:${sessionId}`, SESSION_TTL, JSON.stringify(sessionData));

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });

  return sessionId;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) return null;

  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) return null;

  return JSON.parse(sessionData) as SessionData;
}

export async function updateSession(updates: Partial<SessionData>): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) throw new Error("No active session");

  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) throw new Error("Session not found");

  const currentData = JSON.parse(sessionData) as SessionData;
  const updatedData = { ...currentData, ...updates };

  await redis.setEx(`session:${sessionId}`, SESSION_TTL, JSON.stringify(updatedData));
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await redis.del(`session:${sessionId}`);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
