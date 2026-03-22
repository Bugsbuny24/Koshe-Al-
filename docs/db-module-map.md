# DB Module Map: V1–V20

> Shows which database tables belong to which version layer, their ownership,
> and cross-module data flow relationships.

---

## Table-to-Version Index

| Table | Version Layer | Stage | Module |
|---|---|---|---|
| `deals` | V1–V3 | active core | Deal Structuring |
| `deal_scope_snapshots` | V3 | active core | Deal Structuring |
| `deal_milestones` | V3 | active core | Deal Structuring |
| `deal_deliveries` | V3 | active core | Deal Structuring |
| `deal_revisions` | V3 | active core | Deal Structuring |
| `deal_approvals` | V3 | active core | Deal Structuring |
| `deal_activity_logs` | V3 | active core | Deal Structuring |
| `escrow_transactions` | V3 | active core | Deal Structuring |
| `escrow_events` | V3 | active core | Deal Structuring |
| `projects` | V1–V2 | active core | Proposal Engine |
| `execution_runs` | V2 | active core | Proposal Engine |
| `conversations` | V1 | active core | Lead Intake |
| `messages` | V1 | active core | Lead Intake |
| `conversation_context` | V1 | active core | Lead Intake |
| `feedback_messages` | V1–V3 | active core | Lead Intake / Deals |
| `organizations` | V1 | active core | Shared |
| `team_members` | V1 | active core | Shared |
| `notifications` | V1 | active core | Shared |
| `automation_rules` | V1–V3 | active core | Shared |
| `knowledge_base` | V1 | active core | Shared |
| `model_routing` | V2 | active core | Proposal Engine |
| `ai_usage` | V2 | active core | Proposal Engine |
| `ai_cost_summary` | V2 | active core | Proposal Engine |
| `production_runs` | V4 | scaffolded | Production Engine |
| `production_artifacts` | V4 | scaffolded | Production Engine |
| `output_pipelines` | V4 | scaffolded | Production Engine |
| `workflow_health_snapshots` | V5 | scaffolded | Operational Intelligence |
| `quality_reviews` | V5 | scaffolded | Operational Intelligence |
| `deploy_targets` | V6 | scaffolded | Deploy Connectors |
| `deploy_runs` | V6 | scaffolded | Deploy Connectors |
| `feedback_threads` | V9 | scaffolded | Learning Engine |
| `optimization_suggestions` | V9 | scaffolded | Learning Engine |
| `risk_signals` | V5/V9 | scaffolded | Operational Intelligence |
| `revenue_workflows` | V10 | scaffolded | Revenue Operator |
| `offer_systems` | V10 | scaffolded | Revenue Operator |
| `funnel_runs` | V10 | scaffolded | Revenue Operator |
| `sop_documents` | V11 | scaffolded | Operations Operator |
| `internal_tool_specs` | V11 | scaffolded | Operations Operator |
| `executive_snapshots` | V12 | scaffolded | Executive Operator |
| `decision_briefs` | V12 | scaffolded | Executive Operator |
| `industry_packs` | V13 | scaffolded | Industry Packs |
| `industry_templates` | V13/V14 | scaffolded | Industry Packs / Sector Knowledge |
| `industry_knowledge_items` | V14 | scaffolded | Sector Knowledge |
| `sector_workflows` | V15 | scaffolded | Sector Workflows |
| `business_units` | V16 | scaffolded | Autonomous Units |
| `unit_runs` | V16/V17 | scaffolded | Autonomous Units / Multi-Unit Routing |
| `unit_metrics` | V18 | scaffolded | Unit Analytics |
| `benchmark_datasets` | V20 | scaffolded | Benchmark Engine |
| `pattern_insights` | V19/V20 | scaffolded | Cross-Company Intelligence |
| `privacy_rulesets` | V19 | scaffolded | Cross-Company Intelligence |

---

## Layer Ownership Map

