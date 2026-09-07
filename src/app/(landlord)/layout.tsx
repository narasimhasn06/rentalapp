// Landlord workspace shell. Every route in this group requires a signed-in
// landlord (see spec/foundations.md A3 "Global navigation" and
// spec/screens/landlord/L-01-sign-in.md). Auth enforcement and the sidebar
// nav are product features and are intentionally not implemented in this
// scaffold — see spec/index.md for the screen specs this group will grow
// into (L-01 .. L-15).
export default function LandlordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-canvas text-body">{children}</div>;
}
