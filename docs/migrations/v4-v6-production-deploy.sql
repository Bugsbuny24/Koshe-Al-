-- ============================================================
-- Migration: V4–V6 Production & Deploy Foundation
-- Created: 2026-03-22
-- Phase: V4 Production Engine · V5 Operational Intelligence · V6 Deploy Connectors
-- Approach: Additive skeleton — does NOT touch existing core tables
-- ============================================================

-- -------------------------------------------------------
-- A) production_runs
-- Central record for a structured AI production job
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.production_runs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_run_id  uuid        REFERENCES public.execution_runs(id) ON DELETE SET NULL,
  project_id        uuid        REFERENCES public.projects(id) ON DELETE SET NULL,
  deal_id           uuid        REFERENCES public.deals(id) ON DELETE SET NULL,
  title             text        NOT NULL,
  pipeline_type     text        NOT NULL,
  status            text        NOT NULL DEFAULT 'draft',
  config_json       jsonb,
  result_summary    text,
  started_at        timestamptz,
  completed_at      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_production_runs_execution_run_id
  ON public.production_runs(execution_run_id);
CREATE INDEX IF NOT EXISTS idx_production_runs_project_id
  ON public.production_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_production_runs_deal_id
  ON public.production_runs(deal_id);
CREATE INDEX IF NOT EXISTS idx_production_runs_status
  ON public.production_runs(status);
CREATE INDEX IF NOT EXISTS idx_production_runs_created_at
  ON public.production_runs(created_at DESC);

CREATE TRIGGER production_runs_updated_at
  BEFORE UPDATE ON public.production_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.production_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "production_runs_select_authenticated"
  ON public.production_runs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "production_runs_insert_authenticated"
  ON public.production_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "production_runs_update_authenticated"
  ON public.production_runs
  FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- B) production_artifacts
-- Files and outputs attached to a production run
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.production_artifacts (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  production_run_id   uuid        NOT NULL REFERENCES public.production_runs(id) ON DELETE CASCADE,
  artifact_type       text        NOT NULL,
  title               text        NOT NULL,
  file_url            text,
  content_json        jsonb,
  version             integer     NOT NULL DEFAULT 1,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_production_artifacts_production_run_id
  ON public.production_artifacts(production_run_id);
CREATE INDEX IF NOT EXISTS idx_production_artifacts_created_at
  ON public.production_artifacts(created_at DESC);

ALTER TABLE public.production_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "production_artifacts_select_authenticated"
  ON public.production_artifacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "production_artifacts_insert_authenticated"
  ON public.production_artifacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- C) output_pipelines
-- Registry of available output pipeline configurations
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.output_pipelines (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  category    text        NOT NULL,
  config_json jsonb,
  is_active   boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_output_pipelines_slug
  ON public.output_pipelines(slug);
CREATE INDEX IF NOT EXISTS idx_output_pipelines_category
  ON public.output_pipelines(category);

ALTER TABLE public.output_pipelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "output_pipelines_select_authenticated"
  ON public.output_pipelines
  FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- D) deploy_targets
-- External deployment destinations per organization
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deploy_targets (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  target_type     text        NOT NULL,
  name            text        NOT NULL,
  config_json     jsonb,
  is_active       boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deploy_targets_organization_id
  ON public.deploy_targets(organization_id);

ALTER TABLE public.deploy_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deploy_targets_select_authenticated"
  ON public.deploy_targets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "deploy_targets_insert_authenticated"
  ON public.deploy_targets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "deploy_targets_update_authenticated"
  ON public.deploy_targets
  FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- E) deploy_runs
-- Each deployment attempt linking a production run to a target
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deploy_runs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  production_run_id uuid        REFERENCES public.production_runs(id) ON DELETE SET NULL,
  deploy_target_id  uuid        REFERENCES public.deploy_targets(id) ON DELETE SET NULL,
  status            text        NOT NULL DEFAULT 'draft',
  result_json       jsonb,
  deployed_at       timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deploy_runs_production_run_id
  ON public.deploy_runs(production_run_id);
CREATE INDEX IF NOT EXISTS idx_deploy_runs_deploy_target_id
  ON public.deploy_runs(deploy_target_id);
CREATE INDEX IF NOT EXISTS idx_deploy_runs_status
  ON public.deploy_runs(status);
CREATE INDEX IF NOT EXISTS idx_deploy_runs_created_at
  ON public.deploy_runs(created_at DESC);

CREATE TRIGGER deploy_runs_updated_at
  BEFORE UPDATE ON public.deploy_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.deploy_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deploy_runs_select_authenticated"
  ON public.deploy_runs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "deploy_runs_insert_authenticated"
  ON public.deploy_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "deploy_runs_update_authenticated"
  ON public.deploy_runs
  FOR UPDATE
  TO authenticated
  USING (true);
