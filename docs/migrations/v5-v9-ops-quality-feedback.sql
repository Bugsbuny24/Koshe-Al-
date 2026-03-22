-- ============================================================
-- Migration: V5–V9 Ops / Quality / Feedback Intelligence
-- Created: 2026-03-22
-- Phase: V5 Operational Intelligence · V7 Autonomous Production
--        V8 Team OS · V9 Learning Engine
-- Approach: Additive skeleton — does NOT touch existing core tables
-- Note: production_runs must already exist (v4-v6-production-deploy.sql)
-- ============================================================

-- -------------------------------------------------------
-- A) workflow_health_snapshots
-- Periodic health check snapshots for a workspace/org
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workflow_health_snapshots (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  workspace_type  text,
  status          text        NOT NULL DEFAULT 'healthy',
  signals_json    jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflow_health_snapshots_organization_id
  ON public.workflow_health_snapshots(organization_id);
CREATE INDEX IF NOT EXISTS idx_workflow_health_snapshots_created_at
  ON public.workflow_health_snapshots(created_at DESC);

ALTER TABLE public.workflow_health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflow_health_snapshots_select_authenticated"
  ON public.workflow_health_snapshots
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "workflow_health_snapshots_insert_authenticated"
  ON public.workflow_health_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- B) quality_reviews
-- Quality review records tied to production runs or deals
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quality_reviews (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  production_run_id uuid        REFERENCES public.production_runs(id) ON DELETE SET NULL,
  deal_id           uuid        REFERENCES public.deals(id) ON DELETE SET NULL,
  review_type       text        NOT NULL,
  status            text        NOT NULL DEFAULT 'pending',
  score             numeric,
  notes_json        jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quality_reviews_production_run_id
  ON public.quality_reviews(production_run_id);
CREATE INDEX IF NOT EXISTS idx_quality_reviews_deal_id
  ON public.quality_reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_quality_reviews_status
  ON public.quality_reviews(status);
CREATE INDEX IF NOT EXISTS idx_quality_reviews_created_at
  ON public.quality_reviews(created_at DESC);

CREATE TRIGGER quality_reviews_updated_at
  BEFORE UPDATE ON public.quality_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.quality_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quality_reviews_select_authenticated"
  ON public.quality_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "quality_reviews_insert_authenticated"
  ON public.quality_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "quality_reviews_update_authenticated"
  ON public.quality_reviews
  FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- C) feedback_threads
-- Threads that group feedback around a message, deal, or run
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_threads (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_message_id uuid        REFERENCES public.feedback_messages(id) ON DELETE SET NULL,
  deal_id             uuid        REFERENCES public.deals(id) ON DELETE SET NULL,
  execution_run_id    uuid        REFERENCES public.execution_runs(id) ON DELETE SET NULL,
  title               text,
  status              text        NOT NULL DEFAULT 'open',
  summary             text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_threads_feedback_message_id
  ON public.feedback_threads(feedback_message_id);
CREATE INDEX IF NOT EXISTS idx_feedback_threads_deal_id
  ON public.feedback_threads(deal_id);
CREATE INDEX IF NOT EXISTS idx_feedback_threads_execution_run_id
  ON public.feedback_threads(execution_run_id);
CREATE INDEX IF NOT EXISTS idx_feedback_threads_status
  ON public.feedback_threads(status);
CREATE INDEX IF NOT EXISTS idx_feedback_threads_created_at
  ON public.feedback_threads(created_at DESC);

CREATE TRIGGER feedback_threads_updated_at
  BEFORE UPDATE ON public.feedback_threads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.feedback_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_threads_select_authenticated"
  ON public.feedback_threads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "feedback_threads_insert_authenticated"
  ON public.feedback_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "feedback_threads_update_authenticated"
  ON public.feedback_threads
  FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- D) optimization_suggestions
-- AI-generated or system-detected improvement suggestions
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.optimization_suggestions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type  text        NOT NULL,
  source_id    uuid,
  category     text        NOT NULL,
  summary      text        NOT NULL,
  payload_json jsonb,
  status       text        NOT NULL DEFAULT 'new',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_optimization_suggestions_source_type
  ON public.optimization_suggestions(source_type);
CREATE INDEX IF NOT EXISTS idx_optimization_suggestions_status
  ON public.optimization_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_optimization_suggestions_created_at
  ON public.optimization_suggestions(created_at DESC);

ALTER TABLE public.optimization_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "optimization_suggestions_select_authenticated"
  ON public.optimization_suggestions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "optimization_suggestions_insert_authenticated"
  ON public.optimization_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- E) risk_signals
-- Risk flag signals from any source across the system
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.risk_signals (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type  text        NOT NULL,
  source_id    uuid,
  severity     text        NOT NULL DEFAULT 'medium',
  category     text        NOT NULL,
  message      text        NOT NULL,
  payload_json jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_risk_signals_source_type
  ON public.risk_signals(source_type);
CREATE INDEX IF NOT EXISTS idx_risk_signals_severity
  ON public.risk_signals(severity);
CREATE INDEX IF NOT EXISTS idx_risk_signals_created_at
  ON public.risk_signals(created_at DESC);

ALTER TABLE public.risk_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "risk_signals_select_authenticated"
  ON public.risk_signals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "risk_signals_insert_authenticated"
  ON public.risk_signals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
