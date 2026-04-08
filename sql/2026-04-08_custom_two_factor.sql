create extension if not exists pgcrypto;

create table if not exists public.user_two_factor_factors (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    friendly_name text not null,
    secret_ciphertext text not null,
    secret_iv text not null,
    secret_auth_tag text not null,
    verified_at timestamptz,
    last_used_at timestamptz,
    last_verified_time_step bigint,
    created_at timestamptz not null default now()
);

create index if not exists user_two_factor_factors_user_id_idx
    on public.user_two_factor_factors (user_id);

create index if not exists user_two_factor_factors_user_id_verified_idx
    on public.user_two_factor_factors (user_id, verified_at);

create table if not exists public.user_two_factor_recovery_codes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    code_hash text not null,
    code_hint text not null,
    used_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists user_two_factor_recovery_codes_user_id_idx
    on public.user_two_factor_recovery_codes (user_id);

create unique index if not exists user_two_factor_recovery_codes_user_id_code_hash_idx
    on public.user_two_factor_recovery_codes (user_id, code_hash);

create table if not exists public.user_two_factor_trusted_sessions (
    user_id uuid not null references auth.users(id) on delete cascade,
    session_id text not null,
    verified_at timestamptz not null default now(),
    expires_at timestamptz not null,
    created_at timestamptz not null default now(),
    primary key (user_id, session_id)
);

create index if not exists user_two_factor_trusted_sessions_expires_at_idx
    on public.user_two_factor_trusted_sessions (expires_at);

alter table public.user_two_factor_factors enable row level security;
alter table public.user_two_factor_recovery_codes enable row level security;
alter table public.user_two_factor_trusted_sessions enable row level security;
