import QRCode from "qrcode";
import { PrintOnLoad } from "../PrintOnLoad";
import { RentReceiptPrint } from "./RentReceiptPrint";
import { buildUpiUri } from "./buildUpiUri";
import { receiptFixture } from "./fixture";

/**
 * P-01 rent receipt (spec/screens/print/P-01-rent-receipt.md).
 *
 * Renders from a props fixture — the data layer isn't ready (see
 * CLAUDE.md "Out of scope until a schema ticket lands"). Integration
 * requirement for whoever wires this up next: this route should accept
 * a rent_entry/receipt id (e.g. `/print/receipt/[id]`) and load real data
 * server-side, replacing the `receiptFixture` import below. That future
 * loader must also enforce that the requester (landlord, or the specific
 * tenant this receipt belongs to) is actually allowed to see it —
 * `RentReceiptPrint` itself only renders whatever props it's given.
 */
export default async function RentReceiptPrintPage() {
  const data = receiptFixture;

  // Default black-on-white module colours (not design tokens, see
  // CLAUDE.md §3) — QR scan reliability comes first here, and plain
  // black/white is the highest-contrast, most compatible choice.
  const qrCodeSvg = data.upiId
    ? await QRCode.toString(buildUpiUri(data), { type: "svg", margin: 0 })
    : undefined;

  return (
    <>
      <PrintOnLoad />
      <RentReceiptPrint {...data} qrCodeSvg={qrCodeSvg} />
    </>
  );
}
