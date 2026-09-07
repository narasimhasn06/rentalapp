"use client";

import { useState } from "react";
import { assertDevOnly } from "@/lib/dev-only";
import {
  Button,
  IconButton,
  StatusChip,
  StatCard,
  DataTable,
  DataTableActions,
  DetailPanel,
  Timeline,
  EmptyState,
  ToastProvider,
  useToast,
  ConfirmDialog,
  TextField,
  MoneyField,
  PhoneField,
  DateField,
  Dropdown,
  SegmentedChoice,
  TextArea,
  PhotoUploader,
  type ButtonHeight,
  type ButtonVariant,
  type StatusTone,
} from "@/components/ui";

// Development-only route convention: every page under src/app/dev/** must
// call assertDevOnly() first. This route exists locally as a place to
// preview shared UI components (spec/foundations.md A2 "Component
// library") without shipping in the production build — see
// src/lib/dev-only.ts.
export default function DevComponentsPage() {
  assertDevOnly();

  return (
    <ToastProvider>
      <main className="mx-auto max-w-4xl space-y-10 p-6 pb-24">
        <header>
          <h1 className="text-h1 text-ink">Component playground</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Every A2 component (spec/foundations.md) in every state. Local-only route
            (src/lib/dev-only.ts) — not reachable in a production build.
          </p>
        </header>

        <ButtonsSection />
        <FieldsSection />
        <StatSection />
        <StatusChipSection />
        <DataTableSection />
        <TimelineSection />
        <EmptyStateSection />
        <ToastSection />
        <ConfirmDialogSection />
        <CopySection />
      </main>
    </ToastProvider>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-h2 text-ink">{title}</h2>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "quiet", "danger"];
const HEIGHTS: { key: ButtonHeight; label: string }[] = [
  { key: "default", label: "40px default" },
  { key: "compact", label: "32px compact (table rows)" },
  { key: "tenant", label: "48px tenant" },
];

function ButtonsSection() {
  const [loading, setLoading] = useState(false);

  function simulateNetworkCall() {
    setLoading(true);
    // A button that triggers a network call shows an inline spinner and
    // becomes non-interactive until it resolves — never a full-page block.
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <Section title="Buttons" description="Five variants at three heights, disabled-with-tooltip, and an inline spinner.">
      <div className="space-y-6">
        {HEIGHTS.map(({ key, label }) => (
          <div key={key}>
            <p className="text-label uppercase text-muted">{label}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {VARIANTS.map((variant) => (
                <Button key={variant} variant={variant} height={key}>
                  {variant === "danger" ? "Delete unit" : `${variant.charAt(0).toUpperCase()}${variant.slice(1)}`}
                </Button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="text-label uppercase text-muted">Icon (32×32, tooltip + accessible label)</p>
          <div className="mt-2 flex items-center gap-2">
            <IconButton label="Call tenant" icon={<PhoneIcon />} />
            <IconButton label="Share link" icon={<ShareIcon />} />
            <IconButton label="Print receipt" icon={<PrintIcon />} />
          </div>
        </div>

        <div>
          <p className="text-label uppercase text-muted">Disabled, with a tooltip explaining why</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button disabled disabledReason="Add a phone number before sending a reminder.">
              Send reminder
            </Button>
            <IconButton
              label="Delete unit"
              icon={<TrashIcon />}
              disabled
              disabledReason="Units with an active tenancy can't be deleted."
            />
          </div>
        </div>

        <div>
          <p className="text-label uppercase text-muted">Inline spinner (network call in progress)</p>
          <div className="mt-2">
            <Button loading={loading} onClick={simulateNetworkCall}>
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FieldsSection() {
  const [name, setName] = useState("");
  const [rent, setRent] = useState<number | undefined>(16000);
  const [phone, setPhone] = useState("");
  const [moveInDate, setMoveInDate] = useState("2026-04-01");
  const [unitType, setUnitType] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const requiredMsg = "This field is required.";

  return (
    <Section title="Form fields" description="All eight field types. Validation runs on blur, not on keystroke.">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Tenant name"
          placeholder="e.g. Priya Nair"
          value={name}
          onChange={(e) => setName(e.target.value)}
          validate={(v) => (v.trim() ? undefined : requiredMsg)}
          helperText="As it should appear on the agreement."
          required
        />
        <MoneyField
          label="Monthly rent"
          value={rent}
          onValueChange={setRent}
          validate={(v) => (v === undefined ? requiredMsg : undefined)}
          helperText="Whole rupees, no decimals."
          required
        />
        <PhoneField
          label="Phone number"
          value={phone}
          onValueChange={setPhone}
          validate={(v) => (v.length === 10 ? undefined : "Enter all 10 digits.")}
          required
        />
        <DateField
          label="Move-in date"
          value={moveInDate}
          onValueChange={setMoveInDate}
          validate={(v) => (v ? undefined : requiredMsg)}
          required
        />
        <Dropdown
          label="Unit type"
          placeholder="Select a unit type"
          value={unitType}
          onValueChange={setUnitType}
          options={[
            { value: "1bhk", label: "1 BHK" },
            { value: "2bhk", label: "2 BHK" },
            { value: "3bhk", label: "3 BHK" },
          ]}
          validate={(v) => (v ? undefined : requiredMsg)}
          required
        />
        <SegmentedChoice
          label="Urgency"
          value={urgency}
          onValueChange={setUrgency}
          options={[
            { value: "low", label: "Low" },
            { value: "normal", label: "Normal" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
          ]}
        />
      </div>
      <TextArea
        label="Notes"
        value={notes}
        onValueChange={setNotes}
        placeholder="Auto-grows to 8 lines, then scrolls. Counter appears past 400 characters."
        maxLength={600}
      />
      <PhotoUploader label="Move-in condition photos" maxPhotos={10} onPhotosChange={setPhotos} />
      <p className="text-small text-muted">{photos.length} photo(s) attached (simulated upload, no backend yet).</p>
    </Section>
  );
}

function StatSection() {
  return (
    <Section title="Stat card" description="Uppercase label, display-size number, optional comparison. The whole card is the click target.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Rent due" value="₹4,80,000" comparison="12 units" />
        <StatCard label="Overdue" value="₹32,000" comparison="2 tenants" onClick={() => alert("Navigate to overdue rent")} />
        <StatCard label="Open requests" value="5" comparison="+2 this week" />
      </div>
    </Section>
  );
}

const TONES: { tone: StatusTone; label: string }[] = [
  { tone: "success", label: "Paid" },
  { tone: "warning", label: "Due soon" },
  { tone: "danger", label: "Overdue" },
  { tone: "neutral", label: "Vacant" },
  { tone: "primary", label: "Active" },
];

function StatusChipSection() {
  return (
    <Section title="Status chip" description="12% opacity tint, full-colour text, always a word — never colour alone.">
      <div className="flex flex-wrap gap-2">
        {TONES.map(({ tone, label }) => (
          <StatusChip key={tone} tone={tone} label={label} />
        ))}
      </div>
    </Section>
  );
}

interface RentRow {
  id: string;
  unit: string;
  tenant: string;
  amount: string;
  status: StatusTone;
  statusLabel: string;
}

const RENT_ROWS: RentRow[] = [
  { id: "1", unit: "A-101", tenant: "Priya Nair", amount: "₹16,000", status: "success", statusLabel: "Paid" },
  { id: "2", unit: "A-102", tenant: "Rahul Verma", amount: "₹18,500", status: "warning", statusLabel: "Due soon" },
  { id: "3", unit: "B-201", tenant: "Ayesha Khan", amount: "₹15,000", status: "danger", statusLabel: "Overdue" },
];

function DataTableSection() {
  const { showToast } = useToast();
  const [sortKey, setSortKey] = useState("unit");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openRow, setOpenRow] = useState<RentRow | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const rows = [...RENT_ROWS].sort((a, b) => {
    const dir = sortDirection === "asc" ? 1 : -1;
    return a[sortKey as keyof RentRow] > b[sortKey as keyof RentRow] ? dir : -dir;
  });

  return (
    <Section title="Data table + detail panel" description="Sticky header, sortable columns, 48px rows. Row click opens the panel; row buttons stop propagation.">
      <DataTable
        columns={[
          { key: "unit", header: "Unit", sortable: true, render: (r) => r.unit },
          { key: "tenant", header: "Tenant", sortable: true, render: (r) => r.tenant },
          { key: "amount", header: "Rent", align: "right", render: (r) => r.amount },
          { key: "status", header: "Status", render: (r) => <StatusChip tone={r.status} label={r.statusLabel} /> },
          {
            key: "actions",
            header: "",
            align: "right",
            render: (r) => (
              <DataTableActions>
                <IconButton
                  label="Send reminder"
                  icon={<PhoneIcon />}
                  onClick={() => showToast({ message: `Reminder queued for ${r.tenant}` })}
                />
              </DataTableActions>
            ),
          },
        ]}
        rows={rows}
        rowKey={(r) => r.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key) => {
          if (key === sortKey) {
            setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
          } else {
            setSortKey(key);
            setSortDirection("asc");
          }
        }}
        onRowClick={setOpenRow}
      />

      <DetailPanel
        open={openRow !== null}
        onClose={() => {
          setOpenRow(null);
          setHasUnsavedChanges(false);
        }}
        title={openRow ? `${openRow.unit} — ${openRow.tenant}` : ""}
        hasUnsavedChanges={hasUnsavedChanges}
      >
        {openRow && (
          <div className="space-y-4">
            <p className="text-body">
              Rent: <span className="text-ink tabular-nums">{openRow.amount}</span>
            </p>
            <StatusChip tone={openRow.status} label={openRow.statusLabel} />
            <label className="flex items-center gap-2 text-small text-muted">
              <input
                type="checkbox"
                checked={hasUnsavedChanges}
                onChange={(e) => setHasUnsavedChanges(e.target.checked)}
              />
              Simulate an unsaved edit (closing now asks for confirmation)
            </label>
          </div>
        )}
      </DetailPanel>
    </Section>
  );
}

function TimelineSection() {
  return (
    <Section title="Timeline" description="Newest first, each with an icon, a line of text, and a timestamp.">
      <Timeline
        events={[
          { id: "3", icon: <CheckIcon />, text: "Reminder sent to Rahul Verma", timestamp: "07 Sep 2026, 10:14 am" },
          { id: "2", icon: <PhoneIcon />, text: "Called about the leaking tap", timestamp: "05 Sep 2026, 4:02 pm" },
          { id: "1", icon: <PlusIcon />, text: "Request created", timestamp: "05 Sep 2026, 9:30 am" },
        ]}
      />
    </Section>
  );
}

function EmptyStateSection() {
  return (
    <Section title="Empty state" description="One explanatory line — never just 'No data.' — plus the button that creates the first record.">
      <EmptyState
        icon={<PlusIcon />}
        message="No maintenance requests yet. Once a tenant reports a problem, it will show up here."
        actionLabel="Add a request manually"
        onAction={() => alert("Open the new-request form")}
      />
    </Section>
  );
}

function ToastSection() {
  const { showToast } = useToast();
  return (
    <Section title="Toast" description="Bottom-centre, 4 seconds, one optional Undo. Never used for errors that need a decision.">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => showToast({ message: "Rent marked as paid" })}>
          Show toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            showToast({
              message: "Request archived",
              undoLabel: "Undo",
              onUndo: () => showToast({ message: "Restored" }),
            })
          }
        >
          Show toast with Undo
        </Button>
      </div>
    </Section>
  );
}

function ConfirmDialogSection() {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  return (
    <Section title="Confirm dialog" description="Title as a question, one consequence line, and a named action button — never 'OK'.">
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete unit
      </Button>
      <ConfirmDialog
        open={open}
        title="Delete this unit?"
        consequence="This removes A-101 and its history. This can't be undone."
        confirmLabel="Delete unit"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          showToast({ message: "Unit deleted" });
        }}
      />
    </Section>
  );
}

function CopySection() {
  const { showToast } = useToast();

  function handleCopy() {
    // Clipboard writes must happen synchronously inside the click
    // handler — never after an `await` — or the browser can refuse the
    // write once the user gesture is no longer "current".
    void navigator.clipboard.writeText("https://rentroll.app/u/demo-token").then(
      () => showToast({ message: "Link copied" }),
      () => showToast({ message: "Couldn't copy — copy it manually" }),
    );
  }

  return (
    <Section title="Copy" description="The clipboard write is called directly from the click handler, never after an await.">
      <IconButton label="Copy tenant link" icon={<CopyIcon />} onClick={handleCopy} />
    </Section>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 2h2.2l1 3-1.3 1.1a7 7 0 004 4l1.1-1.3 3 1V12a1 1 0 01-1 1A9 9 0 013 4a1 1 0 011-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="12" cy="4" r="1.8" fill="currentColor" />
      <circle cx="4" cy="8" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <path d="M5.6 7.2l4.8-2.8M5.6 8.8l4.8 2.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 6V3h7v3M4.5 11v2h7v-2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 4.5h9M6.5 4.5V3h3v1.5M4.5 4.5l.5 8a1 1 0 001 1h4a1 1 0 001-1l.5-8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.5" y="5.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 10.5v-6a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
