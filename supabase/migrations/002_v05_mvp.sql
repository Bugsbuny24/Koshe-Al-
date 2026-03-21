-- v0.5 MVP migration: performance indexes and auth improvements

-- Index for faster chat message queries by user and session
create index if not exists idx_chat_messages_user_id on public.chat_messages(user_id);
create index if not exists idx_chat_messages_session_id on public.chat_messages(session_id);
create index if not exists idx_chat_messages_created_at on public.chat_messages(created_at desc);

-- Index for AI usage analytics
create index if not exists idx_ai_usage_user_id on public.ai_usage(user_id);
create index if not exists idx_ai_usage_created_at on public.ai_usage(created_at desc);

-- Add feature column to ai_usage if not exists (was missing in initial migration)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'ai_usage'
      and column_name = 'feature'
  ) then
    alter table public.ai_usage add column feature text;
  end if;
end;
$$;

-- Allow service role to insert ai_usage records (needed for server-side logging)
create policy if not exists "Service role can insert usage" on public.ai_usage
  for insert with check (true);

-- Allow service role to insert chat_messages (needed for API routes)
create policy if not exists "Service role can insert messages" on public.chat_messages
  for insert with check (true);

-- Allow service role to read all profiles (for admin panel)
create policy if not exists "Service role can read all profiles" on public.profiles
  for select using (true);

-- Allow service role to update user quotas (for deduct_credits RPC)
create policy if not exists "Service role can update quotas" on public.user_quotas
  for update using (true);
