export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function validatePassword(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  let score = 0;
  let label = "Weak";
  let color = "#F97C7C";

  if (passedChecks >= 5) {
    score = 4;
    label = "Strong";
    color = "#7EE8A2";
  } else if (passedChecks >= 4) {
    score = 3;
    label = "Good";
    color = "#79B8F7";
  } else if (passedChecks >= 3) {
    score = 2;
    label = "Fair";
    color = "#F5C842";
  } else if (passedChecks >= 1) {
    score = 1;
    label = "Weak";
    color = "#F97C7C";
  }

  return { score, label, color, checks };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
