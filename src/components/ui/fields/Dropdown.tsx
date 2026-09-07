"use client";

import { useId, useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  helperText?: string;
  /** Shown as a disabled first option — never a valid choice (spec/foundations.md A2). */
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  validate?: (value: string) => string | undefined;
  required?: boolean;
}

/** A2 "Dropdown": native select, always with a non-selectable placeholder. */
export function Dropdown({
  label,
  helperText,
  placeholder,
  options,
  value,
  onValueChange,
  validate,
  required,
}: DropdownProps) {
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
      <select
        id={id}
        value={value}
        onChange={(e) => {
          if (error) setError(undefined);
          onValueChange(e.target.value);
        }}
        onBlur={() => setError(validate?.(value))}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-invalid={Boolean(error)}
        className={`h-10 rounded-sm border bg-surface px-3 text-ink outline-none focus:border-primary ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
