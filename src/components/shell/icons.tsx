// Minimal inline nav icons for the landlord shell (spec/foundations.md A3).
// PROMOTE: once components/ui grows a real icon set, these nine icons
// should move there and every import here should switch to it — kept
// local for now per CLAUDE.md §4 (don't touch components/ui from a
// feature lane).
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1.2" />
      <rect x="11" y="3" width="6" height="6" rx="1.2" />
      <rect x="3" y="11" width="6" height="6" rx="1.2" />
      <rect x="11" y="11" width="6" height="6" rx="1.2" />
    </Base>
  );
}

export function RentIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="7.2" />
      <text
        x="10"
        y="13.4"
        textAnchor="middle"
        fontSize="8.5"
        stroke="none"
        fill="currentColor"
      >
        ₹
      </text>
    </Base>
  );
}

export function MaintenanceIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12.8 3.6a3.4 3.4 0 0 0-4.4 4.2L3 13.2v3.2h3.2l5.4-5.4a3.4 3.4 0 0 0 4.2-4.4l-2.3 2.3-2-2 2.3-2.3Z" />
    </Base>
  );
}

export function UnitsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="3" width="12" height="14" rx="1" />
      <path d="M7.5 6.5h1M11.5 6.5h1M7.5 9.5h1M11.5 9.5h1M7.5 12.5h1M11.5 12.5h1" />
      <path d="M8.5 17v-3h3v3" />
    </Base>
  );
}

export function TenantsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="7.2" cy="7" r="2.6" />
      <path d="M2.6 16v-.8a4 4 0 0 1 4-4h1.2a4 4 0 0 1 4 4v.8" />
      <circle cx="14" cy="7.6" r="2" />
      <path d="M13 11.5a3.6 3.6 0 0 1 4.4 3.5v1" />
    </Base>
  );
}

export function AgreementsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 2.6h6l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1Z" />
      <path d="M12 2.6v3h3" />
      <path d="M7 10.5h6M7 13h6" />
    </Base>
  );
}

export function DepositsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="8.5" width="12" height="8" rx="1.4" />
      <path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" />
      <circle cx="10" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function DocumentsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2.8 5.4a1 1 0 0 1 1-1h3.4l1.4 1.6h7.6a1 1 0 0 1 1 1v8.6a1 1 0 0 1-1 1H3.8a1 1 0 0 1-1-1V5.4Z" />
    </Base>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 2.8v1.6M10 15.6v1.6M17.2 10h-1.6M4.4 10H2.8M15 15l-1.1-1.1M6.1 6.1 5 5M15 5l-1.1 1.1M6.1 13.9 5 15" />
    </Base>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={0}>
      <circle cx="4.5" cy="10" r="1.6" fill="currentColor" />
      <circle cx="10" cy="10" r="1.6" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1.6" fill="currentColor" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 5l10 10M15 5 5 15" />
    </Base>
  );
}
