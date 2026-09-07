import { describe, expect, it } from "vitest";
import { formatRupees } from "./format";

describe("formatRupees", () => {
  it("formats with the rupee sign and Indian digit grouping", () => {
    expect(formatRupees(16000)).toBe("₹16,000");
    expect(formatRupees(210000)).toBe("₹2,10,000");
  });

  it("rounds to a whole number", () => {
    expect(formatRupees(999.6)).toBe("₹1,000");
  });
});
