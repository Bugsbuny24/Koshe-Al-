# Koschei — Final Flow QA Checklist

This document defines the end-to-end test scenarios for the Koschei V1 → V3 sprint.
Each scenario must pass before the sprint is considered **done**.

---

## A) Chat → Execution

**Precondition:** User is on `/chat` (no login required for chat).

1. Send a short greeting: `kanka nbr`
   - **Expected:** Warm, conversational response (not a classifier panel output).
   - **Expected:** No "confidence: low" or internal labels visible.
2. Send an intent-clear message: `otelim için rezervasyon alacak bir whatsapp botu istiyorum`
   - **Expected:** Natural assistant reply summarising the goal.
   - **Expected:** Recommendation card with "Planlamayı Başlat" CTA.
   - **Expected:** CTA href points to `/execution/new?brief=...&source=chat`.
3. Click the CTA.
   - **Expected:** `/execution/new` opens with `brief` pre-filled.
   - **Expected:** Source badge shows "Chat'ten yönlendirildi".

---

## B) Chat → Builder

1. Send: `python ile csv analiz scripti yaz`
   - **Expected:** Assistant routes to `builder` flow.
   - **Expected:** CTA href points to `/builder?prompt=...&source=chat`.
2. Click CTA.
   - **Expected:** `/builder` opens with the prompt pre-filled.

---

## C) Chat → Mentor

1. Send: `react hooks nasıl çalışır, anlat`
   - **Expected:** Assistant routes to `mentor` flow.
   - **Expected:** CTA href points to `/mentor?topic=...&source=chat`.
2. Click CTA.
   - **Expected:** `/mentor` opens with the topic pre-filled.

---

## D) Execution → Deal

**Precondition:** User is logged in, has completed execution steps 1–5.

1. At Step 5 (Delivery Checklist), click **"Deal İçin Kullan"**.
   - **Expected:** `/deals/new?...&source=execution` opens.
   - **Expected:** Form is pre-filled with execution data (title, description, milestones).
   - **Expected:** Source badge shows "Execution'dan yüklendi".
2. Submit the deal form.
   - **Expected:** Deal is created successfully (`201`).
   - **Expected:** `execution_runs.deal_id` is updated.
   - **Expected:** `execution_runs.status = linked_to_deal`.

---

## E) Execution → Project

**Precondition:** User is logged in, has completed execution steps 1–5.

1. At Step 5, click **"Project İçin Kullan"**.
   - **Expected:** `/projects/new?executionRunId=...&source=execution` opens.
   - **Expected:** Form is pre-filled with title, description, tech_stack.
   - **Expected:** Source badge shows "Execution'dan yüklendi".
2. Submit the project form.
   - **Expected:** Project is created successfully (no "Kimlik doğrulaması gerekli" error).
   - **Expected:** `execution_runs.project_id` is populated with the new project's ID.
   - **Expected:** `execution_runs.status = linked_to_project`.
3. Navigate to `/projects/[id]`.
   - **Expected:** New project is visible.

---

## F) Deal Revision → Execution Feedback

**Precondition:** A deal exists that has a linked execution run (`execution_runs.deal_id = deal.id`).

1. Navigate to the deal's revisions panel.
2. Submit a revision request with raw feedback text.
   - **Expected:** `deal_revisions` row is created.
   - **Expected:** `execution_runs.revision_notes_json` is updated with the new note appended.
   - **Expected:** Existing notes are NOT overwritten.
3. Submit a second revision.
   - **Expected:** `revision_notes_json` now contains two entries.

---

## G) Landing CTA Routes

1. Click **"Koschei ile Başla"** (primary CTA).
   - **Expected:** Navigates to `/chat`.
2. Click **"Nasıl Çalıştığını Gör"** (secondary CTA).
   - **Expected:** Smooth-scrolls to `#how-it-works` section.
3. Click **"Ücretsiz Başla"** in the Navbar.
   - **Expected:** Navigates to `/register`.
4. Click **"Giriş Yap"** in the Navbar.
   - **Expected:** Navigates to `/login`.

---

## H) Logged-in Project Create

**Precondition:** User is authenticated.

1. Navigate to `/projects/new`.
2. Fill in the title field and submit.
   - **Expected:** No `401 Kimlik doğrulaması gerekli` error.
   - **Expected:** Project is created, user is redirected to `/projects/[id]`.

---

## I) Mobile Chat Usability

1. Open `/chat` on a mobile viewport (< 640 px).
   - **Expected:** Hero area is visible without excessive black gap above it.
   - **Expected:** Chat input is visible and tappable.
   - **Expected:** Bubbles do not overflow horizontally.
   - **Expected:** Quick-start buttons are readable without horizontal scroll.
2. Send a message on mobile.
   - **Expected:** Typing indicator appears.
   - **Expected:** Response bubble appears naturally.
   - **Expected:** Page scrolls to bottom after response.

---

## J) Workspace Terminology Consistency

1. Open `/projects` — verify page title reads "Projeler" or equivalent, not "freelancer workspace".
2. Open `/deals` — verify no primary copy uses "buyer/seller" in user-facing headings.
3. Open landing page — verify "Escrow" does not appear in hero, tagline, or primary feature cards.
4. Open any execution step — verify no raw intent labels ("landing_page", "technical_web_project") are visible.

---

## Acceptance Criteria Summary

| # | Scenario | Status |
|---|----------|--------|
| A | Chat → Execution | ☐ |
| B | Chat → Builder | ☐ |
| C | Chat → Mentor | ☐ |
| D | Execution → Deal | ☐ |
| E | Execution → Project | ☐ |
| F | Deal Revision → Execution Feedback | ☐ |
| G | Landing CTA Routes | ☐ |
| H | Logged-in Project Create | ☐ |
| I | Mobile Chat Usability | ☐ |
| J | Workspace Terminology Consistency | ☐ |
