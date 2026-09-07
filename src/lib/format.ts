/**
 * Formats a whole-rupee amount the way spec/foundations.md's "Money
 * field" component describes: ₹ prefix, thousands separators, no
 * decimals.
 */
export function formatRupees(amount: number): string {
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString("en-IN")}`;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Splits a Date or date string into calendar parts without going through
 * a timezone conversion — a bare "YYYY-MM-DD" string is parsed as those
 * literal digits, not as UTC midnight reinterpreted in the local zone.
 */
function toDateParts(date: Date | string): { day: number; month: number; year: number } {
  if (typeof date === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
    if (match) {
      return {
        day: Number(match[3]),
        month: Number(match[2]) - 1,
        year: Number(match[1]),
      };
    }
    date = new Date(date);
  }
  return { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
}

/** Formats a date as `DD MMM YYYY`, per spec/foundations.md A2's "Date field". */
export function formatDate(date: Date | string): string {
  const { day, month, year } = toDateParts(date);
  return `${String(day).padStart(2, "0")} ${MONTH_NAMES[month]} ${year}`;
}

/** Formats a date's month and year only, e.g. for a rent month — "Sep 2026". */
export function formatMonthYear(date: Date | string): string {
  const { month, year } = toDateParts(date);
  return `${MONTH_NAMES[month]} ${year}`;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigitWords(n: number): string {
  if (n < 20) return ONES[n] ?? "";
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones ? `${TENS[tens] ?? ""} ${ONES[ones] ?? ""}` : (TENS[tens] ?? "");
}

function threeDigitWords(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(twoDigitWords(rest));
  return parts.join(" ");
}

/**
 * Spells out a whole-rupee amount using the Indian numbering system
 * (crore / lakh / thousand), not the Western short scale a generic
 * number-to-words library would produce — 1,86,000 is "One Lakh
 * Eighty Six Thousand", never "One Hundred Eighty Six Thousand".
 */
export function amountInWords(amount: number): string {
  const whole = Math.round(Math.abs(amount));
  if (whole === 0) return "Rupees Zero Only";

  let remainder = whole;
  const crore = Math.floor(remainder / 1_00_00_000);
  remainder %= 1_00_00_000;
  const lakh = Math.floor(remainder / 1_00_000);
  remainder %= 1_00_000;
  const thousand = Math.floor(remainder / 1_000);
  remainder %= 1_000;
  const hundreds = remainder;

  const segments: string[] = [];
  if (crore) segments.push(`${threeDigitWords(crore)} Crore`);
  if (lakh) segments.push(`${twoDigitWords(lakh)} Lakh`);
  if (thousand) segments.push(`${twoDigitWords(thousand)} Thousand`);
  if (hundreds) segments.push(threeDigitWords(hundreds));

  return `Rupees ${segments.join(" ")} Only`;
}
