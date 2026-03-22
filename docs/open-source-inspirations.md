# Open Source Inspirations — Technical Mapping

This document maps how each open-source project has influenced specific modules and design decisions within Koschei.

---

## trigger.dev → Background Jobs (`/jobs`) + Pipeline

**What it does:** Trigger.dev is an open-source platform for reliable, durable background jobs and event-driven workflows. Jobs survive server restarts, support retries, and have a rich status/log UI.

**How it influenced Koschei:**
- `/jobs` — The background job queue, status polling, retry logic, and per-task log view are modelled after Trigger.dev's job dashboard
- `/pipeline` — Pipeline run persistence (saving run state, node-level logs) mirrors Trigger.dev's run tracking model
- Planned V7 (Autonomous Production): retry policies, approval gates, and guarded execution are directly inspired by Trigger.dev's `concurrencyLimit`, `maxAttempts`, and `onSuccess/onFailure` callbacks

**Integration path (future):**
```ts
// Could be wired via @trigger.dev/sdk
import { task } from "@trigger.dev/sdk/v3";

export const executionPlanTask = task({
  id: "koschei-execution-plan",
  run: async (payload: { brief: string }) => {
    // call Koschei execution pipeline steps
  },
});
```

---

## Dify → Pipeline Browser (`/pipeline`)

**What it does:** Dify is an LLM app development platform with a visual workflow editor, template gallery, and multi-node pipeline execution engine.

**How it influenced Koschei:**
- `/pipeline` — The template gallery card layout, "Run" modal with custom input, and node-by-node execution logs are directly inspired by Dify's workflow template browser
- Node status colors (`completed/running/failed/pending`) follow Dify's visual conventions
- The concept of "pipeline templates" as first-class entities with descriptions and node counts mirrors Dify's template catalog

**Integration path (future):**
- Koschei pipelines can be exported as Dify-compatible workflow DSL (YAML)
- Dify's API can serve as an external execution backend for Koschei pipelines

---

## mem0 → Chat Memory + Execution Context

**What it does:** mem0 provides a memory layer for AI applications — storing user preferences, past interactions, and context that persists across sessions.

**How it influenced Koschei:**
- `/chat` — The conversation history persistence and context carry-over between sessions are inspired by mem0's memory store pattern
- Execution runs storing the "seed" context (user brief, preferences, previous runs) mirror mem0's per-user memory graph
- Planned V9 (Learning Engine): insights and recommendations from past work will be powered by a mem0-style memory retrieval layer

**Integration path (future):**
```ts
// Future: mem0 SDK integration
import MemoryClient from "mem0ai";
const memory = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });

// Store execution context
await memory.add([{ role: "user", content: brief }], { userId });
// Retrieve relevant past context
const history = await memory.search(brief, { userId });
```

---

## Deer-Flow (ByteDance) → Deep Research Pipeline Template

**What it does:** Deer-Flow is ByteDance's multi-agent deep research framework — a planner agent decomposes a research question into sub-tasks, researcher agents gather and synthesize information, and a writer agent produces the final report.

**How it influenced Koschei:**
- The **Deep Research** pipeline template in `/pipeline` (Planner → Researcher → Synthesiser → Report Writer) is directly modelled on Deer-Flow's agent graph
- The concept of "research task decomposition" as a structured, multi-step pipeline is adapted from Deer-Flow
- Planned V5 (Operational Intelligence): bottleneck and opportunity research workflows will use a Deer-Flow-style research loop

---

## open-swe (LangChain AI) → Execution Core + Software Engineering Agent Template

**What it does:** open-swe is an open-source software engineering agent that autonomously decomposes engineering tasks, writes code, runs tests, and iterates.

**How it influenced Koschei:**
- `/execution` — The requirement extraction → architecture planning → task breakdown → checklist flow mirrors open-swe's task decomposition loop
- The **Software Engineering Agent** pipeline template is inspired by open-swe's agent loop: `plan → implement → test → review → iterate`
- Planned V7 (Autonomous Production): the autonomous run flow with approval gates is architecturally similar to open-swe's human-in-the-loop checkpoints

---

## RuView (ruvnet) → Builder Code Review

**What it does:** RuView is an AI-powered code review tool that analyzes diffs, categorizes issues by severity, and generates improvement suggestions.

**How it influenced Koschei:**
- `/builder` — The code analysis and review section is inspired by RuView's structured output: severity levels, issue categories, and actionable suggestions
- The pattern of passing code through an LLM that returns structured JSON (issues array with `severity`, `line`, `description`, `suggestion`) is adapted from RuView's output schema

---

## build-your-own-x (CodeCrafters) → Courses Module

**What it does:** build-your-own-x is a curated collection of tutorials for building your own versions of technologies from scratch — git, Docker, Redis, etc.

**How it influenced Koschei:**
- `/courses` — The project-based learning approach (learn by building a real thing) is directly inspired by build-your-own-x's philosophy
- Course tracks are structured as "Build your own X" challenges with step-by-step milestones, consistent with build-your-own-x's format
- The emphasis on hands-on, output-driven learning over passive consumption mirrors this project's core insight

---

## WorldMonitor (koala73) → Ops Health Dashboard

**What it does:** WorldMonitor is a real-time monitoring tool for tracking system and workflow health.

**How it influenced Koschei:**
- `/operations` and the Ops Health card in the dashboard are inspired by WorldMonitor's approach to real-time health indicators
- The planned V5 (Operational Intelligence) monitoring layer — tracking workflow health, open issues, and bottleneck visibility — references WorldMonitor's health signal patterns

---

## superpowers (obra) → Developer Tooling Philosophy

**What it does:** superpowers is a project by obra focused on extending developer capabilities through composable tooling and power-user patterns.

**How it influenced Koschei:**
- The Koschei builder/developer tooling philosophy — giving developers composable, powerful primitives rather than locked-down templates — is informed by superpowers' extensibility-first approach
- The Mentor module's concept of "power-user guidance" over basic tutorials echoes the superpowers ethos

---

## starter-nextjs-convex-ai (AppyDave) → Architecture & Scaffolding

**What it does:** A production-ready Next.js + Convex + AI starter template with auth, real-time data, and AI integration patterns.

**How it influenced Koschei:**
- Koschei's Next.js App Router structure, auth patterns (`/app/(auth)/`, `/app/(app)/`), and middleware conventions follow patterns established by this starter template
- The pattern of separating `(auth)` and `(app)` route groups matches this template's layout approach
- The combination of Supabase (Koschei) / Convex (template) as the real-time backend follows similar principles for AI-first data management

---

## Integration Priority Matrix

| Project | Current Status | Future Integration |
|---|---|---|
| trigger.dev | Inspired `/jobs` UI | `@trigger.dev/sdk` for durable background tasks |
| Dify | Inspired `/pipeline` | Export pipelines as Dify workflow DSL |
| mem0 | Inspired chat memory | `mem0ai` SDK for persistent AI memory |
| Deer-Flow | Deep research template | Multi-agent research pipeline |
| open-swe | Inspired execution flow | Autonomous engineering agent |
| RuView | Inspired builder review | Structured code analysis output |
| build-your-own-x | Inspired courses | Project-based learning tracks |
| WorldMonitor | Inspired ops health | Real-time health signals |
| superpowers | Inspired tooling philosophy | Extensible developer primitives |
| starter-nextjs-convex-ai | Inspired architecture | Convex real-time layer (optional) |
