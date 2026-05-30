create extension if not exists "pgcrypto";

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_user_id uuid null,
  actor_email text null,
  action text not null,
  metadata jsonb null,
  ip text null,
  user_agent text null
);

alter table public.admin_audit_logs enable row level security;

