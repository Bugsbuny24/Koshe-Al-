-- ============================================================
-- Migration: V13–V15 Industry Packs (Safe Sectors Only)
-- Created: 2026-03-22
-- Phase: V13 Industry Packs · V14 Sector Knowledge · V15 Sector Workflows
-- Approach: Additive skeleton — does NOT touch existing core tables
-- IMPORTANT: Only safe sectors are seeded. Prohibited sectors
--   (legal, healthcare, investment-advice, credit/insurance, medical,
--   active-cybersecurity) are explicitly excluded.
-- ============================================================

-- -------------------------------------------------------
-- A) industry_packs
-- Top-level registry of industry sector packs
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.industry_packs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  category    text        NOT NULL,
  status      text        NOT NULL DEFAULT 'planned',
  config_json jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_industry_packs_slug
  ON public.industry_packs(slug);
CREATE INDEX IF NOT EXISTS idx_industry_packs_status
  ON public.industry_packs(status);

ALTER TABLE public.industry_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "industry_packs_select_authenticated"
  ON public.industry_packs
  FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- B) industry_templates
-- Reusable templates specific to an industry pack
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.industry_templates (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_pack_id  uuid        NOT NULL REFERENCES public.industry_packs(id) ON DELETE CASCADE,
  title             text        NOT NULL,
  template_type     text        NOT NULL,
  content_json      jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_industry_templates_industry_pack_id
  ON public.industry_templates(industry_pack_id);
CREATE INDEX IF NOT EXISTS idx_industry_templates_created_at
  ON public.industry_templates(created_at DESC);

ALTER TABLE public.industry_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "industry_templates_select_authenticated"
  ON public.industry_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- C) industry_knowledge_items
-- Knowledge base items scoped to an industry pack
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.industry_knowledge_items (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_pack_id  uuid        NOT NULL REFERENCES public.industry_packs(id) ON DELETE CASCADE,
  title             text        NOT NULL,
  kind              text        NOT NULL,
  content           text,
  metadata_json     jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_industry_knowledge_items_industry_pack_id
  ON public.industry_knowledge_items(industry_pack_id);
CREATE INDEX IF NOT EXISTS idx_industry_knowledge_items_kind
  ON public.industry_knowledge_items(kind);
CREATE INDEX IF NOT EXISTS idx_industry_knowledge_items_created_at
  ON public.industry_knowledge_items(created_at DESC);

ALTER TABLE public.industry_knowledge_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "industry_knowledge_items_select_authenticated"
  ON public.industry_knowledge_items
  FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- D) sector_workflows
-- Workflow definitions associated with an industry pack
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sector_workflows (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_pack_id  uuid        NOT NULL REFERENCES public.industry_packs(id) ON DELETE CASCADE,
  title             text        NOT NULL,
  workflow_type     text        NOT NULL,
  config_json       jsonb,
  status            text        NOT NULL DEFAULT 'planned',
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sector_workflows_industry_pack_id
  ON public.sector_workflows(industry_pack_id);
CREATE INDEX IF NOT EXISTS idx_sector_workflows_status
  ON public.sector_workflows(status);
CREATE INDEX IF NOT EXISTS idx_sector_workflows_created_at
  ON public.sector_workflows(created_at DESC);

ALTER TABLE public.sector_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sector_workflows_select_authenticated"
  ON public.sector_workflows
  FOR SELECT
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- SEED: Safe sector packs only
-- Prohibited: legal, healthcare, investment-advice,
--             credit/insurance, medical, active-cybersecurity
-- -------------------------------------------------------
INSERT INTO public.industry_packs (slug, name, category, status)
VALUES
  ('tourism',              'Tourism',              'hospitality',  'planned'),
  ('ecommerce',            'E-commerce',           'retail',       'planned'),
  ('agencies',             'Agencies',             'services',     'planned'),
  ('services',             'Services',             'services',     'planned'),
  ('real-estate-marketing','Real Estate Marketing','marketing',    'planned'),
  ('education-content',    'Education Content',    'education',    'planned'),
  ('small-business-ops',   'Small Business Ops',   'operations',   'planned')
ON CONFLICT (slug) DO NOTHING;
