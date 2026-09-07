#!/usr/bin/env node
// RentRoll demo seed generator (ticket C2 — see scripts/seed/SPEC.md).
//
// Produces the demo dataset described in SPEC.md as JSON on stdout, with
// every date-sensitive field computed relative to the moment this script
// runs (see SPEC.md "Date handling") rather than hardcoded.
//
// This is as far as seeding can go without a database schema: it stops
// at producing data in memory / JSON. Persisting it is TODO(schema) — see
// README.md.
//
// Usage: node scripts/seed/generate.mjs [> out.json]

import {
  landlord,
  properties,
  units,
  currentTenants,
  pastTenants,
  inProgressSettlement,
  maintenanceRequests,
} from "./data/reference-data.mjs";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Midnight `n` days before `now`, as YYYY-MM-DD. */
function daysAgo(n, now = new Date()) {
  return isoDate(new Date(now.getTime() - n * MS_PER_DAY));
}

/** Midnight `n` days after `now`, as YYYY-MM-DD. */
function daysFromNow(n, now = new Date()) {
  return daysAgo(-n, now);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

/** ₹ + Indian digit grouping, per spec/foundations.md's "Money field"
 * component (thousands separators, no decimals) — matches the literal
 * "Part paid — ₹4,000 pending" example in
 * spec/screens/landlord/L-04-rent-due-board.md.
 */
function formatRupees(amount) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/** Reminder ladder derived from how many days overdue a rent entry is,
 * per spec/product.md "Rent lifecycle" and spec/screens/landlord/L-15-settings.md
 * (day 3 gentle, day 10 direct, day 20 formal). Only applied to fully
 * unpaid ("overdue") rent entries — see SPEC.md "Rent lifecycle demo data".
 */
function reminderHistoryFor(dueDaysAgo, now) {
  const [gentle, direct, formal] = landlord.reminderLadderDays;
  const history = [];
  if (dueDaysAgo >= gentle) {
    history.push({ level: "gentle", method: "whatsapp", sentDate: daysAgo(dueDaysAgo - gentle, now) });
  }
  if (dueDaysAgo >= direct) {
    history.push({ level: "direct", method: "whatsapp", sentDate: daysAgo(dueDaysAgo - direct, now) });
  }
  if (dueDaysAgo >= formal) {
    history.push({ level: "formal", method: "whatsapp", sentDate: daysAgo(dueDaysAgo - formal, now) });
  }
  return history;
}

function escalationLevel(dueDaysAgo) {
  const [gentle, direct] = landlord.reminderLadderDays;
  // "Level" tracks which reminder tier is current/next, per the example in
  // spec/screens/shared/S-01-message-composer.md (18 days overdue reads
  // as "Level 3 of 3" — the formal notice is the next one due, once both
  // the gentle and direct reminders have already gone out).
  if (dueDaysAgo >= direct) return { level: 3, of: 3 }; // formal tier is current/next
  if (dueDaysAgo >= gentle) return { level: 2, of: 3 }; // direct tier is current/next
  return { level: 1, of: 3 };
}

/** One rent entry, resolved to real dates. */
function buildRentEntry({ unit, tenant, monthLabel, dueDaysAgo, paidDaysAgo, amountPaid, scenario }, now) {
  const rentDue = unit.monthlyRent;
  const dueDate = daysAgo(dueDaysAgo, now);

  if (scenario === "paid") {
    return {
      unitId: unit.id,
      tenantId: tenant.id,
      month: monthLabel,
      rentDue,
      amountPaid: rentDue,
      dueDate,
      datePaid: daysAgo(paidDaysAgo, now),
      status: "Paid",
      receiptNumber: `RR-${placeholderReceiptNumber(unit.id, monthLabel)}`,
    };
  }

  if (scenario === "partPaid") {
    return {
      unitId: unit.id,
      tenantId: tenant.id,
      month: monthLabel,
      rentDue,
      amountPaid,
      dueDate,
      datePaid: daysAgo(paidDaysAgo, now),
      status: `Part paid — ${formatRupees(rentDue - amountPaid)} pending`,
      receiptNumber: `RR-${placeholderReceiptNumber(unit.id, monthLabel)}`,
    };
  }

  // scenario === "overdue"
  const daysLate = dueDaysAgo;
  return {
    unitId: unit.id,
    tenantId: tenant.id,
    month: monthLabel,
    rentDue,
    amountPaid: 0,
    dueDate,
    datePaid: null,
    status: `${daysLate}d late`,
    daysLate,
    escalation: escalationLevel(dueDaysAgo),
    reminderHistory: reminderHistoryFor(dueDaysAgo, now),
    receiptNumber: null,
  };
}

function placeholderReceiptNumber(unitId, monthLabel) {
  // TODO(schema): a real implementation issues these from a sequence.
  // This is a stable-but-fake placeholder for demo purposes only.
  const hash = `${unitId}-${monthLabel}`.split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 10000, 7);
  return String(1000 + hash).slice(0, 4);
}

function monthLabelFor(dueDate) {
  return dueDate.slice(0, 7); // YYYY-MM
}

function buildTenantRentHistory(tenant, unit, now) {
  const entries = [];
  const current = buildRentEntry(
    {
      unit,
      tenant,
      monthLabel: monthLabelFor(daysAgo(tenant.rent.dueDaysAgo, now)),
      dueDaysAgo: tenant.rent.dueDaysAgo,
      paidDaysAgo: tenant.rent.paidDaysAgo,
      amountPaid: tenant.rent.amountPaid,
      scenario: tenant.rent.scenario,
    },
    now,
  );
  entries.push(current);

  // Two clean, on-time prior months so L-11's "paid-on-time percentage"
  // has real history to compute against — see SPEC.md "Rent lifecycle
  // demo data".
  for (const monthsBack of [1, 2]) {
    const priorDueDaysAgo = tenant.rent.dueDaysAgo + monthsBack * 30;
    entries.push(
      buildRentEntry(
        {
          unit,
          tenant,
          monthLabel: monthLabelFor(daysAgo(priorDueDaysAgo, now)),
          dueDaysAgo: priorDueDaysAgo,
          paidDaysAgo: priorDueDaysAgo,
          scenario: "paid",
        },
        now,
      ),
    );
  }

  return entries;
}

