# Koschei Roadmap: V4–V20

> Scope: Skeleton definitions only. No full implementation included in this document.
> Each version builds on the layer established by previous versions.

---

## Layer Architecture Reference

```
intake → planning → production → delivery → intelligence
```

- **intake** – Lead capture, intake forms, client onboarding
- **planning** – Proposal generation, scope definition, deal structuring
- **production** – Content, asset, and deliverable generation engines
- **delivery** – Deployment, connector sync, handoff workflows
- **intelligence** – Analytics, benchmarking, learning, cross-company insights

---

## V4–V6: Production & Ops Foundation

### V4 — Production Engine

| Field | Value |
|---|---|
| **Purpose** | Establish the core deliverable-generation engine |
| **Main Capability** | Structured AI content and asset production from approved proposals |
| **Layer** | production |
| **Sits On** | V3 Proposal / Planning layer |
| **Affected Modules** | `/production`, `/execution`, `/deals` |
| **Flag** | `V4_PRODUCTION_ENGINE` |

**Risks:**
- Output quality variability across different prompt types
- Token cost overruns on long-form deliverables
- Rate limits on underlying AI providers during burst usage

**Scope (skeleton):**
- `ProductionEngine` class stub
- `runProductionJob(dealId)` function signature
- Job queue interface definition
- Output schema type definitions

---

### V5 — Operational Intelligence

| Field | Value |
|---|---|
| **Purpose** | Surface operational metrics and pipeline health insights |
| **Main Capability** | Real-time dashboards showing throughput, error rates, and stage latency |
| **Layer** | intelligence |
| **Sits On** | V4 Production Engine |
| **Affected Modules** | `/dashboard`, `/analytics`, `/execution` |
| **Flag** | `V5_OPERATIONAL_INTELLIGENCE` |

**Risks:**
- Metric staleness if real-time sync is not properly debounced
- Dashboard overload with too many low-signal indicators
- Supabase query cost at scale

**Scope (skeleton):**
- `OperationalMetrics` type definitions
- Dashboard widget component stubs
- Supabase view definitions (schema only)
- `fetchOperationalSnapshot()` function signature

---

### V6 — Deploy Connectors

| Field | Value |
|---|---|
| **Purpose** | Enable one-click deployment of deliverables to external platforms |
| **Main Capability** | Connector integrations: Notion, Google Drive, email, webhook |
| **Layer** | delivery |
| **Sits On** | V4 Production Engine + V5 Operational Intelligence |
| **Affected Modules** | `/delivery`, `/deploy/connectors`, `/deals` |
| **Flag** | `V6_DEPLOY_CONNECTORS` |

**Risks:**
- Third-party API rate limits and auth token expiry
- Connector credential storage security
- Webhook reliability (retries, idempotency)

**Scope (skeleton):**
- `ConnectorConfig` type and registry stub
- `deployToConnector(deliverableId, connector)` signature
- Connector adapter interface (`IConnector`)
- OAuth token storage schema

---

## V7–V9: Autonomy & Learning

### V7 — Autonomous Production

| Field | Value |
|---|---|
| **Purpose** | Allow the system to self-trigger production runs without manual initiation |
| **Main Capability** | Scheduled and event-driven autonomous job execution |
| **Layer** | production |
| **Sits On** | V4 Production Engine + V6 Deploy Connectors |
| **Affected Modules** | `/execution`, `/production`, `/flow` |
| **Flag** | `V7_AUTONOMOUS_PRODUCTION` |

**Risks:**
- Runaway job loops without proper circuit breakers
- Cost explosion from unattended AI calls
- Debugging complexity of asynchronous autonomous runs

**Scope (skeleton):**
- `AutonomousJobScheduler` class stub
- Trigger rule schema (`TriggerRule` type)
- `evaluateTrigger(rule, context)` function signature
- Circuit breaker configuration interface

---

### V8 — Team / Company OS

| Field | Value |
|---|---|
| **Purpose** | Extend Koschei from solo operator to multi-user team workspace |
| **Main Capability** | Role-based access, team inboxes, shared deal views, permission layers |
| **Layer** | intake |
| **Sits On** | V1–V3 core + V7 Autonomous Production |
| **Affected Modules** | `/team`, `/auth`, `/deals`, `/intake` |
| **Flag** | `V8_TEAM_WORKSPACE` |

