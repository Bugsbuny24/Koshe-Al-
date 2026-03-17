-- ============================================================
-- Koshei AI Foreign Language University — DB Migration
-- Run this in your Supabase SQL editor (once per environment)
-- ============================================================

-- ─── profiles ────────────────────────────────────────────────────────────────
-- Already created by Supabase Auth helpers, ensure these columns exist
ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS full_name       text,
  ADD COLUMN IF NOT EXISTS email           text,
  ADD COLUMN IF NOT EXISTS native_language text,
  ADD COLUMN IF NOT EXISTS target_language text,
  ADD COLUMN IF NOT EXISTS difficulty_level text,
  ADD COLUMN IF NOT EXISTS learning_stage  text,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- ─── course_enrollments ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_enrollments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id             text NOT NULL,
  language_code         text NOT NULL,
  level                 text NOT NULL,
  progress_percent      integer NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  current_unit          integer NOT NULL DEFAULT 1,
  completed_units_count integer NOT NULL DEFAULT 0,
  total_units_count     integer NOT NULL DEFAULT 0,
  status                text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','paused')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id
  ON course_enrollments (user_id);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_status
  ON course_enrollments (user_id, status);

-- keep updated_at fresh automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_course_enrollments_updated_at ON course_enrollments;
CREATE TRIGGER trg_course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ─── unit_progress ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS unit_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id    text NOT NULL,
  unit_id      text NOT NULL,
  unit_order   integer NOT NULL,
  completed    boolean NOT NULL DEFAULT false,
  score        integer CHECK (score BETWEEN 0 AND 100),
  completed_at timestamptz,
  UNIQUE (user_id, course_id, unit_id)
);

CREATE INDEX IF NOT EXISTS idx_unit_progress_user_course
  ON unit_progress (user_id, course_id);

-- ─── achievements (badges) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code        text NOT NULL,
  title       text NOT NULL,
  description text,
  image_url   text,
  level       text,
  earned_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)          -- prevent duplicate badges
);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id
  ON achievements (user_id);

-- ─── certificates ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id     text NOT NULL,
  language_code text NOT NULL,
  level         text NOT NULL,
  title         text NOT NULL,
  image_url     text,
  issued_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)     -- one cert per course completion
);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id
  ON certificates (user_id);

-- ─── collectible_rewards (NFT-ready) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collectible_rewards (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type           text NOT NULL CHECK (source_type IN ('badge','certificate')),
  source_id             uuid NOT NULL,          -- references achievements.id or certificates.id
  token_name            text NOT NULL,
  token_symbol          text NOT NULL,
  metadata_json         jsonb NOT NULL DEFAULT '{}',
  image_url             text NOT NULL,
  rarity                text NOT NULL DEFAULT 'common'
                        CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  mint_status           text NOT NULL DEFAULT 'draft'
                        CHECK (mint_status IN ('draft','ready','minted')),
  downloadable_file_url text,
  marketplace_status    text NOT NULL DEFAULT 'hidden'
                        CHECK (marketplace_status IN ('hidden','listed','sold_ready')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, source_type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_collectible_rewards_user_id
  ON collectible_rewards (user_id);

-- ─── speaking_sessions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS speaking_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id  uuid,
  language         text,
  level            text,
  fluency_score    integer CHECK (fluency_score BETWEEN 0 AND 100),
  grammar_score    integer CHECK (grammar_score BETWEEN 0 AND 100),
  vocabulary_score integer CHECK (vocabulary_score BETWEEN 0 AND 100),
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_speaking_sessions_user_id
  ON speaking_sessions (user_id, created_at DESC);

-- ─── learning_memory ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS learning_memory (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language         text,
  error_type       text,
  wrong_sentence   text,
  correct_sentence text,
  explanation      text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learning_memory_user_id
  ON learning_memory (user_id, created_at DESC);

-- ─── vocab_memory ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocab_memory (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language  text,
  word      text NOT NULL,
  meaning   text,
  strength  integer NOT NULL DEFAULT 1,
  last_seen timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, word)
);

CREATE INDEX IF NOT EXISTS idx_vocab_memory_user_id
  ON vocab_memory (user_id, last_seen DESC);

-- ─── conversations ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language text,
  mode     text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── messages ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('user','assistant','system')),
  content         text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON messages (conversation_id, created_at ASC);

-- ─── ai_usage ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_usage (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model        text,
  input_tokens  integer,
  output_tokens integer,
  cost         numeric(10,6),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enable RLS on all tables and add basic user-owns-their-data policies.

ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE collectible_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_memory     ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_memory        ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage            ENABLE ROW LEVEL SECURITY;

-- Helper: authenticated user owns row
DO $$ BEGIN
  -- course_enrollments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='course_enrollments' AND policyname='Users manage own enrollments') THEN
    CREATE POLICY "Users manage own enrollments" ON course_enrollments
      USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  -- unit_progress
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='unit_progress' AND policyname='Users manage own unit progress') THEN
    CREATE POLICY "Users manage own unit progress" ON unit_progress
      USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  -- achievements
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='achievements' AND policyname='Users read own achievements') THEN
    CREATE POLICY "Users read own achievements" ON achievements
      USING (auth.uid() = user_id);
  END IF;
  -- certificates
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='certificates' AND policyname='Users read own certificates') THEN
    CREATE POLICY "Users read own certificates" ON certificates
      USING (auth.uid() = user_id);
  END IF;
  -- collectible_rewards
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='collectible_rewards' AND policyname='Users manage own collectibles') THEN
    CREATE POLICY "Users manage own collectibles" ON collectible_rewards
      USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
