# Authentication System

A secure, stateful authentication module built with Next.js Server Actions, PostgreSQL (Prisma), Redis, and Resend.

## Features

- Credential-based registration and login
- Email verification with OTP
- Two-factor authentication (2FA)
- OAuth integration (Google & GitHub)
- Session management with Redis
- Secure HTTP-only cookies
- Onboarding flow

## Directory Structure

```
auth/
├── actions/
│   ├── register.ts       # User registration
│   ├── login.ts          # User login
│   ├── verify.ts         # Email/2FA verification
│   ├── oauth.ts          # OAuth flows (Google & GitHub)
│   ├── onboarding.ts     # Complete user onboarding
│   ├── logout.ts         # Session destruction
│   └── index.ts          # Exports
├── lib/
│   ├── session.ts        # Redis session management
│   ├── otp.ts            # OTP generation & verification
│   ├── email.ts          # Email sending via Resend
│   ├── getCurrentUser.ts # Get current authenticated user
│   └── index.ts          # Exports
```

## Usage

### Registration

```typescript
import { register } from "@/features/auth/actions";

const result = await register({
  email: "user@example.com",
  password: "securepassword123"
});

// Returns: { success: true, verifyToken: "uuid", message: "..." }
```

### Email Verification

```typescript
import { verify } from "@/features/auth/actions";

const result = await verify({
  verifyToken: "uuid-from-registration",
  otp: "123456"
});

// Returns: { success: true, redirectTo: "/onboarding" or "/dashboard" }
```

### Login

```typescript
import { login } from "@/features/auth/actions";

const result = await login({
  email: "user@example.com",
  password: "securepassword123"
});

// Possible responses:
// - { success: true, redirectTo: "/dashboard" }
// - { requireVerification: true, verifyToken: "uuid" }
// - { require2fa: true, verifyToken: "uuid" }
```

### OAuth

```typescript
import { initiateGoogleOAuth, handleGoogleCallback } from "@/features/auth/actions";

// Initiate OAuth flow
const authUrl = await initiateGoogleOAuth();
// Redirect user to authUrl

// Handle callback
const result = await handleGoogleCallback(code, state);
// Returns: { redirectTo: "/onboarding" or "/dashboard" }
```

### Onboarding

```typescript
import { completeOnboarding } from "@/features/auth/actions";

const result = await completeOnboarding({
  name: "John Doe",
  phone: "+1234567890",
  enable2FA: true
});

// Returns: { success: true, redirectTo: "/dashboard" }
```

### Get Current User

```typescript
import { getCurrentUser } from "@/features/auth/lib";

const user = await getCurrentUser();
// Returns user object or null
```

### Logout

```typescript
import { logout } from "@/features/auth/actions";

await logout();
// Destroys session and redirects to "/"
```

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- OTPs hashed before storage
- HTTP-only, secure cookies
- Session data stored in Redis with 24h TTL
- OAuth state validation
- Email verification required
- Optional 2FA support

## Environment Variables

```env
DATABASE_URL="postgresql://..."
REDIS_URL="redis://localhost:6379"
RESEND_API_KEY="re_..."

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

## Database Schema

The system uses three Prisma models:

- `User`: Core user data
- `Account`: Authentication providers (credentials, google, github)
- `VerificationToken`: OTP tokens for email verification, 2FA, password reset

## Session Management

Sessions are stored in Redis with the following structure:

```
Key: session:{sessionId}
Value: { userId: string, onboarded: boolean }
TTL: 86400 seconds (24 hours)
```

## OTP Flow

1. Generate 6-digit OTP
2. Hash OTP with bcrypt
3. Store hash in database with UUID token
4. Send plain OTP to user's email
5. User submits token + OTP
6. Verify OTP against hash
7. Delete token from database
