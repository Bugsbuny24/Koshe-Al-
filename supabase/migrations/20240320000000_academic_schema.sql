-- ============================================================
-- Koshei AI University — Generic Academic Schema
-- Migration: 20240320000000_academic_schema.sql
--
-- Design principle:
--   • New generic-academic tables are created here.
--   • Existing tables (course_enrollments, achievements, certificates,
--     collectible_rewards) are NOT replaced — they are extended with
--     nullable bridge columns so the language-faculty continues working
--     unchanged while the new academic system can reference them.
--   • The "Faculty of Languages" sits inside the new faculties table
--     (faculty_type = 'language') and wraps the existing language system.
-- ============================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────
-- universities
-- ──────────────────────────────────────────────
create table if not exists public.universities (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  code         text not null unique,
  description  text,
  country      text,
  website      text,
  logo_url     text,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists universities_slug_idx on public.universities(slug);
create index if not exists universities_active_idx on public.universities(active);

-- ──────────────────────────────────────────────
-- faculties
-- ──────────────────────────────────────────────
-- faculty_type = 'language' → wraps the existing language-course system
-- faculty_type = 'generic'  → all other faculties
create table if not exists public.faculties (
  id             uuid primary key default uuid_generate_v4(),
  university_id  uuid not null references public.universities(id) on delete cascade,
  name           text not null,
  slug           text not null,
  code           text not null,
  faculty_type   text not null default 'generic' check (faculty_type in ('language','generic')),
  description    text,
  dean_name      text,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique(university_id, slug),
  unique(university_id, code)
);

create index if not exists faculties_university_idx on public.faculties(university_id);
create index if not exists faculties_active_idx on public.faculties(active);

-- ──────────────────────────────────────────────
-- departments
-- ──────────────────────────────────────────────
create table if not exists public.departments (
  id             uuid primary key default uuid_generate_v4(),
  faculty_id     uuid not null references public.faculties(id) on delete cascade,
  university_id  uuid not null references public.universities(id) on delete cascade,
  name           text not null,
  slug           text not null,
  code           text not null,
  description    text,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique(faculty_id, slug),
  unique(faculty_id, code)
);

create index if not exists departments_faculty_idx on public.departments(faculty_id);
create index if not exists departments_university_idx on public.departments(university_id);

-- ──────────────────────────────────────────────
-- programs
-- ──────────────────────────────────────────────
create table if not exists public.programs (
  id                       uuid primary key default uuid_generate_v4(),
  department_id            uuid references public.departments(id) on delete set null,
  faculty_id               uuid not null references public.faculties(id) on delete cascade,
  university_id            uuid not null references public.universities(id) on delete cascade,
  title                    text not null,
  slug                     text not null,
  code                     text not null,
  degree_type              text not null check (degree_type in ('BA','BS','MA','MSc','PhD','Certificate','Diploma','Prep')),
  duration_years           integer not null default 4,
  total_courses            integer,
  total_credits            integer,
  min_gpa                  numeric(4,2),
  language_of_instruction  text not null default 'English',
  has_prep_year            boolean not null default false,
  has_thesis               boolean not null default false,
  has_minor_option         boolean not null default false,
  has_honors_option        boolean not null default false,
  study_abroad_optional    boolean not null default false,
  description              text,
  active                   boolean not null default true,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  unique(university_id, code)
);

create index if not exists programs_university_idx on public.programs(university_id);
create index if not exists programs_faculty_idx on public.programs(faculty_id);
create index if not exists programs_department_idx on public.programs(department_id);
create index if not exists programs_active_idx on public.programs(active);

-- ──────────────────────────────────────────────
-- program_requirements
-- ──────────────────────────────────────────────
create table if not exists public.program_requirements (
  id               uuid primary key default uuid_generate_v4(),
  program_id       uuid not null references public.programs(id) on delete cascade,
  requirement_type text not null,
  title            text not null,
  description      text,
  min_credits      integer,
  min_courses      integer,
  is_mandatory     boolean not null default true,
  notes            text,
  created_at       timestamptz not null default now()
);

create index if not exists program_requirements_program_idx on public.program_requirements(program_id);

-- ──────────────────────────────────────────────
-- academic_courses
-- ──────────────────────────────────────────────
create table if not exists public.academic_courses (
  id                       uuid primary key default uuid_generate_v4(),
  program_id               uuid references public.programs(id) on delete set null,
  faculty_id               uuid not null references public.faculties(id) on delete cascade,
  university_id            uuid not null references public.universities(id) on delete cascade,
  title                    text not null,
  slug                     text not null,
  code                     text not null,
  credits                  integer not null default 3,
  description              text,
  is_core                  boolean not null default false,
  is_elective              boolean not null default false,
  level                    text,
  semester                 text,
  prerequisite_codes       text[],
  language_of_instruction  text not null default 'English',
  active                   boolean not null default true,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  unique(university_id, code)
);

create index if not exists academic_courses_university_idx on public.academic_courses(university_id);
create index if not exists academic_courses_program_idx on public.academic_courses(program_id);
create index if not exists academic_courses_faculty_idx on public.academic_courses(faculty_id);

-- ──────────────────────────────────────────────
-- course_modules
-- ──────────────────────────────────────────────
create table if not exists public.course_modules (
  id             uuid primary key default uuid_generate_v4(),
  course_id      uuid not null references public.academic_courses(id) on delete cascade,
  title          text not null,
  description    text,
  order_index    integer not null default 0,
  duration_hours numeric(6,2),
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists course_modules_course_idx on public.course_modules(course_id);

-- ──────────────────────────────────────────────
-- module_lessons
-- ──────────────────────────────────────────────
create table if not exists public.module_lessons (
  id               uuid primary key default uuid_generate_v4(),
  module_id        uuid not null references public.course_modules(id) on delete cascade,
  title            text not null,
  description      text,
  order_index      integer not null default 0,
  content_type     text not null check (content_type in ('text','video','quiz','practice','speaking','project')) default 'text',
  duration_minutes integer,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists module_lessons_module_idx on public.module_lessons(module_id);

-- ──────────────────────────────────────────────
-- degree_rules
-- ──────────────────────────────────────────────
create table if not exists public.degree_rules (
  id          uuid primary key default uuid_generate_v4(),
  program_id  uuid not null references public.programs(id) on delete cascade,
  rule_type   text not null,
  description text not null,
  value       text,
  created_at  timestamptz not null default now()
);

create index if not exists degree_rules_program_idx on public.degree_rules(program_id);

-- ──────────────────────────────────────────────
-- student_program_enrollments
-- ──────────────────────────────────────────────
create table if not exists public.student_program_enrollments (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  program_id           uuid not null references public.programs(id) on delete cascade,
  university_id        uuid not null references public.universities(id) on delete cascade,
  enrollment_date      date not null default current_date,
  expected_graduation  date,
  status               text not null check (status in ('active','graduated','suspended','withdrawn')) default 'active',
  gpa                  numeric(4,2),
  completed_credits    integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique(user_id, program_id)
);

create index if not exists spe_user_idx on public.student_program_enrollments(user_id);
create index if not exists spe_program_idx on public.student_program_enrollments(program_id);

-- ──────────────────────────────────────────────
-- student_course_enrollments
-- ──────────────────────────────────────────────
create table if not exists public.student_course_enrollments (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  course_id              uuid not null references public.academic_courses(id) on delete cascade,
  program_enrollment_id  uuid references public.student_program_enrollments(id) on delete set null,
  status                 text not null check (status in ('enrolled','completed','failed','withdrawn')) default 'enrolled',
  grade                  text,
  score                  numeric(5,2),
  completed_at           timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique(user_id, course_id)
);

create index if not exists sce_user_idx on public.student_course_enrollments(user_id);
create index if not exists sce_course_idx on public.student_course_enrollments(course_id);

-- ──────────────────────────────────────────────
-- student_transcript
-- ──────────────────────────────────────────────
create table if not exists public.student_transcript (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  university_id  uuid not null references public.universities(id) on delete cascade,
  program_id     uuid not null references public.programs(id) on delete cascade,
  course_id      uuid not null references public.academic_courses(id) on delete cascade,
  course_code    text not null,
  course_title   text not null,
  credits        integer not null,
  grade          text,
  score          numeric(5,2),
  semester       text,
  academic_year  text,
  completed_at   timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists transcript_user_idx on public.student_transcript(user_id);
create index if not exists transcript_program_idx on public.student_transcript(program_id);

-- ──────────────────────────────────────────────
-- student_awards
-- ──────────────────────────────────────────────
-- student_awards
-- certificate_id  → FK to public.certificates.id        (existing table)
-- collectible_id  → FK to public.collectible_rewards.id (existing table)
-- badge_code      → matches achievements.code (soft ref; code is not a unique key)
-- ──────────────────────────────────────────────
create table if not exists public.student_awards (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  milestone_type   text not null,
  title            text not null,
  description      text,
  program_id       uuid references public.programs(id) on delete set null,
  course_id        uuid references public.academic_courses(id) on delete set null,
  university_id    uuid references public.universities(id) on delete set null,
  badge_code       text,
  certificate_id   uuid references public.certificates(id) on delete set null,
  collectible_id   uuid references public.collectible_rewards(id) on delete set null,
  awarded_at       timestamptz not null default now()
);

create index if not exists awards_user_idx on public.student_awards(user_id);
create index if not exists awards_milestone_idx on public.student_awards(milestone_type);

-- ──────────────────────────────────────────────
-- Add role column to profiles if not exists
-- ──────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'role'
  ) then
    alter table public.profiles add column role text not null default 'student';
  end if;
end $$;

-- ──────────────────────────────────────────────
-- Bridge columns on EXISTING tables
--
-- These columns let the new academic system reference existing
-- language-faculty data without replacing any existing functionality.
-- All columns are nullable so existing rows are unaffected.
-- ──────────────────────────────────────────────

-- course_enrollments → link a language-course enrollment to an academic
-- program enrollment (e.g. student enrolled in the Languages program)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'course_enrollments'
      and column_name = 'program_enrollment_id'
  ) then
    alter table public.course_enrollments
      add column program_enrollment_id uuid
        references public.student_program_enrollments(id) on delete set null;
  end if;
end $$;

-- achievements → optional link to the academic program / milestone that
-- triggered this badge (does not affect existing language achievements)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'achievements'
      and column_name = 'academic_program_id'
  ) then
    alter table public.achievements
      add column academic_program_id uuid
        references public.programs(id) on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'achievements'
      and column_name = 'academic_milestone_type'
  ) then
    alter table public.achievements
      add column academic_milestone_type text;
  end if;
