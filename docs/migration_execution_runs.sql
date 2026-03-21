-- Migration: V2 Execution Core — execution_runs table
-- Created: 2026-03-21

CREATE TABLE IF NOT EXISTS public.execution_runs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  template_id   text,
  brief         text NOT NULL,
  requirement_json  jsonb,
  architecture_json jsonb,
  tasks_json        jsonb,
  checklist_json    jsonb,
  project_id    uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  deal_id       uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER execution_runs_updated_at
  BEFORE UPDATE ON public.execution_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_execution_runs_user_id ON public.execution_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_execution_runs_created_at ON public.execution_runs(created_at DESC);

-- RLS
ALTER TABLE public.execution_runs ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own runs
CREATE POLICY "execution_runs_select_own"
  ON public.execution_runs
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Policy: users can insert their own runs (or anonymous)
CREATE POLICY "execution_runs_insert_own"
  ON public.execution_runs
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Policy: users can update their own runs
CREATE POLICY "execution_runs_update_own"
  ON public.execution_runs
  FOR UPDATE
  USING (user_id = auth.uid());
