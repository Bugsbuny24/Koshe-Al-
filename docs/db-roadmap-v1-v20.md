# DB Roadmap: V1–V20

> Status: Skeleton documentation. Tables listed as "scaffolded" have their schema defined
> but are not yet active in production. Tables listed as "active core" are live.

---

## Quick Reference

| Status | Meaning |
|---|---|
| **active core** | Live in production. Must not be broken by new migrations. |
| **scaffolded future** | Schema created, RLS and triggers applied. Feature implementation pending. |
| **risky excluded** | Deliberately excluded. Prohibited domain (legal, medical, financial advice). |

---

## Active Core Tables

These tables are operational. All migrations must be additive and must not
rename, drop, or alter existing columns on these tables.

| Table | Description |
|---|---|
| `deals` | Deal contract records |
| `deal_scope_snapshots` | Locked scope snapshots per deal |
| `deal_milestones` | Milestone definitions and status |
| `deal_deliveries` | Delivery asset records per milestone |
| `deal_revisions` | Revision request records |
| `deal_approvals` | Approval decisions per milestone |
| `deal_activity_logs` | Audit/event log for deals |
| `escrow_transactions` | Escrow transaction records |
| `escrow_events` | Escrow lifecycle events |
| `execution_runs` | AI execution run records (V2 core, extended V2.1) |
| `projects` | Project records |
| `conversations` | Conversation threads |
| `messages` | Individual messages within conversations |
| `conversation_context` | Contextual metadata for conversations |
| `feedback_messages` | Feedback submitted on deliverables |
| `organizations` | Organization records |
| `team_members` | Team membership records |
| `notifications` | Notification records |
| `automation_rules` | Automation rule definitions |
| `knowledge_base` | Knowledge base entries |
| `model_routing` | AI model routing configuration |
| `ai_usage` | AI usage telemetry |
| `ai_cost_summary` | Aggregated AI cost summaries |

---

## Scaffolded Future Tables

Schema is applied. Implementation follows in subsequent release sprints.

### V4–V6: Production & Deploy Foundation

| Table | Phase | Description |
|---|---|---|
| `production_runs` | V4 | Core production job records |
| `production_artifacts` | V4 | Output files/assets per production run |
| `output_pipelines` | V4 | Output pipeline configuration registry |
| `deploy_targets` | V6 | External deployment destination definitions |
| `deploy_runs` | V6 | Deployment attempt records |

**Migration file:** `docs/migrations/v4-v6-production-deploy.sql`

---

### V5–V9: Ops / Quality / Feedback Intelligence

| Table | Phase | Description |
|---|---|---|
| `workflow_health_snapshots` | V5 | Workspace pipeline health snapshots |
| `quality_reviews` | V5 | Quality review records per run/deal |
| `feedback_threads` | V9 | Grouped feedback discussion threads |
| `optimization_suggestions` | V9 | System-detected improvement suggestions |
| `risk_signals` | V5/V9 | Risk flag signals from any system source |

**Migration file:** `docs/migrations/v5-v9-ops-quality-feedback.sql`

---

### V10–V12: Revenue / Operations / Executive

| Table | Phase | Description |
|---|---|---|
| `revenue_workflows` | V10 | Revenue process workflow definitions |
| `offer_systems` | V10 | Offer and product definitions |
| `funnel_runs` | V10 | Revenue funnel stage execution records |
| `sop_documents` | V11 | Standard Operating Procedure documents |
| `internal_tool_specs` | V11 | Internal tool specification records |
| `executive_snapshots` | V12 | Executive summary snapshots |
| `decision_briefs` | V12 | Decision support briefs |

**Migration file:** `docs/migrations/v10-v12-revenue-ops-executive.sql`

---

### V13–V15: Industry Packs (Safe Sectors Only)

| Table | Phase | Description |
|---|---|---|
| `industry_packs` | V13 | Industry sector pack registry |
| `industry_templates` | V13/V14 | Reusable templates per industry pack |
| `industry_knowledge_items` | V14 | Knowledge base items per industry pack |
| `sector_workflows` | V15 | Workflow definitions per industry pack |

**Safe sector seeds included:** tourism, ecommerce, agencies, services,
real-estate-marketing, education-content, small-business-ops

**Migration file:** `docs/migrations/v13-v15-industry-packs.sql`

---

### V16–V18: Business Units

| Table | Phase | Description |
|---|---|---|
| `business_units` | V16 | Autonomous business unit definitions |
| `unit_runs` | V16/V17 | Execution records per business unit |
| `unit_metrics` | V18 | Metric data points per business unit |

**Migration file:** `docs/migrations/v16-v18-business-units.sql`

---

### V19–V20: Network Intelligence (Privacy-Safe Skeleton)

| Table | Phase | Description |
|---|---|---|
| `benchmark_datasets` | V20 | Benchmark dataset definitions |
| `pattern_insights` | V19/V20 | Anonymised aggregate pattern observations |
| `privacy_rulesets` | V19 | Privacy guard rule definitions |

**Migration file:** `docs/migrations/v19-v20-network-intelligence.sql`

---

## Risky Excluded Domains

The following domains are deliberately excluded from all Industry Packs,
Sector Knowledge, and Sector Workflows. No tables, seeds, or feature flags
may be created for these domains without explicit legal review.

| Domain | Reason |
|---|---|
| **Legal** | Practice of law requires licensed attorneys. AI advice creates liability. |
| **Healthcare / Medical** | Clinical decisions require licensed clinicians. Errors can cause physical harm. |
| **Investment Advice** | Regulated by SEC/FCA/ASIC. Automated recommendations require licensing. |
| **Credit / Insurance Decisions** | Regulated under ECOA, FCRA, EU AI Act (high-risk). Explainability requirements not met. |
| **Active Cybersecurity Intervention** | Can damage third-party systems and violate CFAA/Computer Misuse Act. |

See `docs/safe-sectors.md` for full sector validation gate logic.

---

## Index, RLS, and Trigger Summary

All scaffolded tables follow these conventions:

### Indexes
- `created_at DESC` index on all tables
- Foreign key column indexes on all FK columns
- Status/category indexes on frequently-filtered columns

### Updated-at Trigger
Tables with an `updated_at` column have a `BEFORE UPDATE` trigger
calling the shared `public.set_updated_at()` function (defined in
`docs/migration_execution_runs.sql`).

Tables with updated_at triggers:
`production_runs`, `deploy_runs`, `quality_reviews`, `feedback_threads`,
`revenue_workflows`, `sop_documents`

### Row Level Security (RLS)
All new tables have RLS enabled. Current policies apply a minimal
authenticated-user skeleton:
- `SELECT`: all authenticated users
- `INSERT`: all authenticated users
- `UPDATE`: all authenticated users (where applicable)

Policies will be tightened to organization-scoped or owner-scoped rules
when the corresponding feature modules reach active implementation.

---

## Migration Execution Order

Run migrations in this order to respect foreign key dependencies:

```
1. docs/migration_execution_runs.sql         (V2 core — execution_runs)
2. docs/migration_execution_runs_v2.sql      (V2.1 — execution_runs extensions)
3. docs/migrations/v4-v6-production-deploy.sql
4. docs/migrations/v5-v9-ops-quality-feedback.sql
5. docs/migrations/v10-v12-revenue-ops-executive.sql
6. docs/migrations/v13-v15-industry-packs.sql
7. docs/migrations/v16-v18-business-units.sql
8. docs/migrations/v19-v20-network-intelligence.sql
```