end $$;

-- certificates → optional link to academic program (language certs are
-- already stored here; academic certs can reuse the same table)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'certificates'
      and column_name = 'academic_program_id'
  ) then
    alter table public.certificates
      add column academic_program_id uuid
        references public.programs(id) on delete set null;
  end if;
end $$;

-- ──────────────────────────────────────────────
-- RLS Policies
-- ──────────────────────────────────────────────

-- Universities: public read
alter table public.universities enable row level security;
create policy "universities_public_read" on public.universities
  for select using (true);
create policy "universities_admin_all" on public.universities
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Faculties: public read
alter table public.faculties enable row level security;
create policy "faculties_public_read" on public.faculties
  for select using (true);
create policy "faculties_admin_all" on public.faculties
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Departments: public read
alter table public.departments enable row level security;
create policy "departments_public_read" on public.departments
  for select using (true);
create policy "departments_admin_all" on public.departments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Programs: public read
alter table public.programs enable row level security;
create policy "programs_public_read" on public.programs
  for select using (true);
create policy "programs_admin_all" on public.programs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Program requirements: public read
alter table public.program_requirements enable row level security;
create policy "program_requirements_public_read" on public.program_requirements
  for select using (true);
create policy "program_requirements_admin_all" on public.program_requirements
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Academic courses: public read
alter table public.academic_courses enable row level security;
create policy "academic_courses_public_read" on public.academic_courses
  for select using (true);
