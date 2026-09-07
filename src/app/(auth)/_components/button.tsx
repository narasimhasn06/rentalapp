"use client";

// PROMOTE: src/components/ui -- spec/foundations.md A2 "Buttons" (Primary
// variant, full width, inline spinner on a network call rather than a
// full-page block). Local to L-01 only, see text-field.tsx for why.

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base = "h-10 w-full rounded-sm text-body font-semibold transition disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : "border border-primary bg-surface text-primary hover:bg-primary-soft";

  return (
    <button className={`${base} ${styles} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? "…" : children}
    </button>
  );
}
