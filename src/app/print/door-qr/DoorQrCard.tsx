export interface DoorQrCardProps {
  unitLabel: string;
  propertyName: string;
  landlordPhone: string;
  /**
   * Pre-rendered SVG markup for the unit's door_token report-a-problem
   * link (spec/decisions.md D1/D2) — generated server-side by page.tsx
   * via the `qrcode` package, one per unit. Deliberately the unit's
   * door_token, never a tenancy's tenant_token — that split is the whole
   * point of P-03 (spec/screens/print/P-03-door-qr-card.md).
   */
  qrCodeSvg: string;
}

// PROMOTE: one-off print card, not a src/components/ui candidate — see
// the note in RentReceiptPrint.tsx.
export function DoorQrCard({ unitLabel, propertyName, landlordPhone, qrCodeSvg }: DoorQrCardProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[8px] border border-line p-[8mm] text-center text-ink">
      <div className="text-[16px] font-semibold text-ink">{unitLabel}</div>
      <div className="text-[13px] text-muted">{propertyName}</div>
      <div
        className="h-[40mm] w-[40mm]"
        // Generated server-side from the unit's door_token URL (see
        // page.tsx) — not user-supplied markup.
        dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
      />
      <div className="text-[14px] font-semibold text-ink">Scan to report a problem</div>
      <div className="text-[13px] text-muted">Or call {landlordPhone}</div>
    </div>
  );
}