create policy "academic_courses_admin_all" on public.academic_courses
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Course modules: public read
alter table public.course_modules enable row level security;
create policy "course_modules_public_read" on public.course_modules
  for select using (true);
create policy "course_modules_admin_all" on public.course_modules
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Module lessons: public read
alter table public.module_lessons enable row level security;
create policy "module_lessons_public_read" on public.module_lessons
  for select using (true);
create policy "module_lessons_admin_all" on public.module_lessons
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Student program enrollments: own data only
alter table public.student_program_enrollments enable row level security;
create policy "spe_own_read" on public.student_program_enrollments
  for select using (auth.uid() = user_id);
create policy "spe_own_insert" on public.student_program_enrollments
  for insert with check (auth.uid() = user_id);
create policy "spe_admin_all" on public.student_program_enrollments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Student course enrollments: own data only
alter table public.student_course_enrollments enable row level security;
create policy "sce_own_read" on public.student_course_enrollments
  for select using (auth.uid() = user_id);
create policy "sce_own_insert" on public.student_course_enrollments
  for insert with check (auth.uid() = user_id);
create policy "sce_admin_all" on public.student_course_enrollments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Student transcript: own data only
alter table public.student_transcript enable row level security;
create policy "transcript_own_read" on public.student_transcript
  for select using (auth.uid() = user_id);
create policy "transcript_admin_all" on public.student_transcript
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Student awards: own data only
alter table public.student_awards enable row level security;
create policy "awards_own_read" on public.student_awards
  for select using (auth.uid() = user_id);
create policy "awards_admin_all" on public.student_awards
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Degree rules: public read
alter table public.degree_rules enable row level security;
create policy "degree_rules_public_read" on public.degree_rules
  for select using (true);
create policy "degree_rules_admin_all" on public.degree_rules
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ──────────────────────────────────────────────
-- Updated_at trigger function
-- ──────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create or replace trigger universities_updated_at
  before update on public.universities
  for each row execute procedure public.set_updated_at();

create or replace trigger faculties_updated_at
  before update on public.faculties
  for each row execute procedure public.set_updated_at();

create or replace trigger departments_updated_at
  before update on public.departments
  for each row execute procedure public.set_updated_at();

create or replace trigger programs_updated_at
  before update on public.programs
  for each row execute procedure public.set_updated_at();

create or replace trigger academic_courses_updated_at
  before update on public.academic_courses
  for each row execute procedure public.set_updated_at();

create or replace trigger student_program_enrollments_updated_at
  before update on public.student_program_enrollments
  for each row execute procedure public.set_updated_at();

create or replace trigger student_course_enrollments_updated_at
  before update on public.student_course_enrollments
  for each row execute procedure public.set_updated_at();
