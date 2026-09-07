"use client";

import { useId, useState } from "react";

export interface PhoneFieldProps {
  label: string;
  helperText?: string;
  /** Bare 10 digits — spaces/dashes are stripped as the user types, so the stored value is always clean (spec/foundations.md A2). */
  value: string;
  onValueChange: (value: string) => void;
  validate?: (value: string) => string | undefined;
  required?: boolean;
}

/** A2 "Phone field": +91 prefix, exactly 10 digits, strips spaces and dashes. */
export function PhoneField({
  label,
  helperText,
  value,
  onValueChange,
  validate,
  required,
}: PhoneFieldProps) {
  const id = useId();
  const [error, setError] = useState<string | undefined>();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (error) setError(undefined);
    onValueChange(digits);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label uppercase text-muted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <div
        className={`flex h-10 items-center gap-1 rounded-sm border px-3 focus-within:border-primary ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <span className="text-ink">+91</span>
        <input
          id={id}
          inputMode="numeric"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setError(validate?.(value))}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          aria-invalid={Boolean(error)}
          className="w-full text-ink tabular-nums outline-none"
        />
      </div>
      {error ? (
        <p id={errorId} className="text-small text-danger">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-small text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
