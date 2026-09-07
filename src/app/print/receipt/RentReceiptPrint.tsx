import { amountInWords, formatDate, formatMonthYear, formatRupees } from "@/lib/format";

export interface RentReceiptPrintProps {
  receiptNumber: string;
  landlordName: string;
  /** Optional — spec/foundations.md A2's S-04 photo uploader (L15-UPL-LOGO). */
  landlordLogoUrl?: string;
  /** India requirement (not in the source spec): printed only when the landlord has one on file. */
  landlordPan?: string;
  tenantName: string;
  unitLabel: string;
  propertyName?: string;
  rentMonth: Date | string;
  /** Whole-rupee amount actually received (spec/decisions.md D8/D13 — a receipt is issued for the amount received, not the amount due). */
  amount: number;
  dateReceived: Date | string;
  paymentReference?: string;
  /**
   * Pre-rendered SVG markup for the UPI payment QR (see
   * src/app/print/receipt/page.tsx, which builds it from the landlord's
   * saved UPI ID via the `qrcode` package). Omitted entirely — not a
   * broken image — when no UPI ID is on file.
   */
  qrCodeSvg?: string;
  upiId?: string;
}

// PROMOTE: this is a one-off print layout, not a candidate for
// src/components/ui — print views intentionally don't reuse the shared
// on-screen component library (spec/screens/print/P-01-rent-receipt.md's
// "Print view rules": a genuinely separate, minimal page, not the app
// shell with a print stylesheet).
export function RentReceiptPrint({
  receiptNumber,
  landlordName,
  landlordLogoUrl,
  landlordPan,
  tenantName,
  unitLabel,
  propertyName,
  rentMonth,
  amount,
  dateReceived,
  paymentReference,
  qrCodeSvg,
  upiId,
}: RentReceiptPrintProps) {
  return (
    <main className="mx-auto w-[210mm] min-h-[297mm] bg-surface p-[16mm] text-ink">
      <header className="flex items-start justify-between border-b border-line pb-[8px]">
        <div className="flex items-center gap-[12px]">
          {landlordLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- print page, no next/image optimisation pipeline needed
            <img src={landlordLogoUrl} alt="" className="h-[40px] w-[40px] object-contain" />
          ) : null}
          <div>
            <div className="text-[20px] font-semibold text-ink">{landlordName}</div>
            {landlordPan ? (
              <div className="text-[13px] text-muted">PAN: {landlordPan}</div>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.6px] text-muted">
            Receipt
          </div>
          <div className="text-[16px] font-semibold text-ink">{receiptNumber}</div>
        </div>
      </header>

      <h1 className="mt-[24px] text-[20px] font-semibold text-ink">Rent receipt</h1>

      <dl className="mt-[16px] grid grid-cols-2 gap-x-[24px] gap-y-[12px] text-[14px]">
        <Field label="Received from" value={tenantName} />
        <Field label="Unit" value={propertyName ? `${unitLabel}, ${propertyName}` : unitLabel} />
        <Field label="For the month of" value={formatMonthYear(rentMonth)} />
        <Field label="Date received" value={formatDate(dateReceived)} />
        {paymentReference ? <Field label="Payment reference" value={paymentReference} /> : null}
      </dl>

      <div className="mt-[24px] rounded-md border border-line bg-canvas p-[16px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.6px] text-muted">
          Amount received
        </div>
        <div className="mt-[4px] text-[28px] font-semibold text-ink">{formatRupees(amount)}</div>
        <div className="mt-[4px] text-[13px] text-body">{amountInWords(amount)}</div>
      </div>

      {qrCodeSvg && upiId ? (
        <div className="mt-[24px] flex items-center gap-[12px]">
          <div
            className="h-[96px] w-[96px] shrink-0"
            // Generated server-side from the landlord's saved UPI ID via
            // the `qrcode` package (see page.tsx) — not user-supplied
            // markup.
            dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
          />
          <div className="text-[13px] text-muted">
            <div>Pay by UPI</div>
            <div>{upiId}</div>
          </div>
        </div>
      ) : null}

      <div className="mt-[48px] flex justify-end">
        <div className="w-[64mm] border-t border-line pt-[4px] text-center text-[13px] text-muted">
          Signature
        </div>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.6px] text-muted">
        {label}
      </dt>
      <dd className="mt-[2px] text-ink">{value}</dd>
    </div>
  );
}
