import type { ReactNode } from "react";

export interface TimelineEvent {
  id: string;
  icon: ReactNode;
  text: ReactNode;
  /** Pre-formatted timestamp string. */
  timestamp: string;
}

export interface TimelineProps {
  /** Newest first — the caller is responsible for ordering (spec/foundations.md A2). */
  events: TimelineEvent[];
}

/** A2 "Timeline": vertical list of events, each with an icon, a line of text, and a timestamp. */
export function Timeline({ events }: TimelineProps) {
  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3">
          <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary-soft text-primary">
            {event.icon}
          </div>
          <div>
            <p className="text-body">{event.text}</p>
            <p className="mt-0.5 text-small text-muted">{event.timestamp}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