**Risks:**
- Permission model complexity as team size grows
- Data isolation between team members and clients
- Real-time collaboration conflicts (optimistic UI vs. server state)

**Scope (skeleton):**
- `TeamMember`, `Role`, `Permission` type definitions
- `useTeamContext()` hook stub
- RLS (Row Level Security) policy definitions for Supabase
- Team settings page component shell

---

### V9 — Learning Engine

| Field | Value |
|---|---|
| **Purpose** | Let Koschei improve over time by learning from completed deals and outcomes |
| **Main Capability** | Feedback loops, outcome tagging, prompt improvement recommendations |
| **Layer** | intelligence |
| **Sits On** | V4–V8 full stack |
| **Affected Modules** | `/intelligence`, `/analytics`, `/execution` |
| **Flag** | `V9_LEARNING_ENGINE` |

**Risks:**
- Feedback data privacy (learning from client deliverables)
- Model drift if reinforcement signals are low quality
- Storage cost of historical outcome datasets

**Scope (skeleton):**
- `OutcomeTag` and `FeedbackSignal` types
- `recordOutcome(dealId, outcome)` function signature
- Learning summary dashboard component stub
- Prompt improvement queue schema

---

## V10–V12: Business Domination Layers

### V10 — Revenue Operator

| Field | Value |
|---|---|
| **Purpose** | Automate the full revenue cycle from lead to invoice |
| **Main Capability** | Pricing models, upsell triggers, invoice generation, payment tracking |
| **Layer** | delivery |
| **Sits On** | V6 Deploy Connectors + V9 Learning Engine |
| **Affected Modules** | `/revenue`, `/deals`, `/clients` |
| **Flag** | `V10_REVENUE_OPERATOR` |

**Risks:**
- Regulatory compliance for invoicing and payment processing varies by region
- Upsell logic must not feel predatory or spammy to clients
- Payment provider API stability

**Scope (skeleton):**
- `RevenueModel`, `Invoice`, `UpsellTrigger` type definitions
- `generateInvoice(dealId)` function signature
- Revenue dashboard component stub
- Pricing rule engine interface

---

### V11 — Operations Operator

| Field | Value |
|---|---|
| **Purpose** | Automate internal operations: SOPs, task delegation, QA pipelines |
| **Main Capability** | SOP library, automated QA checklists, task assignment engine |
| **Layer** | production |
| **Sits On** | V7 Autonomous Production + V8 Team OS |
| **Affected Modules** | `/operations`, `/execution`, `/team` |
| **Flag** | `V11_OPERATIONS_OPERATOR` |

**Risks:**
- SOP rigidity vs. real-world variability of client requests
- Task assignment fairness in team environments
- QA false positives blocking valid deliverables

**Scope (skeleton):**
- `SOP`, `QAChecklist`, `TaskAssignment` type definitions
- `runQAPipeline(deliverableId)` function signature
- Operations dashboard component stub
- SOP template schema

---

### V12 — Executive Operator

| Field | Value |
|---|---|
| **Purpose** | Give founders and executives a high-level strategic command layer |
| **Main Capability** | KPI summaries, strategic recommendations, board-level reporting |
| **Layer** | intelligence |
| **Sits On** | V10 Revenue Operator + V11 Operations Operator |
| **Affected Modules** | `/executive`, `/analytics`, `/dashboard` |
| **Flag** | `V12_EXECUTIVE_OPERATOR` |

**Risks:**
- Strategic recommendations require high-quality underlying data
- Risk of oversimplification in AI-generated board reports
- Confidentiality of executive-layer data

**Scope (skeleton):**
- `KPISummary`, `StrategicRecommendation` type definitions
- `generateExecutiveBrief(period)` function signature
- Executive dashboard layout component stub
- Board report export schema

---

## V13–V15: Industry Packs

### V13 — Industry Packs

| Field | Value |
|---|---|
| **Purpose** | Package Koschei capabilities into pre-configured bundles for specific industries |
| **Main Capability** | Industry-specific prompt libraries, intake flows, and deliverable templates |
| **Layer** | planning |
| **Sits On** | V1–V12 full platform |
| **Affected Modules** | `/industry`, `/intake`, `/production` |
| **Flag** | `V13_INDUSTRY_PACKS` |

