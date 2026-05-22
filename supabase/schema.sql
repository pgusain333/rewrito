-- ============================================================================
-- rewrito — Supabase schema
-- Run this in the Supabase SQL editor.
-- It is idempotent (safe to run more than once).
-- ============================================================================

-- 1) profiles --------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  welcome_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz;

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) usage_limits ----------------------------------------------------------
create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  anonymous_id text,
  request_count integer not null default 0,
  max_requests integer not null default 1000000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- one row per user, or one row per anonymous_id
  constraint usage_limits_user_or_anon
    check (
      (user_id is not null and anonymous_id is null)
      or (user_id is null and anonymous_id is not null)
    )
);

create unique index if not exists usage_limits_user_uniq
  on public.usage_limits(user_id)
  where user_id is not null;

create unique index if not exists usage_limits_anon_uniq
  on public.usage_limits(anonymous_id)
  where anonymous_id is not null;

-- 3) rewrite_history -------------------------------------------------------
create table if not exists public.rewrite_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_type text not null check (tool_type in ('humanizer', 'detector', 'grammar', 'linkedin', 'email', 'plagiarism', 'study')),
  input_text text not null,
  output_text text not null,
  tone text not null,
  refinement_level text not null,
  study_mode text,
  education_level text,
  scores jsonb,
  created_at timestamptz not null default now()
);

alter table public.rewrite_history
  add column if not exists study_mode text,
  add column if not exists education_level text,
  add column if not exists scores jsonb;

alter table public.rewrite_history
  drop constraint if exists rewrite_history_tool_type_check;

alter table public.rewrite_history
  add constraint rewrite_history_tool_type_check
  check (tool_type in ('humanizer', 'detector', 'grammar', 'linkedin', 'email', 'plagiarism', 'study'));

create index if not exists rewrite_history_user_created
  on public.rewrite_history(user_id, created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.usage_limits enable row level security;
alter table public.rewrite_history enable row level security;

-- profiles: users can read/update only their own row.
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update"
  on public.profiles for update
  using (auth.uid() = id);

-- usage_limits: users can read their own row.
-- Writes are done via the service role only (server-side API route).
drop policy if exists "usage self read" on public.usage_limits;
create policy "usage self read"
  on public.usage_limits for select
  using (auth.uid() = user_id);

-- rewrite_history: users can read only their own history.
drop policy if exists "history self read" on public.rewrite_history;
create policy "history self read"
  on public.rewrite_history for select
  using (auth.uid() = user_id);

-- Optional: allow users to delete their own history.
drop policy if exists "history self delete" on public.rewrite_history;
create policy "history self delete"
  on public.rewrite_history for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- Touch updated_at on usage_limits
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists usage_limits_set_updated on public.usage_limits;
create trigger usage_limits_set_updated
  before update on public.usage_limits
  for each row execute function public.set_updated_at();
