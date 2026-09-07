-- RentRoll initial schema
--
-- Applies spec/decisions.md D1-D17 (the seven mandatory schema corrections
-- plus the ten additional blocking conflicts). See CLAUDE.md and
-- spec/index.md for why no schema existed before this migration.
--
-- Tenant isolation strategy: every landlord-owned table carries a
-- denormalized `landlord_id`, and every child table's foreign key to its
-- parent is a COMPOSITE foreign key -- (parent_id, landlord_id) references
-- parent(id, landlord_id). Postgres itself then rejects a row whose
-- landlord_id doesn't match its parent's, so "a landlord reaches only
-- their own rows" holds even against an application bug, not just an RLS
-- policy. RLS (below) is what makes a wrong-landlord lookup behave as
-- "not found" instead of "forbidden" for direct queries.
--
-- The public tenant surface (door_token / tenant_token, D1/D2/D15) never
-- gets a table-level grant of any kind for the `anon` role. It is served
-- exclusively by resolve_tenant_token(), a SECURITY DEFINER function with
-- a strict, explicit output column list -- see that section below.

create extension if not exists pgcrypto;

-- ============================================================
-- Tables
-- ============================================================

-- landlord: one row per signed-in account, id = auth.users.id. Created by
-- the handle_new_landlord trigger below, never by client insert.
create table public.landlord (
  id uuid primary key references auth.users (id) on delete cascade,
  business_name text,
  receipt_name text,
  upi_id text,
  logo_url text,
  accountant_email text,
  escalation_default_pct numeric(5, 2),
  -- D11: three tiers fixed, day-thresholds configurable per landlord.
  reminder_day_gentle integer not null default 3,
  reminder_day_direct integer not null default 10,
  reminder_day_formal integer not null default 20,
  -- D14: receipt/request numbers are sequential per landlord, not global.
  next_receipt_seq integer not null default 0,
  next_request_seq integer not null default 0,
  created_at timestamptz not null default now()
);