**Risks:**
- Scope creep into regulated industries (see safe-sectors.md)
- Template quality varies significantly across sectors
- Maintenance burden as industries evolve

**Scope (skeleton):**
- `IndustryPack`, `PackTemplate` type definitions
- Pack registry and loader stub
- Industry selector UI component shell
- Safe sector validation gate

---

### V14 — Sector Knowledge

| Field | Value |
|---|---|
| **Purpose** | Embed deep sector-specific knowledge into the AI reasoning layer |
| **Main Capability** | Sector knowledge bases, terminology dictionaries, context injectors |
| **Layer** | intelligence |
| **Sits On** | V13 Industry Packs |
| **Affected Modules** | `/industry`, `/intelligence`, `/production` |
| **Flag** | `V14_SECTOR_KNOWLEDGE` |

**Risks:**
- Knowledge base staleness as industries evolve
- Knowledge hallucination risk if context injection is poorly scoped
- Data sourcing and copyright for sector knowledge content

**Scope (skeleton):**
- `SectorKnowledgeBase`, `TermDictionary` type definitions
- `injectSectorContext(sectorId, prompt)` function signature
- Knowledge management admin UI stub
- Knowledge freshness audit schema

---

### V15 — Sector Workflows

| Field | Value |
|---|---|
| **Purpose** | Build end-to-end automated workflows tailored to each sector |
| **Main Capability** | Sector-specific deal pipelines, automation sequences, delivery flows |
| **Layer** | production |
| **Sits On** | V13 Industry Packs + V14 Sector Knowledge + V7 Autonomous Production |
| **Affected Modules** | `/industry`, `/autonomy`, `/production` |
| **Flag** | `V15_SECTOR_WORKFLOWS` |

**Risks:**
- Workflow rigidity failing edge-case clients
- Cross-sector workflow conflicts if a client spans multiple industries
- Debug complexity of deep automation sequences

**Scope (skeleton):**
- `SectorWorkflow`, `WorkflowStep` type definitions
- `executeSectorWorkflow(sectorId, dealId)` function signature
- Workflow builder UI component stub
- Workflow audit log schema

---

## V16–V18: Autonomous Business Units

### V16 — Autonomous Units

| Field | Value |
|---|---|
| **Purpose** | Spin up self-contained AI business units that operate independently |
| **Main Capability** | Autonomous unit configuration, resource allocation, isolated execution |
| **Layer** | production |
| **Sits On** | V7 Autonomous Production + V15 Sector Workflows |
| **Affected Modules** | `/units`, `/execution`, `/production` |
| **Flag** | `V16_AUTONOMOUS_UNITS` |

**Risks:**
- Resource isolation between units
- Runaway units without proper kill switches
- Billing attribution per unit

**Scope (skeleton):**
- `BusinessUnit`, `UnitConfig`, `UnitResource` type definitions
- `spawnUnit(config)` and `terminateUnit(unitId)` signatures
- Unit management dashboard component stub
- Unit isolation boundary schema

---

### V17 — Multi-Unit Routing

| Field | Value |
|---|---|
| **Purpose** | Intelligently route work and clients across multiple autonomous units |
| **Main Capability** | Load balancing, specialization routing, unit selection algorithms |
| **Layer** | delivery |
| **Sits On** | V16 Autonomous Units |
| **Affected Modules** | `/units/routing`, `/units`, `/deals` |
| **Flag** | `V17_MULTI_UNIT_ROUTING` |

**Risks:**
- Routing decisions opaque to operators
- Misrouting causing client experience degradation
- Routing loop risk without proper state tracking

**Scope (skeleton):**
- `RoutingRule`, `UnitSelector` type definitions
- `routeDeal(dealId, availableUnits)` function signature
- Routing map visualisation component stub
- Routing decision audit log schema

---

### V18 — Unit Analytics

| Field | Value |
|---|---|
| **Purpose** | Provide deep analytics per autonomous unit for performance optimization |
| **Main Capability** | Per-unit KPIs, comparative unit benchmarking, resource utilization dashboards |
| **Layer** | intelligence |
| **Sits On** | V16 Autonomous Units + V17 Multi-Unit Routing |
| **Affected Modules** | `/analytics`, `/units`, `/dashboard` |
| **Flag** | `V18_UNIT_ANALYTICS` |

