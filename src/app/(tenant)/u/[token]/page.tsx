// T-01 · Report a problem — see spec/screens/tenant/T-01-report-a-problem.md
// Placeholder scaffold only; no product features implemented yet.
export default async function ReportAProblemPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-h1 font-semibold text-ink">RentRoll</h1>
      <p className="mt-2 text-body">
        Tenant link scaffold for token <code>{token}</code>. See{" "}
        <code>spec/screens/tenant/T-01-report-a-problem.md</code> for the
        screen this route will implement.
      </p>
    </main>
  );
}
