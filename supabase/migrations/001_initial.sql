-- Users profiles
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- User quotas / plans
create table if not exists public.user_quotas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  plan_id text default 'starter',
  credits_remaining numeric default 100,
  is_active boolean default true,
  plan_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI usage logs
create table if not exists public.ai_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  model text,
  feature text,
  input_tokens integer default 0,
  output_tokens integer default 0,
  cost numeric default 0,
  created_at timestamptz default now()
);

-- AI cache
create table if not exists public.ai_cache (
  id uuid default gen_random_uuid() primary key,
  prompt_hash text unique,
  model text,
  response jsonb,
  created_at timestamptz default now()
);

-- Chat messages
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  session_id uuid,
  role text check (role in ('user', 'model')),
  content text,
  feature text,
  created_at timestamptz default now()
);

-- RPC: deduct credits
create or replace function public.deduct_credits(uid uuid, amount numeric)
returns void language plpgsql security definer as $$
begin
  update public.user_quotas
  set credits_remaining = greatest(0, credits_remaining - amount),
      updated_at = now()
  where user_id = uid;
end;
$$;

-- Trigger: create profile + quota on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id)
  );
  
  insert into public.user_quotas(user_id, plan_id, credits_remaining, is_active)
  values (new.id, 'starter', 100, true);
  
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.user_quotas enable row level security;
alter table public.ai_usage enable row level security;
alter table public.chat_messages enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read own quota" on public.user_quotas for select using (auth.uid() = user_id);
create policy "Users can read own usage" on public.ai_usage for select using (auth.uid() = user_id);
create policy "Users can read own messages" on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own messages" on public.chat_messages for insert with check (auth.uid() = user_id);