-- landlord_signin_attempt: L-01's "five failed attempts -> 30s delay"
-- rule. Keyed by email (pre-auth, no landlord_id exists yet). Reached
-- only via the service-role admin client from src/app/(auth)/** -- see
-- the grants section, which deliberately gives this table zero grants to
-- anon or authenticated.
create table public.landlord_signin_attempt (
  email text primary key,
  failed_count integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create table public.property (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.landlord (id) on delete cascade,
  name text not null,
  address text not null,
  created_at timestamptz not null default now(),
  unique (id, landlord_id)
);

create index property_landlord_id_idx on public.property (landlord_id);

create table public.unit (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  property_id uuid not null,
  unit_number text not null,
  unit_type text,
  monthly_rent numeric(12, 2) not null,
  -- D6: unit.default_deposit is only the asking figure; the amount
  -- actually held lives on tenancy.deposit_amount.
  default_deposit numeric(12, 2) not null,
  -- D1/D15: durable, unit-scoped, globally unique. Never rotated by a
  -- tenancy change.
  door_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  unique (id, landlord_id),
  unique (property_id, unit_number),
  foreign key (property_id, landlord_id)
    references public.property (id, landlord_id) on delete cascade
);

create index unit_landlord_id_idx on public.unit (landlord_id);
create index unit_property_id_idx on public.unit (property_id);

create table public.tenant (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.landlord (id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now(),
  unique (id, landlord_id)
);

create index tenant_landlord_id_idx on public.tenant (landlord_id);

create table public.tenancy (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  unit_id uuid not null,
  tenant_id uuid not null,
  -- D6: the amount actually held for this tenancy, set once at move-in.
  deposit_amount numeric(12, 2) not null,
  deposit_received_date date,
  -- D5: notice/move-out state lives on tenancy, not agreement -- it must
  -- survive agreement renewal untouched.
  notice_given boolean not null default false,
  notice_given_date date,
  move_out_date date,
  -- D1/D15: per-tenancy, globally unique, pre-fills tenant identity.
  -- Invalidation on tenancy end is enforced by resolve_tenant_token()
  -- checking move_out_date, not by deleting this value -- keeps the
  -- audit trail intact.
  tenant_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  started_at date not null default current_date,
  created_at timestamptz not null default now(),
  unique (id, landlord_id),
  foreign key (unit_id, landlord_id)
    references public.unit (id, landlord_id) on delete cascade,
  foreign key (tenant_id, landlord_id)
    references public.tenant (id, landlord_id) on delete cascade
);

create index tenancy_landlord_id_idx on public.tenancy (landlord_id);
create index tenancy_unit_id_idx on public.tenancy (unit_id);
create index tenancy_tenant_id_idx on public.tenancy (tenant_id);

-- D3: agreement is its own entity, child of tenancy. A tenancy has one
-- active agreement at a time but potentially many over its life.
create table public.agreement (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  tenancy_id uuid not null,
  start_date date not null,
  end_date date not null,
  rent numeric(12, 2) not null,
  -- D4: rent_due_day lives on agreement, not a system-wide constant.
  rent_due_day integer not null default 1 check (rent_due_day between 1 and 28),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, landlord_id),
  foreign key (tenancy_id, landlord_id)
    references public.tenancy (id, landlord_id) on delete cascade,
  check (end_date >= start_date)
);

create index agreement_landlord_id_idx on public.agreement (landlord_id);
create index agreement_tenancy_id_idx on public.agreement (tenancy_id);

-- D3: at most one active agreement per tenancy.
create unique index agreement_one_active_per_tenancy
  on public.agreement (tenancy_id)
  where is_active;

-- D7: rent_entry has no stored status/amount_paid -- those are derived
-- from child payment rows and would otherwise drift out of sync.
create table public.rent_entry (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  unit_id uuid not null,
  tenancy_id uuid not null,
  period_month date not null,
  rent_due numeric(12, 2) not null,
  due_date date not null,
  is_pro_rata boolean not null default false,
  created_at timestamptz not null default now(),
  unique (id, landlord_id),
  unique (unit_id, period_month),
  foreign key (unit_id, landlord_id)
    references public.unit (id, landlord_id) on delete cascade,
  foreign key (tenancy_id, landlord_id)
    references public.tenancy (id, landlord_id) on delete cascade,
  check (period_month = date_trunc('month', period_month)::date)
);

create index rent_entry_landlord_id_idx on public.rent_entry (landlord_id);
create index rent_entry_unit_id_idx on public.rent_entry (unit_id);
create index rent_entry_tenancy_id_idx on public.rent_entry (tenancy_id);

-- D7/D8: payment is a child of rent_entry, scoped to rent payments only.
-- Deposit and repair-cost-recovery money movements are tracked
-- elsewhere (tenancy.deposit_amount, maintenance_request.cost) and never
-- create a payment row.
create table public.payment (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  rent_entry_id uuid not null,
  amount numeric(12, 2) not null check (amount > 0),
  received_date date not null default current_date,
  payment_reference text,
  -- D13/D14: assigned by the assign_receipt_number trigger below,
  -- sequential per landlord ("RR-0001").
  receipt_number text,
  created_at timestamptz not null default now(),
  unique (id, landlord_id),
  unique (landlord_id, receipt_number),
  foreign key (rent_entry_id, landlord_id)
    references public.rent_entry (id, landlord_id) on delete cascade
);

create index payment_landlord_id_idx on public.payment (landlord_id);
create index payment_rent_entry_id_idx on public.payment (rent_entry_id);

-- D16: exactly four status values, no fifth "Reopened" value -- reopening
-- reuses "In progress" (application-layer concern; schema just needs the
-- four-value constraint).
-- D17: vendor stays as inline fields, not a normalized entity.
create table public.maintenance_request (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  unit_id uuid not null,
  tenancy_id uuid,
  -- D14: assigned by the assign_request_number trigger below,
  -- sequential per landlord ("R-0001").
  request_number text,
  category text not null
    check (category in ('Plumbing', 'Electrical', 'Appliance', 'Structural', 'Pest', 'Cleaning', 'Other')),
  description text not null,
  urgency text not null default 'Normal'
    check (urgency in ('Low', 'Normal', 'Urgent')),
  status text not null default 'New'
    check (status in ('New', 'Assigned', 'In progress', 'Done')),
  reporter_name text,
  reporter_phone text,
  reported_by text,
  vendor_name text,
  vendor_phone text,
  cost numeric(12, 2),
  no_cost boolean not null default false,
  tenant_liable boolean not null default false,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (id, landlord_id),
  unique (landlord_id, request_number),
  foreign key (unit_id, landlord_id)
    references public.unit (id, landlord_id) on delete cascade,
  foreign key (tenancy_id, landlord_id)
    references public.tenancy (id, landlord_id) on delete cascade
);

create index maintenance_request_landlord_id_idx on public.maintenance_request (landlord_id);
create index maintenance_request_unit_id_idx on public.maintenance_request (unit_id);
create index maintenance_request_tenancy_id_idx on public.maintenance_request (tenancy_id);

-- D10: is_protected defaults true (safe default). Only move-in condition
-- photos and a tenant's own submitted maintenance photos are ever
-- is_protected = false, and that flip happens at the application layer
-- when those specific documents are created -- the schema's job is just
-- to make "protected" the default nobody can silently skip.
-- Owner reference is polymorphic (owner_type/owner_id) -- documented
-- tradeoff: no DB-level referential integrity across the three owner
-- types, since normalizing that would mean three join tables the spec
-- never asks for. RLS via landlord_id still fully protects this table.
create table public.document (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.landlord (id) on delete cascade,
  owner_type text not null
    check (owner_type in ('unit', 'tenancy', 'maintenance_request')),
  owner_id uuid not null,
  category text not null,
  file_url text not null,
  is_protected boolean not null default true,
  uploaded_by text,
  created_at timestamptz not null default now(),
  unique (id, landlord_id)
);

create index document_landlord_id_idx on public.document (landlord_id);
create index document_owner_idx on public.document (owner_type, owner_id);

-- D9: one unified entity underlies every timeline in the product
-- (reminder history, request history, tenant-safe views). Each timeline
-- UI is a filtered view over this table, not a bespoke table of its own.
create table public.audit_event (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.landlord (id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  event_type text not null,
  is_protected boolean not null default true,
  body text,
  actor_type text,
  actor_id uuid,
  created_at timestamptz not null default now()
);

create index audit_event_landlord_id_idx on public.audit_event (landlord_id);
create index audit_event_entity_idx on public.audit_event (entity_type, entity_id);

-- D6/D8/D13: supports L-13's deposit/settlement flow. A settlement is the
-- parent of one or more deductions; correcting an already-settled
-- statement creates a new settlement that supersedes the first rather
-- than mutating it (application-layer rule, supersedes_settlement_id is
-- the trail).
create table public.settlement (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  tenancy_id uuid not null,
  deposit_held numeric(12, 2) not null,
  agreement_id uuid,
  status text not null default 'draft' check (status in ('draft', 'settled')),
  supersedes_settlement_id uuid,
  settled_at timestamptz,
  document_id uuid,
  created_at timestamptz not null default now(),
  unique (id, landlord_id),
  foreign key (tenancy_id, landlord_id)
    references public.tenancy (id, landlord_id) on delete cascade,
  foreign key (agreement_id, landlord_id)
    references public.agreement (id, landlord_id) on delete set null,
  foreign key (supersedes_settlement_id, landlord_id)
    references public.settlement (id, landlord_id) on delete set null,
  foreign key (document_id, landlord_id)
    references public.document (id, landlord_id) on delete set null
);

create index settlement_landlord_id_idx on public.settlement (landlord_id);
create index settlement_tenancy_id_idx on public.settlement (tenancy_id);

-- One row per deduction (a real child table, not a JSON array) -- L-13's
-- "add and remove rows" behaviour needs independently addressable rows,
-- and a deduction can reference a photo carried across from an existing
-- maintenance-request document.
create table public.settlement_deduction (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null,
  settlement_id uuid not null,
  description text,
  reason text not null,
  amount numeric(12, 2) not null,
  photo_document_id uuid,
  source_maintenance_request_id uuid,
  created_at timestamptz not null default now(),
  foreign key (settlement_id, landlord_id)
    references public.settlement (id, landlord_id) on delete cascade,
  foreign key (photo_document_id, landlord_id)
    references public.document (id, landlord_id) on delete set null,
  foreign key (source_maintenance_request_id, landlord_id)
    references public.maintenance_request (id, landlord_id) on delete set null
);

create index settlement_deduction_landlord_id_idx on public.settlement_deduction (landlord_id);
create index settlement_deduction_settlement_id_idx on public.settlement_deduction (settlement_id);

-- ============================================================
-- Functions and triggers
-- ============================================================

-- Provisions the landlord profile row the moment a Supabase Auth user is
-- created (L-01 sign-up). SECURITY DEFINER is required here: this fires
-- from GoTrue's own insert into auth.users, outside any PostgREST/JWT
-- request context, so auth.uid() is not available and the ordinary RLS
-- policy on public.landlord could never be satisfied by the invoker.
create or replace function public.handle_new_landlord()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.landlord (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_landlord() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_landlord();

-- D14: receipt numbers are sequential per landlord. The UPDATE ...
-- RETURNING pattern takes a row lock on the landlord row for the
-- duration of the transaction, making concurrent inserts safe without a
-- separate sequence object per landlord. No SECURITY DEFINER needed: the
-- inserting landlord is always updating their own landlord row, which
-- their own RLS UPDATE policy already permits.
create or replace function public.assign_receipt_number()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_seq integer;
begin
  if new.receipt_number is null then
    update public.landlord
      set next_receipt_seq = next_receipt_seq + 1
      where id = new.landlord_id
      returning next_receipt_seq into v_seq;
    new.receipt_number := 'RR-' || lpad(v_seq::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger payment_assign_receipt_number
  before insert on public.payment
  for each row execute function public.assign_receipt_number();

-- D14: request numbers, same pattern as receipts.
create or replace function public.assign_request_number()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_seq integer;
begin
  if new.request_number is null then
    update public.landlord
      set next_request_seq = next_request_seq + 1
      where id = new.landlord_id
      returning next_request_seq into v_seq;
    new.request_number := 'R-' || lpad(v_seq::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger maintenance_request_assign_request_number
  before insert on public.maintenance_request
  for each row execute function public.assign_request_number();

-- ============================================================
-- Tenant token resolver
--
-- The ONLY way the public tenant surface (src/app/(tenant)/**) reaches
-- any data. Never grant anon a table policy instead of using this --
-- see the grants section at the end of this file.
-- ============================================================

create type public.tenant_token_resolution as (
  token_type text, -- 'door' | 'tenant' | 'none'
  unit_id uuid,
  tenancy_id uuid, -- null for door tokens
  prefill_name text, -- null unless token_type = 'tenant'
  prefill_phone text -- null unless token_type = 'tenant'
);

-- SECURITY DEFINER so this runs as the owning (RLS-exempt) role -- an
-- anonymous visitor has no auth.uid() and no table grants, so without
-- this the lookup would always return nothing. The return type is a
-- deliberate, explicit allowlist: it can never leak rent, cost, or any
-- other-unit/other-tenant field, because those columns are never
-- selected into it in the first place (E4 test 4).
create or replace function public.resolve_tenant_token(p_token text)
returns public.tenant_token_resolution
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_unit_id uuid;
  v_tenancy_id uuid;
  v_unit_id_for_tenancy uuid;
  v_name text;
  v_phone text;
begin
  select id into v_unit_id from public.unit where door_token = p_token;
  if found then
    return row('door', v_unit_id, null, null, null)::public.tenant_token_resolution;
  end if;

  -- D1: a former tenant's token stops resolving the moment the tenancy
  -- ends -- enforced here (move_out_date is null), not by deleting the
  -- token, so the audit trail of what was issued survives.
  select t.id, t.unit_id, tn.name, tn.phone
    into v_tenancy_id, v_unit_id_for_tenancy, v_name, v_phone
    from public.tenancy t
    join public.tenant tn on tn.id = t.tenant_id
    where t.tenant_token = p_token
      and t.move_out_date is null;
  if found then
    return row('tenant', v_unit_id_for_tenancy, v_tenancy_id, v_name, v_phone)::public.tenant_token_resolution;
  end if;

  return row('none', null, null, null, null)::public.tenant_token_resolution;
end;
$$;

revoke all on function public.resolve_tenant_token(text) from public;
grant execute on function public.resolve_tenant_token(text) to anon, authenticated;

-- ============================================================
-- Row level security
-- ============================================================

alter table public.landlord enable row level security;
alter table public.landlord_signin_attempt enable row level security;
alter table public.property enable row level security;
alter table public.unit enable row level security;
alter table public.tenant enable row level security;
alter table public.tenancy enable row level security;
alter table public.agreement enable row level security;
alter table public.rent_entry enable row level security;
alter table public.payment enable row level security;
alter table public.maintenance_request enable row level security;
alter table public.document enable row level security;
alter table public.audit_event enable row level security;
alter table public.settlement enable row level security;
alter table public.settlement_deduction enable row level security;

-- landlord: may only see/update their own account row. No INSERT policy
-- -- the row is created exclusively by handle_new_landlord above.
create policy landlord_select_own on public.landlord
  for select to authenticated
  using (id = auth.uid());

create policy landlord_update_own on public.landlord
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- landlord_signin_attempt: deliberately zero policies -- see the grants
-- section below, which also gives it zero table-level grants. Reached
-- only by the service-role admin client.

-- Every other landlord-owned table shares one shape: a landlord reaches
-- only rows whose landlord_id is their own, for every operation. Written
-- once as a loop over the table list rather than 48 hand-written policies
-- so the shape can't drift table-to-table.
do $$
declare
  t text;
begin
  foreach t in array array[
    'property', 'unit', 'tenant', 'tenancy', 'agreement', 'rent_entry',
    'payment', 'maintenance_request', 'document', 'audit_event',
    'settlement', 'settlement_deduction'
  ]
  loop
    execute format(
      'create policy %I_select_own on public.%I for select to authenticated using (landlord_id = auth.uid());',
      t, t
    );
    execute format(
      'create policy %I_insert_own on public.%I for insert to authenticated with check (landlord_id = auth.uid());',
      t, t
    );
    execute format(
      'create policy %I_update_own on public.%I for update to authenticated using (landlord_id = auth.uid()) with check (landlord_id = auth.uid());',
      t, t
    );
    execute format(
      'create policy %I_delete_own on public.%I for delete to authenticated using (landlord_id = auth.uid());',
      t, t
    );
  end loop;
end;
$$;

-- ============================================================
-- Grants
--
-- Explicit, not left to Supabase's auto_expose_new_tables default. That
-- default grants full CRUD *plus TRUNCATE* to both anon and authenticated
-- the moment a table is created -- TRUNCATE is not governed by RLS at
-- all (Postgres does not apply row-security policies to it), so leaving
-- it in place would let any signed-in landlord wipe every landlord's
-- data on any table, policies notwithstanding. Revoke everything the
-- auto-expose mechanism granted, then grant back exactly the
-- table-level privileges each role needs -- RLS policies above are what
-- narrow those down to a landlord's own rows. anon gets zero table-level
-- access to anything in this migration; its only reachable surface for
-- tenant data is the resolve_tenant_token() grant above. This must stay
-- the last section of the file so it overrides whatever the auto-expose
-- mechanism already granted when each table was created.
-- ============================================================

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;

grant select, update on public.landlord to authenticated;

grant select, insert, update, delete on
  public.property, public.unit, public.tenant, public.tenancy,
  public.agreement, public.rent_entry, public.payment,
  public.maintenance_request, public.document, public.audit_event,
  public.settlement, public.settlement_deduction
to authenticated;

-- landlord_signin_attempt: intentionally still zero grants to either
-- role after the blanket revoke above -- reached only by the
-- service-role admin client, which bypasses grants entirely.
