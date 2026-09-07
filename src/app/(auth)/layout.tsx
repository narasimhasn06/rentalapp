// (auth) shell — L-01 sign in / sign up / reset
// (spec/screens/landlord/L-01-sign-in.md). "This screen is not a
// marketing page" -- no sidebar, no nav, just a centred card.
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm rounded-md border border-line bg-surface p-6 shadow-1">
        <p className="mb-6 text-h1 font-semibold text-ink">RentRoll</p>
        {children}
      </div>
    </div>
  );
}
