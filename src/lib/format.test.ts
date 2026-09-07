import { describe, expect, it } from "vitest";
import { amountInWords, formatDate, formatMonthYear, formatRupees } from "./format";

describe("formatRupees", () => {
  it("formats with the rupee sign and Indian digit grouping", () => {
    expect(formatRupees(16000)).toBe("₹16,000");
    expect(formatRupees(210000)).toBe("₹2,10,000");
  });

  it("rounds to a whole number", () => {
    expect(formatRupees(999.6)).toBe("₹1,000");
  });
});

describe("formatDate", () => {
  it("formats as DD MMM YYYY", () => {
    expect(formatDate("2026-09-07")).toBe("07 Sep 2026");
    expect(formatDate(new Date(2026, 0, 3))).toBe("03 Jan 2026");
  });
});

describe("formatMonthYear", () => {
  it("formats as MMM YYYY", () => {
    expect(formatMonthYear("2026-09-07")).toBe("Sep 2026");
  });
});

describe("amountInWords", () => {
  it("uses lakh, not the Western 'hundred thousand'", () => {
    expect(amountInWords(186000)).toBe("Rupees One Lakh Eighty Six Thousand Only");
  });

  it("uses crore, not the Western 'ten million'", () => {
    expect(amountInWords(10000000)).toBe("Rupees One Crore Only");
  });

  it("handles a plain amount under a thousand", () => {
    expect(amountInWords(450)).toBe("Rupees Four Hundred Fifty Only");
  });

  it("handles zero", () => {
    expect(amountInWords(0)).toBe("Rupees Zero Only");
  });

  it("rounds fractional amounts", () => {
    expect(amountInWords(999.6)).toBe("Rupees One Thousand Only");
  });

  it("combines crore, lakh, thousand and hundreds", () => {
    expect(amountInWords(12345678)).toBe(
      "Rupees One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Only",
    );
  });
});
