-- Migration: V1+V2 Flow Integration — execution_runs table extensions
-- Created: 2026-03-21
-- Adds: title, milestone_mode, status, revision_notes_json
-- Existing columns (project_id, deal_id) were already added in migration_execution_runs.sql

-- Add title column (nullable, human readable label for the run)
ALTER TABLE public.execution_runs
  ADD COLUMN IF NOT EXISTS title text;

-- Add selected_template_id alias (redundant with template_id but kept for spec compliance)
-- Note: template_id already exists; this is a no-op comment for clarity.

-- Add milestone_mode column
ALTER TABLE public.execution_runs
  ADD COLUMN IF NOT EXISTS milestone_mode text;

-- Add status column with default 'draft'
ALTER TABLE public.execution_runs
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';

-- Add revision_notes_json for back-link feedback loop
ALTER TABLE public.execution_runs
  ADD COLUMN IF NOT EXISTS revision_notes_json jsonb;

-- Backfill status for existing rows
UPDATE public.execution_runs
  SET status = 'draft'
  WHERE status IS NULL OR status = '';
