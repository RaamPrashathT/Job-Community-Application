"use client";

import { PasswordStrength } from "../utils/validation";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: level <= strength.score ? strength.color : "#2A2A2A",
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>
      <div className="space-y-1 text-xs">
        <div className={strength.checks.length ? "text-[#7EE8A2]" : "text-[#666666]"}>
          ✓ At least 8 characters
        </div>
        <div className={strength.checks.number ? "text-[#7EE8A2]" : "text-[#666666]"}>
          ✓ Contains numbers
        </div>
        <div className={strength.checks.special ? "text-[#7EE8A2]" : "text-[#666666]"}>
          ✓ Contains special characters
        </div>
      </div>
    </div>
  );
}
