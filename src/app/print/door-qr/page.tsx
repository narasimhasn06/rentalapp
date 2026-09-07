import QRCode from "qrcode";
import { PrintOnLoad } from "../PrintOnLoad";
import { DoorQrGrid } from "./DoorQrGrid";
import { doorQrFixture } from "./fixture";

/**
 * P-03 door QR card (spec/screens/print/P-03-door-qr-card.md). Each
 * card's QR encodes the unit's door_token link, never a tenant_token —
 * see spec/decisions.md D1/D2 and .claude/rules/tenant-routes.md.
 *
 * Renders from a props fixture — the data layer isn't ready (see
 * CLAUDE.md "Out of scope until a schema ticket lands"). Integration
 * requirement for whoever wires this up next: this route should accept
 * the unit(s) to print (e.g. one unit from L-09, or a property's whole
 * unit list from L-08) and load each unit's door_token URL server-side,
 * replacing the `doorQrFixture` import below.
 */
export default async function DoorQrPrintPage() {
  const cards = await Promise.all(
    doorQrFixture.map(async ({ reportUrl, ...card }) => ({
      ...card,
      qrCodeSvg: await QRCode.toString(reportUrl, { type: "svg", margin: 0 }),
    })),
  );

  return (
    <>
      <PrintOnLoad />
      <DoorQrGrid cards={cards} />
    </>
  );
}
