# Authentication Frontend

Complete authentication UI built with the NightShift design system.

## Pages

All auth pages are in `app/(auth)/`:

- `/login` - Login page with email/password and OAuth
- `/register` - Registration with password strength validation
- `/verify` - OTP verification (email & 2FA)
- `/onboarding` - Complete user profile after verification
- `/discover` - Main app page after successful authentication

## Components

Located in `src/features/auth/components/`:

- `LoginForm` - Login form with inline validation
- `RegisterForm` - Registration with password strength indicator
- `VerifyForm` - 6-digit OTP input
- `OnboardingForm` - Profile completion form
- `AuthButton` - Styled button (primary, ghost, subtle variants)
- `AuthInput` - Styled input with label and error handling
- `PasswordStrengthIndicator` - Real-time password strength feedback

## Hooks

Located in `src/features/auth/hooks/`:

- `useCurrentUser()` - Get current authenticated user
- `useRegister()` - Register mutation
- `useLogin()` - Login mutation
- `useVerify()` - OTP verification mutation
- `useOnboarding()` - Complete onboarding mutation
- `useLogout()` - Logout mutation
- `useGoogleOAuth()` - Initiate Google OAuth
- `useGitHubOAuth()` - Initiate GitHub OAuth

## Design System

### Colors
- Base: `#050505`
- Page: `#0A0A0A`
- Card: `#111111`
- Raised: `#1C1C1C`
- Border: `#2A2A2A`
- Primary Text: `#F0F0F0`
- Secondary Text: `#AAAAAA`
- Muted Text: `#666666`
- Accent: `#7EE8A2`

### Typography
- Headings: Syne (800/700/500)
- Body: DM Sans (300/400/500/600/700)

### Components
- Border radius: 8px (inputs/buttons), 12px (cards)
- Input height: 40px
- Button height: 48px

## Usage Example

```tsx
"use client";

import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
      <LoginForm />
    </div>
  );
}
```

## Features

- Inline email validation
- Real-time password strength indicator
- 6-digit OTP input with auto-focus
- OAuth integration (Google & GitHub)
- Loading states on all actions
- Error handling with styled error messages
- Automatic redirects based on user state
- Session management with React Query
