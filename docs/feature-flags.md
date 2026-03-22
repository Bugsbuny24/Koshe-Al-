# Feature Flags: V4–V20

> All flags default to `enabled: false`. They are registered for planning and scaffolding purposes only.
> No flag should be set to `true` in production until the corresponding version is fully implemented and reviewed.

---

## Flag Registry

| Flag Key | Version | Label | Default |
|---|---|---|---|
| `V4_PRODUCTION_ENGINE` | v4 | Production Engine | `false` |
| `V5_OPERATIONAL_INTELLIGENCE` | v5 | Operational Intelligence | `false` |
| `V6_DEPLOY_CONNECTORS` | v6 | Deploy Connectors | `false` |
| `V7_AUTONOMOUS_PRODUCTION` | v7 | Autonomous Production | `false` |
| `V8_TEAM_WORKSPACE` | v8 | Team / Company OS | `false` |
| `V9_LEARNING_ENGINE` | v9 | Learning Engine | `false` |
| `V10_REVENUE_OPERATOR` | v10 | Revenue Operator | `false` |
| `V11_OPERATIONS_OPERATOR` | v11 | Operations Operator | `false` |
| `V12_EXECUTIVE_OPERATOR` | v12 | Executive Operator | `false` |
| `V13_INDUSTRY_PACKS` | v13 | Industry Packs | `false` |
| `V14_SECTOR_KNOWLEDGE` | v14 | Sector Knowledge | `false` |
| `V15_SECTOR_WORKFLOWS` | v15 | Sector Workflows | `false` |
| `V16_AUTONOMOUS_UNITS` | v16 | Autonomous Units | `false` |
| `V17_MULTI_UNIT_ROUTING` | v17 | Multi-Unit Routing | `false` |
| `V18_UNIT_ANALYTICS` | v18 | Unit Analytics | `false` |
| `V19_CROSS_COMPANY_INTELLIGENCE` | v19 | Cross-Company Intelligence | `false` |
| `V20_BENCHMARK_ENGINE` | v20 | Benchmark Engine | `false` |

---

## Flag Descriptions

### `V4_PRODUCTION_ENGINE`
Enables the structured AI production engine that takes approved proposals and generates deliverables. Gating this flag prevents any autonomous content generation from triggering.

### `V5_OPERATIONAL_INTELLIGENCE`
Enables the real-time operational dashboard: throughput metrics, error rates, and stage latency views. Safe to scaffold early, but data sources must be wired before enabling.

### `V6_DEPLOY_CONNECTORS`
Enables third-party connector integrations (Notion, Google Drive, email, webhook). Requires OAuth credential storage to be secured before activation.

### `V7_AUTONOMOUS_PRODUCTION`
Enables scheduled and event-driven autonomous job execution. **High risk if enabled prematurely** — circuit breakers and cost limits must be verified first.

### `V8_TEAM_WORKSPACE`
Enables multi-user team features: roles, shared deals, permission layers. Requires Supabase RLS policies to be fully tested before activation.

### `V9_LEARNING_ENGINE`
Enables the feedback loop and outcome-learning system. **Privacy review required** before any client data is used for learning signals.

### `V10_REVENUE_OPERATOR`
Enables automated invoicing, pricing models, and upsell triggers. **Regional legal compliance review required** before enabling for live billing.

### `V11_OPERATIONS_OPERATOR`
Enables SOP libraries, automated QA checklists, and task assignment. Safe to scaffold; validate QA logic thoroughly before enabling in production.

### `V12_EXECUTIVE_OPERATOR`
Enables executive KPI summaries and strategic recommendations. Requires high data quality from V10 and V11 before output is meaningful.

### `V13_INDUSTRY_PACKS`
Enables pre-configured industry bundles. **Safe sector gate must be implemented first** — see `safe-sectors.md` for allowed sectors.

### `V14_SECTOR_KNOWLEDGE`
Enables sector knowledge bases and context injection. Copyright and freshness audit of knowledge sources required before enabling.

### `V15_SECTOR_WORKFLOWS`
Enables end-to-end sector-specific automation workflows. Depends on V13 and V14 being stable.

### `V16_AUTONOMOUS_UNITS`
Enables spinning up self-contained autonomous business units. **Kill switch and resource limits must be enforced** before enabling.

### `V17_MULTI_UNIT_ROUTING`
Enables intelligent routing of deals across multiple units. Requires V16 to be stable and routing audit logs to be active.

### `V18_UNIT_ANALYTICS`
Enables per-unit performance analytics and benchmarking. Requires V16 and V17 to be producing consistent data.

### `V19_CROSS_COMPANY_INTELLIGENCE`
Enables aggregated cross-company signal collection. **Opt-in consent framework and anonymization pipeline must be fully audited** before enabling. GDPR/CCPA compliance mandatory.

### `V20_BENCHMARK_ENGINE`
Enables the percentile ranking and performance gap benchmark reports. Requires sufficient V19 signal volume for statistically meaningful results.

---

## How to Use Flags

### Runtime Check

```typescript
import { isFeatureEnabled } from '@/lib/features/flags';

if (isFeatureEnabled('V4_PRODUCTION_ENGINE')) {
  // render or execute feature
}
```

### Component Guard

```tsx
import { isFeatureEnabled } from '@/lib/features/flags';
import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function ProductionPage() {
  if (!isFeatureEnabled('V4_PRODUCTION_ENGINE')) {
    return (
      <PlannedModulePage
        title="Production Engine"
        version="v4"
        summary="Structured AI deliverable generation."
        status="scaffolded"
      />
    );
  }
  return <ProductionEngineModule />;
}
```

### Reading Flag Metadata

```typescript
import { featureFlags } from '@/lib/features/flags';

const flag = featureFlags['V4_PRODUCTION_ENGINE'];
console.log(flag.label);       // "Production Engine"
console.log(flag.description); // Full description string
console.log(flag.version);     // "v4"
```

---

## Rollout Strategy

Flags follow a sequential unlock pattern tied to version completion gates:

```
V4 → V5 → V6          (must stabilize before V7)
V7 → V8 → V9          (must stabilize before V10)
V10 → V11 → V12       (must stabilize before V13)
V13 → V14 → V15       (must stabilize before V16)
V16 → V17 → V18       (must stabilize before V19)
V19 → V20             (final intelligence layer)
```

Each flag unlock requires:
1. All unit tests for the version passing
2. A manual QA sign-off on the scaffolded UI
3. A security review for any flag involving data sharing, payments, or autonomy
4. A staging environment soak test (minimum 48h) before production activation

**Flags must never be enabled by default in committed code** — activation is an ops-level decision, not a code-level decision.
