import "server-only";

/**
 * Placeholder for landlord-only server logic. This file exists so the
 * `src/server/landlord` boundary (see src/server/README.md) has a real
 * module to protect, ahead of the first landlord feature ticket. No
 * product logic or schema is implemented here — see spec/index.md's note
 * on the missing entity relationship diagram for why schema work is
 * deliberately out of scope for this scaffold.
 */
export function landlordOnlyPlaceholder(): string {
  return "landlord-only";
}
