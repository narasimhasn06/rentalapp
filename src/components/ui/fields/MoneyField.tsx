"use client";

import { useId, useState } from "react";

export interface MoneyFieldProps {
  label: string;
  helperText?: string;
  /** Whole rupees — the money field never shows decimals (spec/foundations.md A2). */
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
  validate?: (value: number | undefined) => string | undefined;
  required?: boolean;
  placeholder?: string;
}

/** A2 "Money field": ₹ prefix, digits only, live thousands separators, no decimals. */
export function MoneyField({
  label,
  helperText,
  value,
  onValueChange,
  validate,
  required,
  placeholder,
}: MoneyFieldProps) {
  const id = useId();
  const [error, setError] = useState<string | undefined>();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const text = value !== undefined ? value.toLocaleString("en-IN") : "";

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (error) setError(undefined);
    onValueChange(digits === "" ? undefined : Number(digits));
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
        <span className="text-ink">₹</span>
        <input
          id={id}
          inputMode="numeric"
          value={text}
          placeholder={placeholder}
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
