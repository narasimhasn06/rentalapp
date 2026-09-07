"use client";

import { useId, useState } from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * The native date input's own picker renders in the browser/OS locale
 * format, which the app can't override — so this formats the selected
 * value as "DD MMM YYYY" (spec/foundations.md A2, CLAUDE.md §5) in a
 * caption under the field, the same way the value would read anywhere
 * else in the product.
 *
 * Integration note: this ad hoc formatter duplicates a formatter that
 * should live next to `formatRupees` in src/lib/format.ts once that
 * file's lane is free to add it — see the PR description.
 */
function formatDisplayDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return "";
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1]} ${year}`;
}

export interface DateFieldProps {
  label: string;
  helperText?: string;
  /** ISO yyyy-mm-dd, the native date input's format. */
  value: string;
  onValueChange: (value: string) => void;
  validate?: (value: string) => string | undefined;
  required?: boolean;
  min?: string;
  max?: string;
}

/** A2 "Date field": native date picker, displayed as DD MMM YYYY. */
export function DateField({
  label,
  helperText,
  value,
  onValueChange,
  validate,
  required,
  min,
  max,
}: DateFieldProps) {
  const id = useId();
  const [error, setError] = useState<string | undefined>();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const display = formatDisplayDate(value);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label uppercase text-muted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          if (error) setError(undefined);
          onValueChange(e.target.value);
        }}
        onBlur={() => setError(validate?.(value))}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-invalid={Boolean(error)}
        className={`h-10 rounded-sm border px-3 text-ink outline-none focus:border-primary ${
          error ? "border-danger" : "border-line"
        }`}
      />
      {display && <p className="text-small text-muted">{display}</p>}
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
