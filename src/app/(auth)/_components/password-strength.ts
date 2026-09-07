/**
 * L-01 rule: "strength shown as a single word, not a bar."
 * (spec/screens/landlord/L-01-sign-in.md)
 */
export function passwordStrengthLabel(password: string): string {
  if (password.length === 0) return "";
  if (password.length < 8) return "Too short";

  const varietyCount = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((re) =>
    re.test(password),
  ).length;

  if (password.length >= 12 && varietyCount >= 3) return "Strong";
  if (password.length >= 8 && varietyCount >= 2) return "Okay";
  return "Weak";
}