```
INTAKE LAYER (V1, V8)
  conversations
  messages
  conversation_context
  feedback_messages
  organizations
  team_members
  notifications

PLANNING LAYER (V2, V3, V13)
  projects
  execution_runs
  model_routing
  ai_usage
  ai_cost_summary
  automation_rules
  knowledge_base
  deals + deal_* tables
  escrow_* tables
  industry_packs
  industry_templates
  industry_knowledge_items

PRODUCTION LAYER (V4, V7, V11, V15, V16)
  production_runs
  production_artifacts
  output_pipelines
  sop_documents
  internal_tool_specs
  sector_workflows
  business_units
  unit_runs

DELIVERY LAYER (V6, V10, V17)
  deploy_targets
  deploy_runs
  revenue_workflows
  offer_systems
  funnel_runs

INTELLIGENCE LAYER (V5, V9, V12, V14, V18, V19, V20)
  workflow_health_snapshots
  quality_reviews
  risk_signals
  feedback_threads
  optimization_suggestions
  executive_snapshots
  decision_briefs
  unit_metrics
  benchmark_datasets
  pattern_insights
  privacy_rulesets
```

---

## Cross-Module FK Relationships

```
execution_runs ──FK──> production_runs
production_runs ──FK──> production_artifacts
production_runs ──FK──> quality_reviews
production_runs ──FK──> deploy_runs
production_runs ──FK──> projects
production_runs ──FK──> deals

deploy_targets ──FK──> deploy_runs
deploy_targets ──FK──> organizations

organizations ──FK──> revenue_workflows
organizations ──FK──> sop_documents
organizations ──FK──> internal_tool_specs
organizations ──FK──> executive_snapshots
organizations ──FK──> deploy_targets
organizations ──FK──> workflow_health_snapshots
organizations ──FK──> business_units

revenue_workflows ──FK──> offer_systems
revenue_workflows ──FK──> funnel_runs

executive_snapshots ──FK──> decision_briefs

feedback_messages ──FK──> feedback_threads
deals ──FK──> feedback_threads
execution_runs ──FK──> feedback_threads

industry_packs ──FK──> industry_templates
industry_packs ──FK──> industry_knowledge_items
industry_packs ──FK──> sector_workflows

business_units ──FK──> unit_runs
business_units ──FK──> unit_metrics

benchmark_datasets ──FK──> pattern_insights
```

---

## Status Field Conventions

All new tables use `text` columns with clear default values rather than enums,
following the `text + check constraint` approach for future-safe evolution.

### Common Status Values by Table Group

| Group | Typical Status Values |
|---|---|
| Production runs | `draft` · `queued` · `running` · `completed` · `failed` · `cancelled` |
| Deploy runs | `draft` · `pending` · `deployed` · `failed` · `rolled_back` |
| Quality reviews | `pending` · `in_review` · `approved` · `rejected` · `flagged` |
| Workflow health | `healthy` · `degraded` · `critical` · `unknown` |
| Revenue workflows | `draft` · `active` · `paused` · `archived` |
| Industry packs | `planned` · `scaffolded` · `active` · `deprecated` |
| Business units | `planned` · `active` · `paused` · `archived` |
| Benchmark datasets | `planned` · `collecting` · `ready` · `archived` |
| Optimization suggestions | `new` · `reviewed` · `applied` · `dismissed` |
| Risk signals | `open` · `acknowledged` · `resolved` · `false_positive` |
| Feedback threads | `open` · `in_progress` · `resolved` · `closed` |
| Decision briefs | `open` · `decided` · `deferred` · `closed` |

---

## Excluded / Prohibited Table Groups

The following table categories must never be created:

| Category | Reason |
|---|---|
| Legal advice tables | Regulated professional domain |
| Medical / clinical tables | Patient safety liability |
| Investment advisory tables | SEC/FCA regulated |
| Credit scoring tables | ECOA / FCRA regulated |
| Active cybersecurity tables | Computer fraud law exposure |

See `docs/safe-sectors.md` and `docs/db-roadmap-v1-v20.md` for full details.
