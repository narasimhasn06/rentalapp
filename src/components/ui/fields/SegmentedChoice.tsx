"use client";

export interface SegmentedChoiceOption {
  value: string;
  label: string;
}

export interface SegmentedChoiceProps {
  label?: string;
  /** 2–4 options, shown as adjacent buttons (spec/foundations.md A2). */
  options: SegmentedChoiceOption[];
  value: string;
  onValueChange: (value: string) => void;
}

/** A2 "Segmented choice": used for urgency and status filters. */
export function SegmentedChoice({ label, options, value, onValueChange }: SegmentedChoiceProps) {
  if (process.env.NODE_ENV !== "production" && (options.length < 2 || options.length > 4)) {
    console.warn(
      `SegmentedChoice expects 2-4 options (spec/foundations.md A2); received ${options.length}.`,
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-label uppercase text-muted">{label}</span>}
      <div role="radiogroup" aria-label={label} className="inline-flex gap-1 rounded-sm border border-line p-0.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onValueChange(option.value)}
              className={`rounded-sm px-3 py-1.5 text-small font-semibold transition-colors ${
                selected ? "bg-primary text-surface" : "text-ink hover:bg-canvas"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
