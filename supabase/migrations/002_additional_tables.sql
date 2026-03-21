-- Courses
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text,
  level text check (level in ('Başlangıç', 'Orta', 'İleri')),
  duration text,
  image text,
  lessons_count integer default 0,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lessons
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  duration text,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Course Enrollments
create table if not exists public.course_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, course_id)
);

-- Lesson Progress
create table if not exists public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  lesson_id text not null,
  completed boolean default false,
  progress_percent integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- Certificates
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  certificate_id text unique not null,
  issued_at timestamptz default now()
);

-- Projects
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  language text default 'python',
  code text,
  prompt text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  plan_id text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Transactions
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text check (type in ('topup', 'deduct', 'grant')),
  amount numeric not null,
  description text,
  created_at timestamptz default now()
);

-- Achievements
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  earned_at timestamptz default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- RPC: add credits
create or replace function public.add_credits(uid uuid, amount numeric)
returns void language plpgsql security definer as $$
begin
  update public.user_quotas
  set credits_remaining = credits_remaining + amount,
      updated_at = now()
  where user_id = uid;
end;
$$;

-- RLS
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.certificates enable row level security;
alter table public.projects enable row level security;
alter table public.orders enable row level security;
alter table public.transactions enable row level security;
alter table public.achievements enable row level security;
alter table public.notifications enable row level security;

-- Policies
create policy if not exists "Courses are publicly readable" on public.courses for select using (true);
create policy if not exists "Lessons are publicly readable" on public.lessons for select using (true);
create policy if not exists "Users can read own enrollments" on public.course_enrollments for select using (auth.uid() = user_id);
create policy if not exists "Users can insert own enrollments" on public.course_enrollments for insert with check (auth.uid() = user_id);
create policy if not exists "Users can update own enrollments" on public.course_enrollments for update using (auth.uid() = user_id);
create policy if not exists "Users can read own lesson progress" on public.lesson_progress for select using (auth.uid() = user_id);
create policy if not exists "Users can upsert own lesson progress" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy if not exists "Users can update own lesson progress" on public.lesson_progress for update using (auth.uid() = user_id);
create policy if not exists "Users can read own certificates" on public.certificates for select using (auth.uid() = user_id);
create policy if not exists "Users can read own projects" on public.projects for select using (auth.uid() = user_id or is_public = true);
create policy if not exists "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy if not exists "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy if not exists "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);
create policy if not exists "Users can read own orders" on public.orders for select using (auth.uid() = user_id);
create policy if not exists "Users can read own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy if not exists "Users can read own achievements" on public.achievements for select using (auth.uid() = user_id);
create policy if not exists "Users can read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy if not exists "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
