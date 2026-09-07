"use client";

import { useId, useState } from "react";

const CHARACTER_COUNTER_THRESHOLD = 400;
const MAX_VISIBLE_LINES = 8;
const LINE_HEIGHT_PX = 20; // matches the default 14px/20px body text

export interface TextAreaProps {
  label: string;
  helperText?: string;
  value: string;
  onValueChange: (value: string) => void;
  validate?: (value: string) => string | undefined;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
}

/** A2 "Text area": auto-grows to 8 lines then scrolls; counter appears past 400 characters. */
export function TextArea({
  label,
  helperText,
  value,
  onValueChange,
  validate,
  required,
  maxLength,
  placeholder,
}: TextAreaProps) {
  const id = useId();
  const [error, setError] = useState<string | undefined>();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    const maxHeight = LINE_HEIGHT_PX * MAX_VISIBLE_LINES;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label uppercase text-muted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        ref={(el) => {
          if (el) autoGrow(el);
        }}
        onChange={(e) => {
          if (error) setError(undefined);
          onValueChange(e.target.value);
          autoGrow(e.target);
        }}
        onBlur={(e) => setError(validate?.(e.target.value))}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-invalid={Boolean(error)}
        className={`resize-none overflow-y-auto rounded-sm border px-3 py-2 text-ink outline-none focus:border-primary ${
          error ? "border-danger" : "border-line"
        }`}
      />
      <div className="flex items-start justify-between gap-2">
        {error ? (
          <p id={errorId} className="text-small text-danger">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-small text-muted">
            {helperText}
          </p>
        ) : (
          <span />
        )}
        {value.length > CHARACTER_COUNTER_THRESHOLD && (
          <span className="whitespace-nowrap text-small text-muted tabular-nums">
            {value.length}
            {maxLength ? `/${maxLength}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
