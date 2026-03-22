-- ============================================================
-- Migration: V10–V12 Revenue / Operations / Executive
-- Created: 2026-03-22
-- Phase: V10 Revenue Operator · V11 Operations Operator · V12 Executive Operator
-- Approach: Additive skeleton — does NOT touch existing core tables
-- ============================================================

-- -------------------------------------------------------
-- A) revenue_workflows
-- High-level revenue process definitions per organization
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.revenue_workflows (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  title           text        NOT NULL,
  workflow_type   text        NOT NULL,
  status          text        NOT NULL DEFAULT 'draft',
  config_json     jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revenue_workflows_organization_id
  ON public.revenue_workflows(organization_id);
CREATE INDEX IF NOT EXISTS idx_revenue_workflows_status
  ON public.revenue_workflows(status);
CREATE INDEX IF NOT EXISTS idx_revenue_workflows_created_at
  ON public.revenue_workflows(created_at DESC);

CREATE TRIGGER revenue_workflows_updated_at
  BEFORE UPDATE ON public.revenue_workflows
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.revenue_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "revenue_workflows_select_authenticated"
  ON public.revenue_workflows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "revenue_workflows_insert_authenticated"
  ON public.revenue_workflows
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "revenue_workflows_update_authenticated"
  ON public.revenue_workflows
  FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- B) offer_systems
-- Offer/product definitions within a revenue workflow
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offer_systems (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_workflow_id  uuid        REFERENCES public.revenue_workflows(id) ON DELETE SET NULL,
  title                text        NOT NULL,
  offer_type           text        NOT NULL,
  content_json         jsonb,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_offer_systems_revenue_workflow_id
  ON public.offer_systems(revenue_workflow_id);
CREATE INDEX IF NOT EXISTS idx_offer_systems_created_at
  ON public.offer_systems(created_at DESC);

ALTER TABLE public.offer_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offer_systems_select_authenticated"
  ON public.offer_systems
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "offer_systems_insert_authenticated"
  ON public.offer_systems
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- C) funnel_runs
-- Execution records for revenue funnel stages
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.funnel_runs (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_workflow_id  uuid        REFERENCES public.revenue_workflows(id) ON DELETE SET NULL,
  stage                text        NOT NULL,
  metrics_json         jsonb,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funnel_runs_revenue_workflow_id
  ON public.funnel_runs(revenue_workflow_id);
CREATE INDEX IF NOT EXISTS idx_funnel_runs_created_at
  ON public.funnel_runs(created_at DESC);

ALTER TABLE public.funnel_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "funnel_runs_select_authenticated"
  ON public.funnel_runs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "funnel_runs_insert_authenticated"
  ON public.funnel_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- D) sop_documents
-- Standard Operating Procedure documents per organization
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sop_documents (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  title           text        NOT NULL,
  category        text        NOT NULL,
  content_json    jsonb,
  version         integer     NOT NULL DEFAULT 1,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sop_documents_organization_id
  ON public.sop_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_sop_documents_category
  ON public.sop_documents(category);
CREATE INDEX IF NOT EXISTS idx_sop_documents_created_at
  ON public.sop_documents(created_at DESC);

CREATE TRIGGER sop_documents_updated_at
  BEFORE UPDATE ON public.sop_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.sop_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sop_documents_select_authenticated"
  ON public.sop_documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "sop_documents_insert_authenticated"
  ON public.sop_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "sop_documents_update_authenticated"
  ON public.sop_documents
  FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- E) internal_tool_specs
-- Specification records for internal tools per organization
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.internal_tool_specs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  title           text        NOT NULL,
  category        text        NOT NULL,
  spec_json       jsonb,
  status          text        NOT NULL DEFAULT 'draft',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internal_tool_specs_organization_id
  ON public.internal_tool_specs(organization_id);
CREATE INDEX IF NOT EXISTS idx_internal_tool_specs_status
  ON public.internal_tool_specs(status);
CREATE INDEX IF NOT EXISTS idx_internal_tool_specs_created_at
  ON public.internal_tool_specs(created_at DESC);

ALTER TABLE public.internal_tool_specs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "internal_tool_specs_select_authenticated"
  ON public.internal_tool_specs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "internal_tool_specs_insert_authenticated"
  ON public.internal_tool_specs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- F) executive_snapshots
-- Periodic executive summary snapshots per organization
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.executive_snapshots (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  snapshot_type   text        NOT NULL,
  summary         text,
  metrics_json    jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_executive_snapshots_organization_id
  ON public.executive_snapshots(organization_id);
CREATE INDEX IF NOT EXISTS idx_executive_snapshots_snapshot_type
  ON public.executive_snapshots(snapshot_type);
CREATE INDEX IF NOT EXISTS idx_executive_snapshots_created_at
  ON public.executive_snapshots(created_at DESC);

ALTER TABLE public.executive_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "executive_snapshots_select_authenticated"
  ON public.executive_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "executive_snapshots_insert_authenticated"
  ON public.executive_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- G) decision_briefs
-- Decision support briefs derived from executive snapshots
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decision_briefs (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  executive_snapshot_id   uuid        REFERENCES public.executive_snapshots(id) ON DELETE SET NULL,
  title                   text        NOT NULL,
  recommendation          text,
  rationale_json          jsonb,
  status                  text        NOT NULL DEFAULT 'open',
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_decision_briefs_executive_snapshot_id
  ON public.decision_briefs(executive_snapshot_id);
CREATE INDEX IF NOT EXISTS idx_decision_briefs_status
  ON public.decision_briefs(status);
CREATE INDEX IF NOT EXISTS idx_decision_briefs_created_at
  ON public.decision_briefs(created_at DESC);

ALTER TABLE public.decision_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decision_briefs_select_authenticated"
  ON public.decision_briefs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "decision_briefs_insert_authenticated"
  ON public.decision_briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
