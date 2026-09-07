import Link from "next/link";

interface StatCardBodyProps {
  label: string;
  value: string;
  comparison?: string;
}

function StatCardBody({ label, value, comparison }: StatCardBodyProps) {
  return (
    <>
      <div className="text-label uppercase text-muted">{label}</div>
      <div className="mt-2 text-display text-ink tabular-nums">{value}</div>
      {comparison && <div className="mt-1 text-small text-muted">{comparison}</div>}
    </>
  );
}

export interface StatCardProps extends StatCardBodyProps {
  /** If set, the whole card is a link — never just the number (spec/foundations.md A2). */
  href?: string;
  onClick?: () => void;
}

/** A2 "Stat card": uppercase label, display-size number, optional comparison line. */
export function StatCard({ label, value, comparison, href, onClick }: StatCardProps) {
  const shared =
    "rounded-md border border-line bg-surface p-4 text-left shadow-1 sm:p-6";

  if (href) {
    return (
      <Link href={href} className={`block ${shared} transition-colors hover:border-primary`}>
        <StatCardBody label={label} value={value} comparison={comparison} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full ${shared} transition-colors hover:border-primary`}
      >
        <StatCardBody label={label} value={value} comparison={comparison} />
      </button>
    );
  }

  return (
    <div className={shared}>
      <StatCardBody label={label} value={value} comparison={comparison} />
    </div>
  );
}
