-- deals
create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  buyer_id uuid,
  seller_id uuid,
  total_amount numeric not null default 0,
  currency text not null default 'USD',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- deal_scope_snapshots
create table if not exists deal_scope_snapshots (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  version integer not null default 1,
  summary text not null default '',
  deliverables_json jsonb not null default '[]',
  exclusions_json jsonb not null default '[]',
  revision_policy_json jsonb not null default '[]',
  acceptance_criteria_json jsonb not null default '[]',
  locked_by uuid,
  locked_at timestamptz not null default now()
);

-- deal_milestones
create table if not exists deal_milestones (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  title text not null,
  description text not null default '',
  amount numeric not null default 0,
  sort_order integer not null default 0,
  deadline timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- deal_deliveries
create table if not exists deal_deliveries (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  milestone_id uuid not null references deal_milestones(id) on delete cascade,
  delivery_type text not null default 'other',
  asset_url text not null default '',
  note text not null default '',
  version integer not null default 1,
  uploaded_by uuid,
  created_at timestamptz not null default now()
);

-- deal_revisions
create table if not exists deal_revisions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  milestone_id uuid,
  raw_feedback text not null default '',
  parsed_feedback_json jsonb,
  scope_status text not null default 'in_scope',
  action_items_json jsonb not null default '[]',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- deal_approvals
create table if not exists deal_approvals (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  milestone_id uuid not null references deal_milestones(id) on delete cascade,
  approved_by uuid,
  decision text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

-- escrow_transactions
create table if not exists escrow_transactions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  provider text not null default 'escrow.com',
  external_transaction_id text not null default '',
  amount numeric not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending',
  funded_amount numeric not null default 0,
  released_amount numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- escrow_events
create table if not exists escrow_events (
  id uuid primary key default gen_random_uuid(),
  escrow_transaction_id uuid not null references escrow_transactions(id) on delete cascade,
  external_event_type text not null default '',
  payload_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- deal_activity_logs
create table if not exists deal_activity_logs (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals(id) on delete cascade,
  actor_id uuid,
  actor_type text not null default 'system',
  event_type text not null,
  payload_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);
