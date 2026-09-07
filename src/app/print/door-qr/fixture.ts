/**
 * Props fixture standing in for the data layer (schema work hasn't
 * landed — see CLAUDE.md "Out of scope until a schema ticket lands").
 * Once L-08/L-09 can pass real data, page.tsx should take the unit list
 * (and each unit's door_token URL) as route input instead of importing
 * this fixture. Five units, one more than a page holds, to exercise the
 * page-break onto a second sheet.
 */
export const doorQrFixture: Array<{
  unitLabel: string;
  propertyName: string;
  landlordPhone: string;
  reportUrl: string;
}> = [
  {
    unitLabel: "A-101",
    propertyName: "Green Meadows",
    landlordPhone: "+91 98765 43210",
    reportUrl: "https://rentroll.app/u/7f3a9c1e4b2d8f6a0c5e1b3d7a9f2c4e",
  },
  {
    unitLabel: "A-102",
    propertyName: "Green Meadows",
    landlordPhone: "+91 98765 43210",
    reportUrl: "https://rentroll.app/u/2c8b6d4f0a1e9c7b3d5f8a2c6e0b4d1f",
  },
  {
    unitLabel: "B-201",
    propertyName: "Green Meadows",
    landlordPhone: "+91 98765 43210",
    reportUrl: "https://rentroll.app/u/9e1d3f7b5a0c2e8d4f6b1a3c9e7d5f2b",
  },
  {
    unitLabel: "B-204",
    propertyName: "Green Meadows",
    landlordPhone: "+91 98765 43210",
    reportUrl: "https://rentroll.app/u/4a0c2e6d8f1b3a5c7e9d0f2b4a6c8e1d",
  },
  {
    unitLabel: "C-301",
    propertyName: "Green Meadows",
    landlordPhone: "+91 98765 43210",
    reportUrl: "https://rentroll.app/u/6d8f0a2c4e1b3d5f7a9c0e2b4d6f8a1c",
  },
];
