# Module Map: V1–V20

> Shows how all modules relate to each other, which layer they occupy, and their dependency chains.

---

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     INTEGRATION LAYER                           │
│  dify · trigger.dev · mem0 · deer-flow · ruview · worldmonitor  │
│                  superpowers · convex-ai-foundation             │
├─────────────────────────────────────────────────────────────────┤
│                        INTELLIGENCE                             │
│    V5 · V9 · V12 · V14 · V18 · V19 · V20                       │
├─────────────────────────────────────────────────────────────────┤
│                         DELIVERY                                │
│              V6 · V10 · V17                                     │
├─────────────────────────────────────────────────────────────────┤
│                        PRODUCTION                               │
│         V4 · V7 · V11 · V15 · V16                              │
├─────────────────────────────────────────────────────────────────┤
│                         PLANNING                                │
│                    V2 · V3 · V13                                │
├─────────────────────────────────────────────────────────────────┤
│                          INTAKE                                 │
│                       V1 · V8                                   │
└─────────────────────────────────────────────────────────────────┘
```

> See [`docs/integrations.md`](./integrations.md) for the full integration layer specification.

---

## Module Index

| ID | Version | Name | Layer | Status | Flag |
|---|---|---|---|---|---|
| `intake-v1` | v1 | Lead Intake | intake | active | — |
| `planning-v2` | v2 | Proposal Engine | planning | active | — |
| `planning-v3` | v3 | Deal Structuring | planning | active | — |
| `production-v4` | v4 | Production Engine | production | scaffolded | `V4_PRODUCTION_ENGINE` |
| `intelligence-v5` | v5 | Operational Intelligence | intelligence | scaffolded | `V5_OPERATIONAL_INTELLIGENCE` |
| `delivery-v6` | v6 | Deploy Connectors | delivery | scaffolded | `V6_DEPLOY_CONNECTORS` |
| `production-v7` | v7 | Autonomous Production | production | scaffolded | `V7_AUTONOMOUS_PRODUCTION` |
| `intake-v8` | v8 | Team / Company OS | intake | scaffolded | `V8_TEAM_WORKSPACE` |
| `intelligence-v9` | v9 | Learning Engine | intelligence | scaffolded | `V9_LEARNING_ENGINE` |
| `delivery-v10` | v10 | Revenue Operator | delivery | scaffolded | `V10_REVENUE_OPERATOR` |
| `production-v11` | v11 | Operations Operator | production | scaffolded | `V11_OPERATIONS_OPERATOR` |
| `intelligence-v12` | v12 | Executive Operator | intelligence | scaffolded | `V12_EXECUTIVE_OPERATOR` |
| `planning-v13` | v13 | Industry Packs | planning | scaffolded | `V13_INDUSTRY_PACKS` |
| `intelligence-v14` | v14 | Sector Knowledge | intelligence | scaffolded | `V14_SECTOR_KNOWLEDGE` |
| `production-v15` | v15 | Sector Workflows | production | scaffolded | `V15_SECTOR_WORKFLOWS` |
| `production-v16` | v16 | Autonomous Units | production | scaffolded | `V16_AUTONOMOUS_UNITS` |
| `delivery-v17` | v17 | Multi-Unit Routing | delivery | scaffolded | `V17_MULTI_UNIT_ROUTING` |
| `intelligence-v18` | v18 | Unit Analytics | intelligence | scaffolded | `V18_UNIT_ANALYTICS` |
| `intelligence-v19` | v19 | Cross-Company Intelligence | intelligence | scaffolded | `V19_CROSS_COMPANY_INTELLIGENCE` |
| `intelligence-v20` | v20 | Benchmark Engine | intelligence | scaffolded | `V20_BENCHMARK_ENGINE` |

---

## Dependency Chains

### Full Dependency Graph

```
V1 (Lead Intake)
  └─→ V2 (Proposal Engine)
        └─→ V3 (Deal Structuring)
              ├─→ V4 (Production Engine)
              │     ├─→ V5 (Operational Intelligence)
              │     ├─→ V6 (Deploy Connectors)
              │     │     └─→ V10 (Revenue Operator)
              │     └─→ V7 (Autonomous Production)
              │           ├─→ V8 (Team / Company OS)
              │           │     └─→ V11 (Operations Operator)
              │           ├─→ V9 (Learning Engine)
              │           └─→ V15 (Sector Workflows)
              │                 └─→ V16 (Autonomous Units)
              │                       ├─→ V17 (Multi-Unit Routing)
              │                       └─→ V18 (Unit Analytics)
              └─→ V13 (Industry Packs)
                    ├─→ V14 (Sector Knowledge)
                    └─→ V15 (Sector Workflows) [shared node]

