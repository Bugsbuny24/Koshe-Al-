-- ============================================================
-- Migration: V16–V18 Business Units
-- Created: 2026-03-22
-- Phase: V16 Autonomous Units · V17 Multi-Unit Routing · V18 Unit Analytics
-- Approach: Additive skeleton — does NOT touch existing core tables
-- ============================================================

-- -------------------------------------------------------
-- A) business_units
-- Autonomous business unit definitions per organization
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_units (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  unit_type       text        NOT NULL,
  name            text        NOT NULL,
  status          text        NOT NULL DEFAULT 'planned',
  config_json     jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_units_organization_id
  ON public.business_units(organization_id);
CREATE INDEX IF NOT EXISTS idx_business_units_status
  ON public.business_units(status);
CREATE INDEX IF NOT EXISTS idx_business_units_created_at
  ON public.business_units(created_at DESC);

ALTER TABLE public.business_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_units_select_authenticated"
  ON public.business_units
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "business_units_insert_authenticated"
  ON public.business_units
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "business_units_update_authenticated"
  ON public.business_units
  FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- B) unit_runs
-- Execution records for individual business unit runs
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.unit_runs (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid        NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  title            text        NOT NULL,
  status           text        NOT NULL DEFAULT 'draft',
  payload_json     jsonb,
  started_at       timestamptz,
  completed_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unit_runs_business_unit_id
  ON public.unit_runs(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unit_runs_status
  ON public.unit_runs(status);
CREATE INDEX IF NOT EXISTS idx_unit_runs_created_at
  ON public.unit_runs(created_at DESC);

ALTER TABLE public.unit_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "unit_runs_select_authenticated"
  ON public.unit_runs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "unit_runs_insert_authenticated"
  ON public.unit_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- C) unit_metrics
-- Metric data points tracked per business unit
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.unit_metrics (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id uuid        NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
  metric_name      text        NOT NULL,
  metric_value     numeric,
  metric_json      jsonb,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_unit_metrics_business_unit_id
  ON public.unit_metrics(business_unit_id);
CREATE INDEX IF NOT EXISTS idx_unit_metrics_metric_name
  ON public.unit_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_unit_metrics_created_at
  ON public.unit_metrics(created_at DESC);

ALTER TABLE public.unit_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "unit_metrics_select_authenticated"
  ON public.unit_metrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "unit_metrics_insert_authenticated"
  ON public.unit_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
