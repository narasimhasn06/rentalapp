"use client";

// PROMOTE: src/components/ui -- spec/foundations.md A2 "Text field" variant
// with L01-FLD-PASS's show/hide toggle
// (spec/screens/landlord/L-01-sign-in.md). Local to L-01 only, see
// text-field.tsx for why.

import { useId, useState, type InputHTMLAttributes } from "react";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function PasswordField({ label, error, id, className, ...props }: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="text-label uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          className={`h-10 w-full rounded-sm border border-line bg-surface px-3 pr-14 text-body text-ink outline-none focus:border-primary ${className ?? ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-small text-muted"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error ? <p className="text-small text-danger">{error}</p> : null}
    </div>
  );
}