V10 + V11
  └─→ V12 (Executive Operator)

V9 + V18
  └─→ V19 (Cross-Company Intelligence)
        └─→ V20 (Benchmark Engine)
```

### Minimum Unlock Chains

To activate any version, all upstream dependencies must be active:

| Version | Minimum Prerequisites |
|---|---|
| V4 | V1, V2, V3 |
| V5 | V4 |
| V6 | V4, V5 |
| V7 | V4, V6 |
| V8 | V1–V7 |
| V9 | V1–V8 |
| V10 | V6, V9 |
| V11 | V7, V8 |
| V12 | V10, V11 |
| V13 | V1–V12 |
| V14 | V13 |
| V15 | V13, V14, V7 |
| V16 | V7, V15 |
| V17 | V16 |
| V18 | V16, V17 |
| V19 | V9, V18 |
| V20 | V19 |

---

## Layer-by-Layer Module List

### Intake Layer
Handles all client-facing inputs, lead capture, and team membership.

| Module | Version | Status |
|---|---|---|
| Lead Intake | V1 | active |
| Team / Company OS | V8 | scaffolded |

### Planning Layer
Handles proposal generation, deal structuring, and industry pack configuration.

| Module | Version | Status |
|---|---|---|
| Proposal Engine | V2 | active |
| Deal Structuring | V3 | active |
| Industry Packs | V13 | scaffolded |

### Production Layer
Handles all deliverable generation, automation, and execution engines.

| Module | Version | Status |
|---|---|---|
| Production Engine | V4 | scaffolded |
| Autonomous Production | V7 | scaffolded |
| Operations Operator | V11 | scaffolded |
| Sector Workflows | V15 | scaffolded |
| Autonomous Units | V16 | scaffolded |

### Delivery Layer
Handles external deployment, payment, routing, and handoff.

| Module | Version | Status |
|---|---|---|
| Deploy Connectors | V6 | scaffolded |
| Revenue Operator | V10 | scaffolded |
| Multi-Unit Routing | V17 | scaffolded |

### Intelligence Layer
Handles all analytics, learning, knowledge, and benchmarking.

| Module | Version | Status |
|---|---|---|
| Operational Intelligence | V5 | scaffolded |
| Learning Engine | V9 | scaffolded |
| Executive Operator | V12 | scaffolded |
| Sector Knowledge | V14 | scaffolded |
| Unit Analytics | V18 | scaffolded |
| Cross-Company Intelligence | V19 | scaffolded |
| Benchmark Engine | V20 | scaffolded |

---

## Route Prefix Map

| Module | Route Prefix |
|---|---|
| Lead Intake | `/intake` |
| Proposal Engine | `/proposals` |
| Deal Structuring | `/deals` |
| Production Engine | `/production` |
| Operational Intelligence | `/ops` |
| Deploy Connectors | `/deploy/connectors` |
| Autonomous Production | `/autonomy` |
| Team / Company OS | `/team` |
| Learning Engine | `/intelligence` |
| Revenue Operator | `/revenue` |
| Operations Operator | `/operations` |
| Executive Operator | `/executive` |
| Industry Packs | `/industry` |
| Sector Knowledge | `/industry` |
| Sector Workflows | `/industry` |
| Autonomous Units | `/units` |
| Multi-Unit Routing | `/units/routing` |
| Unit Analytics | `/units/analytics` |
| Cross-Company Intelligence | `/network-intelligence` |
| Benchmark Engine | `/network-intelligence/benchmarks` |

---

## Cross-Module Data Flows

```
Lead Intake ──→ Deals ──→ Production Engine ──→ Deploy Connectors
                  │                                      │
                  │                                      ▼
                  │                              Revenue Operator
                  │
                  ▼
          Proposal Engine ──→ Industry Packs ──→ Sector Workflows
                                     │
                                     ▼
                             Sector Knowledge

Learning Engine ←── All completed deals and outcomes
     │
     ▼
Cross-Company Intelligence ──→ Benchmark Engine
```
