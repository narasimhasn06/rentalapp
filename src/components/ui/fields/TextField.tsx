"use client";

import { useId, useState, type InputHTMLAttributes } from "react";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onBlur" | "id"> {
  label: string;
  helperText?: string;
  /** Runs on blur, not on keystroke (spec/foundations.md A2 "Text field"). Return an error string, or undefined when valid. */
  validate?: (value: string) => string | undefined;
  required?: boolean;
}

/** A2 "Text field": label above, helper below, error replaces helper on blur. */
export function TextField({
  label,
  helperText,
  validate,
  required,
  className = "",
  onChange,
  ...rest
}: TextFieldProps) {
  const id = useId();
  const [error, setError] = useState<string | undefined>();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label uppercase text-muted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={id}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-invalid={Boolean(error)}
        onChange={(e) => {
          if (error) setError(undefined);
          onChange?.(e);
        }}
        onBlur={(e) => setError(validate?.(e.target.value))}
        className={`h-10 rounded-sm border px-3 text-ink outline-none focus:border-primary ${
          error ? "border-danger" : "border-line"
        } ${className}`}
        {...rest}
      />
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
