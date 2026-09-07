/**
 * Formats a whole-rupee amount the way spec/foundations.md's "Money
 * field" component describes: ₹ prefix, thousands separators, no
 * decimals.
 */
export function formatRupees(amount: number): string {
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString("en-IN")}`;
}
