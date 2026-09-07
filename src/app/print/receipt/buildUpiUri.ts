import { formatMonthYear } from "@/lib/format";
import type { RentReceiptPrintProps } from "./RentReceiptPrint";

/** Builds a standard `upi://pay` deep-link URI for the receipt's QR code. */
export function buildUpiUri(
  data: Pick<RentReceiptPrintProps, "upiId" | "landlordName" | "amount" | "rentMonth" | "unitLabel">,
): string {
  const params = new URLSearchParams({
    pa: data.upiId ?? "",
    pn: data.landlordName,
    am: String(Math.round(data.amount)),
    cu: "INR",
    tn: `Rent ${formatMonthYear(data.rentMonth)} ${data.unitLabel}`,
  });
  return `upi://pay?${params.toString()}`;
}
