"use client";

// PROMOTE: src/components/ui -- spec/foundations.md A2 "Text field": label
// above, helper text below, error replaces helper text in danger colour.
// Built locally for L-01 because src/components/ui doesn't exist yet and
// isn't owned by this lane (CLAUDE.md §4, .claude/rules/parallel.md).

import { useId, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, className, ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="text-label uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        id={fieldId}
        className={`h-10 rounded-sm border border-line bg-surface px-3 text-body text-ink outline-none focus:border-primary ${className ?? ""}`}
        {...props}
      />
      {error ? <p className="text-small text-danger">{error}</p> : null}
    </div>
  );
}
