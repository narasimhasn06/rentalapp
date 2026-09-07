// Landlord workspace shell. Every route in this group requires a signed-in
// landlord (see spec/foundations.md A3 "Global navigation" and
// spec/screens/landlord/L-01-sign-in.md). Auth enforcement is a product
// feature and intentionally not implemented here — see spec/index.md for
// the screen specs this group will grow into (L-01 .. L-15). The sidebar,
// mobile bottom bar and responsive shell (A3/A4) live in
// src/components/shell and are wired in below.
import { AppShell } from "@/components/shell/AppShell";

export default function LandlordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
