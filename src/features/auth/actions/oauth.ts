"use server";

import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import { createSession } from "../lib/session";
import { randomUUID } from "node:crypto";

// Google OAuth
export async function initiateGoogleOAuth(): Promise<string> {
  const state = randomUUID();
  await redis.setEx(`oauth_state:${state}`, 600, "google"); // 10 minutes

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
}

interface GoogleProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
}

export async function handleGoogleCallback(code: string, state: string): Promise<{ redirectTo: string }> {
  // Verify state
  const storedProvider = await redis.get(`oauth_state:${state}`);
  if (storedProvider !== "google") {
    throw new Error("Invalid OAuth state");
  }
  await redis.del(`oauth_state:${state}`);

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const tokens: GoogleTokenResponse = await tokenResponse.json();

  // Fetch user profile
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const profile: GoogleProfile = await profileResponse.json();

  // Find or create user
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountID: {
        provider: "google",
        providerAccountID: profile.sub,
      },
    },
    include: { user: true },
  });

  let user;

  if (account) {
    user = account.user;
  } else {
    // Check if user exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      // Link account to existing user
      await prisma.account.create({
        data: {
          provider: "google",
          providerAccountID: profile.sub,
          userId: existingUser.id,
        },
      });
      user = existingUser;
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: profile.email,
          username: profile.name || profile.email.split("@")[0],
          emailVerified: profile.email_verified,
          accounts: {
            create: {
              provider: "google",
              providerAccountID: profile.sub,
            },
          },
        },
      });
    }
  }

  // Update emailVerified if needed
  if (!user.emailVerified && profile.email_verified) {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
  }

  // Create session
  await createSession(user.id, user.onboarded);

  const redirectTo = user.onboarded ? "/discover" : "/onboarding";
  return { redirectTo };
}

// GitHub OAuth
export async function initiateGitHubOAuth(): Promise<string> {
  const state = randomUUID();
  await redis.setEx(`oauth_state:${state}`, 600, "github"); // 10 minutes

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: "http://localhost:3000/auth/github/callback",
    scope: "read:user user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
}

interface GitHubProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export async function handleGitHubCallback(code: string, state: string): Promise<{ redirectTo: string }> {
  // Verify state
  const storedProvider = await redis.get(`oauth_state:${state}`);
  if (storedProvider !== "github") {
    throw new Error("Invalid OAuth state");
  }
  await redis.del(`oauth_state:${state}`);

  // Exchange code for access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    }),
  });

  const tokens: GitHubTokenResponse = await tokenResponse.json();

  // Fetch user profile
  const profileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      Accept: "application/json",
    },
  });

  const profile: GitHubProfile = await profileResponse.json();

  // CRITICAL: Fetch emails separately
  const emailsResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      Accept: "application/json",
    },
  });

  const emails: GitHubEmail[] = await emailsResponse.json();

  // Find primary verified email
  const primaryEmail = emails.find((e) => e.primary && e.verified);
  if (!primaryEmail) {
    throw new Error("No verified primary email found for GitHub account");
  }

  const email = primaryEmail.email;

  // Find or create user
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountID: {
        provider: "github",
        providerAccountID: profile.id.toString(),
      },
    },
    include: { user: true },
  });

  let user;

  if (account) {
    user = account.user;
  } else {
    // Check if user exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Link account to existing user
      await prisma.account.create({
        data: {
          provider: "github",
          providerAccountID: profile.id.toString(),
          userId: existingUser.id,
        },
      });
      user = existingUser;
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          username: profile.name || profile.login,
          emailVerified: true, // GitHub emails are verified
          accounts: {
            create: {
              provider: "github",
              providerAccountID: profile.id.toString(),
            },
          },
        },
      });
    }
  }

  // Update emailVerified if needed
  if (!user.emailVerified) {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
  }

  // Create session
  await createSession(user.id, user.onboarded);

  const redirectTo = user.onboarded ? "/discover" : "/onboarding";
  return { redirectTo };
}