function buildAgreement(tenant, unit, now) {
  const { startDaysAgo, endOffsetDays, noticeGiven, noticeGivenDaysAgo, moveOutDaysFromNow } = tenant.agreement;
  const agreement = {
    tenantId: tenant.id,
    unitId: unit.id,
    startDate: daysAgo(startDaysAgo, now),
    endDate: endOffsetDays >= 0 ? daysFromNow(endOffsetDays, now) : daysAgo(-endOffsetDays, now),
    rent: unit.monthlyRent,
    deposit: unit.deposit,
    escalationPercent: landlord.rentEscalationDefaultPercent,
    noticeGiven: Boolean(noticeGiven),
  };
  if (noticeGiven) {
    agreement.noticeGivenDate = daysAgo(noticeGivenDaysAgo, now);
    agreement.moveOutDate = daysFromNow(moveOutDaysFromNow, now);
  }
  return agreement;
}

function buildMaintenanceRequest(request, now) {
  const reportedDate = daysAgo(request.reportedDaysAgo, now);
  const ageDays = request.status === "Done" ? null : request.reportedDaysAgo;
  return {
    ...request,
    reportedDate,
    closedDate: "closedDaysAgo" in request ? daysAgo(request.closedDaysAgo, now) : null,
    ageDays,
    // Aging rule from spec/screens/landlord/L-06-maintenance-board.md:
    // >48h "warning" left border, >7 days "danger" left border. Only
    // meaningful while status is New.
    agingTier: request.status === "New" ? agingTierFor(request.reportedDaysAgo) : null,
  };
}

function agingTierFor(reportedDaysAgo) {
  if (reportedDaysAgo > 7) return "danger";
  if (reportedDaysAgo * 24 > 48) return "warning";
  return null;
}

function buildDepositSettlement({ id, tenantId, unitId, depositHeld, deductions, status, settledDaysAgo }, now) {
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  return {
    id,
    tenantId,
    unitId,
    depositHeld,
    deductions,
    totalDeductions,
    balanceRefundable: depositHeld - totalDeductions,
    status,
    settledDate: settledDaysAgo != null ? daysAgo(settledDaysAgo, now) : null,
  };
}

function generate(now = new Date()) {
  const unitById = Object.fromEntries(units.map((u) => [u.id, u]));

  const rentEntries = currentTenants.flatMap((tenant) => buildTenantRentHistory(tenant, unitById[tenant.unitId], now));

  const agreements = [
    ...currentTenants.map((tenant) => buildAgreement(tenant, unitById[tenant.unitId], now)),
    ...pastTenants.map((tenant) => buildAgreement(tenant, unitById[tenant.unitId], now)),
  ];

  const resolvedMaintenanceRequests = maintenanceRequests.map((request) => buildMaintenanceRequest(request, now));

  const depositSettlements = [
    buildDepositSettlement(inProgressSettlement, now),
    ...pastTenants.map((tenant) =>
      buildDepositSettlement(
        {
          id: tenant.settlement.id,
          tenantId: tenant.id,
          unitId: tenant.unitId,
          depositHeld: tenant.settlement.depositHeld,
          deductions: tenant.settlement.deductions,
          status: "settled",
          settledDaysAgo: tenant.settlement.settledDaysAgo,
        },
        now,
      ),
    ),
  ];

  const documents = [
    ...currentTenants.map((tenant) => ({
      tenantId: tenant.id,
      unitId: tenant.unitId,
      moveInPhotos: tenant.moveInPhotos
        ? { present: true, count: 4, takenDate: daysAgo(tenant.agreement.startDaysAgo, now) }
        : { present: false, count: 0, takenDate: null },
      agreementDocument: { present: true, label: `${tenant.name} — signed agreement.pdf` },
      idProofDocument: { present: true, label: `${tenant.name} — ID proof.pdf` },
    })),
    ...pastTenants.map((tenant) => ({
      tenantId: tenant.id,
      unitId: tenant.unitId,
      moveInPhotos: tenant.moveInPhotos
        ? { present: true, count: 4, takenDate: daysAgo(tenant.agreement.startDaysAgo, now) }
        : { present: false, count: 0, takenDate: null },
      agreementDocument: { present: true, label: `${tenant.name} — signed agreement.pdf (archived)` },
      idProofDocument: { present: true, label: `${tenant.name} — ID proof.pdf (archived)` },
    })),
  ];

  return {
    generatedAt: now.toISOString(),
    note:
      "Demo content only — see scripts/seed/SPEC.md. No database schema exists yet; nothing here is a table definition, and this script does not persist anything (TODO(schema), see scripts/seed/README.md).",
    landlord,
    properties,
    units,
    tenants: {
      current: currentTenants.map((t) => ({ id: t.id, unitId: t.unitId, name: t.name, phone: t.phone, email: t.email, status: "current" })),
      past: pastTenants.map((t) => ({ id: t.id, unitId: t.unitId, name: t.name, phone: t.phone, status: "past" })),
    },
    agreements,
    rentEntries,
    maintenanceRequests: resolvedMaintenanceRequests,
    depositSettlements,
    documents,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dataset = generate();
  process.stdout.write(JSON.stringify(dataset, null, 2) + "\n");
}

export { generate, daysAgo, daysFromNow };
