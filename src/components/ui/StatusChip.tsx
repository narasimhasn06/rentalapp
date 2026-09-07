export type StatusTone = "success" | "warning" | "danger" | "neutral" | "primary";

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-neutral/12 text-neutral",
  primary: "bg-primary-soft text-primary",
};

export interface StatusChipProps {
  tone: StatusTone;
  /** Status colour is never the only signal — this word is mandatory (spec/foundations.md A1). */
  label: string;
}

/** A2 "Status chip": rounded pill, 12% opacity tint, full-colour text, always a word. */
export function StatusChip({ tone, label }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-small font-semibold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