**Risks:**
- Data volume from many concurrent units
- Misleading comparisons between units with different specializations
- Privacy of unit-level client data in analytics

**Scope (skeleton):**
- `UnitPerformanceMetric`, `UnitBenchmark` type definitions
- `fetchUnitAnalytics(unitId, period)` function signature
- Per-unit analytics dashboard component stub
- Comparative benchmark chart component stub

---

## V19–V20: Cross-Company Intelligence

### V19 — Cross-Company Intelligence

| Field | Value |
|---|---|
| **Purpose** | Aggregate anonymized signals across multiple Koschei deployments |
| **Main Capability** | Industry trend detection, cross-company pattern recognition, early warnings |
| **Layer** | intelligence |
| **Sits On** | V9 Learning Engine + V18 Unit Analytics |
| **Affected Modules** | `/intelligence`, `/units/analytics`, `/network-intelligence/benchmarks` |
| **Flag** | `V19_CROSS_COMPANY_INTELLIGENCE` |

**Risks:**
- Data privacy and anonymization requirements are extremely strict
- Competitive sensitivity of aggregated business data
- Consent and opt-in framework required before any data sharing
- Regulatory exposure under GDPR, CCPA if mishandled

**Scope (skeleton):**
- `AnonymizedSignal`, `IntelligenceFeed` type definitions
- `submitAnonymizedSignal(signal)` function signature
- Consent management UI component stub
- Signal aggregation pipeline schema (anonymization-first design)

---

### V20 — Benchmark Engine

| Field | Value |
|---|---|
| **Purpose** | Give operators actionable benchmarks vs. industry peers |
| **Main Capability** | Percentile rankings, performance gap analysis, improvement recommendations |
| **Layer** | intelligence |
| **Sits On** | V19 Cross-Company Intelligence |
| **Affected Modules** | `/network-intelligence/benchmarks`, `/units/analytics`, `/executive` |
| **Flag** | `V20_BENCHMARK_ENGINE` |

**Risks:**
- Benchmark data quality depends entirely on V19 signal volume
- Misleading benchmarks from small sample sizes
- Competitive sensitivity of published benchmark data

**Scope (skeleton):**
- `BenchmarkResult`, `PercentileRanking`, `GapAnalysis` type definitions
- `runBenchmark(companyId, metric)` function signature
- Benchmark report component stub
- Benchmark confidence interval display logic stub

---

## Summary Table

| Version | Name | Layer | Group | Flag |
|---|---|---|---|---|
| V4 | Production Engine | production | Prod & Ops | `V4_PRODUCTION_ENGINE` |
| V5 | Operational Intelligence | intelligence | Prod & Ops | `V5_OPERATIONAL_INTELLIGENCE` |
| V6 | Deploy Connectors | delivery | Prod & Ops | `V6_DEPLOY_CONNECTORS` |
| V7 | Autonomous Production | production | Autonomy | `V7_AUTONOMOUS_PRODUCTION` |
| V8 | Team / Company OS | intake | Autonomy | `V8_TEAM_WORKSPACE` |
| V9 | Learning Engine | intelligence | Autonomy | `V9_LEARNING_ENGINE` |
| V10 | Revenue Operator | delivery | Biz Domination | `V10_REVENUE_OPERATOR` |
| V11 | Operations Operator | production | Biz Domination | `V11_OPERATIONS_OPERATOR` |
| V12 | Executive Operator | intelligence | Biz Domination | `V12_EXECUTIVE_OPERATOR` |
| V13 | Industry Packs | planning | Industry | `V13_INDUSTRY_PACKS` |
| V14 | Sector Knowledge | intelligence | Industry | `V14_SECTOR_KNOWLEDGE` |
| V15 | Sector Workflows | production | Industry | `V15_SECTOR_WORKFLOWS` |
| V16 | Autonomous Units | production | Auto Units | `V16_AUTONOMOUS_UNITS` |
| V17 | Multi-Unit Routing | delivery | Auto Units | `V17_MULTI_UNIT_ROUTING` |
| V18 | Unit Analytics | intelligence | Auto Units | `V18_UNIT_ANALYTICS` |
| V19 | Cross-Company Intelligence | intelligence | Cross-Co | `V19_CROSS_COMPANY_INTELLIGENCE` |
| V20 | Benchmark Engine | intelligence | Cross-Co | `V20_BENCHMARK_ENGINE` |
