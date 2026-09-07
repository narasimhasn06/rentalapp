import type { RentReceiptPrintProps } from "./RentReceiptPrint";

/**
 * Props fixture standing in for the data layer (schema work hasn't
 * landed — see CLAUDE.md "Out of scope until a schema ticket lands").
 * Once L-04/L-05/T-05 can pass real data, page.tsx should take these as
 * route input (e.g. a rent_entry id) instead of importing this fixture.
 */
export const receiptFixture: Omit<RentReceiptPrintProps, "qrCodeSvg"> = {
  receiptNumber: "RR-0847",
  landlordName: "Meera Krishnan",
  landlordPan: "ABCDE1234F",
  tenantName: "Arjun Rao",
  unitLabel: "B-204",
  propertyName: "Green Meadows",
  rentMonth: "2026-09-01",
  amount: 186000,
  dateReceived: "2026-09-05",
  paymentReference: "UPI/2026090512345",
  upiId: "meera.krishnan@okhdfcbank",
};
