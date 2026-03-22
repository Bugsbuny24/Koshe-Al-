-- ============================================================
-- Migration: V19–V20 Network Intelligence
-- Created: 2026-03-22
-- Phase: V19 Cross-Company Intelligence · V20 Benchmark Engine
-- Approach: Additive skeleton — does NOT touch existing core tables
-- IMPORTANT: No real customer data is stored or cross-linked here.
--   Only anonymised benchmark and pattern insight records.
-- ============================================================

-- -------------------------------------------------------
-- A) benchmark_datasets
-- Registry of benchmark dataset definitions (no raw data)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.benchmark_datasets (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  category      text        NOT NULL,
  status        text        NOT NULL DEFAULT 'planned',
  metadata_json jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_benchmark_datasets_category
  ON public.benchmark_datasets(category);
CREATE INDEX IF NOT EXISTS idx_benchmark_datasets_status
  ON public.benchmark_datasets(status);
CREATE INDEX IF NOT EXISTS idx_benchmark_datasets_created_at
  ON public.benchmark_datasets(created_at DESC);

ALTER TABLE public.benchmark_datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "benchmark_datasets_select_authenticated"
  ON public.benchmark_datasets
  FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- B) pattern_insights
-- Anonymised aggregate pattern observations derived from
-- benchmark datasets — no individual customer PII
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pattern_insights (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  benchmark_dataset_id uuid        REFERENCES public.benchmark_datasets(id) ON DELETE SET NULL,
  title                text        NOT NULL,
  category             text        NOT NULL,
  summary              text,
  payload_json         jsonb,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pattern_insights_benchmark_dataset_id
  ON public.pattern_insights(benchmark_dataset_id);
CREATE INDEX IF NOT EXISTS idx_pattern_insights_category
  ON public.pattern_insights(category);
CREATE INDEX IF NOT EXISTS idx_pattern_insights_created_at
  ON public.pattern_insights(created_at DESC);

ALTER TABLE public.pattern_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pattern_insights_select_authenticated"
  ON public.pattern_insights
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "pattern_insights_insert_authenticated"
  ON public.pattern_insights
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -------------------------------------------------------
-- C) privacy_rulesets
-- Privacy guard rule definitions for cross-company intelligence
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.privacy_rulesets (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  category   text        NOT NULL,
  rules_json jsonb,
  is_active  boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_privacy_rulesets_category
  ON public.privacy_rulesets(category);
CREATE INDEX IF NOT EXISTS idx_privacy_rulesets_is_active
  ON public.privacy_rulesets(is_active);

ALTER TABLE public.privacy_rulesets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "privacy_rulesets_select_authenticated"
  ON public.privacy_rulesets
  FOR SELECT
  TO authenticated
  USING (true);
