# Koschei Domain Boundaries

This document defines the domain boundaries across the Koschei codebase.
Its purpose: ensure active core modules are clearly separated from future scaffold
layers so no contributor mistakes a scaffolded module for live product.

---

## A — Active Core

These domains are live and power V1–V3 product flows.
All logic, routes, components, and lib helpers in these domains are actively used.

| Domain | Route prefix | lib/ | components/ |
|---|---|---|---|
| **chat** | `/chat` | `lib/chat/` | `components/chat/` |
| **execution** | `/execution` | `lib/execution/` | `components/execution/` _(planned)_ |
| **workspace** | `/deals`, `/projects` | `lib/deals/`, `lib/projects/` | `components/deals/`, `components/projects/` |
| **builder** | `/builder` | — | `components/builder/` _(planned)_ |
| **mentor** | `/mentor` | — | — |

> `lib/deals/` and `components/deals/` retain the internal `deals` name to avoid
> breaking the active V1–V3 DB schema and API routes. User-facing copy already
> shows **Workspace / Jobs**.

---

## B — Future Scaffold

These domains are scaffolded for V4–V20.
Pages render a `PlannedModulePage` placeholder. **No active logic runs.**
Feature flags for all of these are disabled (`enabled: false`).

| Domain | Version | Route prefix | lib/ | components/ |
|---|---|---|---|---|
| **production** | V4 | `/production` | `lib/production/` | `components/production/` |
| **ops** | V5 | `/ops` | `lib/ops/` | `components/ops/` |
| **deploy** | V6 | `/deploy` | `lib/deploy/` | `components/deploy/` |
| **autonomy** | V7 | `/autonomy` | `lib/autonomy/` | `components/autonomy/` |
| **intelligence** | V5 | `/intelligence` | `lib/intelligence/` | `components/intelligence/` |
| **revenue** | V10 | `/revenue` | `lib/revenue/` | `components/revenue/` |
| **operations** | V11 | `/operations` | `lib/operations/` | `components/operations/` |
| **executive** | V12 | `/executive` | `lib/executive/` | `components/executive/` |
| **industry** | V13–V15 | `/industry` | `lib/industry/` | `components/industry/` |
| **units** | V16–V18 | `/units` | `lib/units/` | `components/units/` _(planned)_ |
| **network-intelligence** | V19–V20 | `/network-intelligence` | `lib/network-intelligence/` | `components/network-intelligence/` |

> All scaffold lib helpers contain only type definitions and static data constants.
> They have zero runtime side-effects and are safe to import from future modules.

---

## C — Shared

These cross-cutting layers are consumed by both active core and future scaffold domains.

| Layer | Purpose | Location |
|---|---|---|
| **common** | Shared AI utilities (Gemini HTTP client, prompts, full Gemini SDK client with quota) | `lib/common/` |
| **flow** | Cross-domain navigation helpers, intent mapping, query-state utilities | `lib/flow/` |
| **features** | Feature flags and capability registry (V4–V20 scaffold index) | `lib/features/` |
| **supabase** | DB client factories (browser + server) | `lib/supabase/` |
| **utils** | Generic utility functions (`cn`, etc.) | `lib/utils.ts` |
| **layout** | App shell (Sidebar, Navbar) | `components/layout/` |
| **landing** | Marketing landing page components | `components/landing/` |
| **ui** | Primitive UI components (Button, Card, Badge, etc.) | `components/ui/` |
| **common** | Shared page templates (PlannedModulePage, SourceBadge) | `components/common/` |

---

## Dependency Rules

```
core   → shared   ✅ allowed
future → shared   ✅ allowed
future → core     ✅ allowed (read-only)
core   → future   ❌ avoid — active core must not depend on unactivated scaffold modules
```

Rationale: future scaffold modules may be toggled on/off or removed entirely.
If active core depended on them, feature-flag disabling would silently break flows.

---

## Status Vocabulary

Use these exact terms consistently in UI copy, roadmap pages, and code comments:

| Term | Meaning |
|---|---|
| **Active** | Live, running in production, feature flag enabled |
| **Scaffolded** | Directory and type definitions exist; feature flag disabled; `PlannedModulePage` shown |
| **Planned** | Not yet scaffolded; appears only on roadmap |
| **Not active yet** | Generic user-facing phrase for scaffolded/planned modules |
