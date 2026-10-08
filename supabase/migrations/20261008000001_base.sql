-- GENERATO da scripts/gen_schema.py - non modificare a mano.
create extension if not exists pgcrypto;

-- Profilo applicativo: sostituisce l'entità built-in User di Base44.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'pr' check (role in ('admin','super4','capogruppo','pr')),
  promoter_id text,
  legacy_id text unique,           -- id utente Base44 originale
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create or replace function public.app_role() returns text
  language sql stable security definer set search_path = public as
  $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.app_promoter_id() returns text
  language sql stable security definer set search_path = public as
  $$ select promoter_id from public.profiles where id = auth.uid() $$;

create or replace function public.app_email() returns text
  language sql stable security definer set search_path = public as
  $$ select email from public.profiles where id = auth.uid() $$;

-- Id compatibili con Base44 (24 caratteri esadecimali, come ObjectId).
create or replace function public.new_id() returns text
  language sql volatile as
  $$ select substr(replace(gen_random_uuid()::text, '-', ''), 1, 24) $$;

create or replace function public.touch_updated_date() returns trigger
  language plpgsql as
  $$ begin new.updated_date = now(); return new; end $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_date();

-- Crea il profilo alla registrazione (ruolo di default 'pr').
create or replace function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as
  $$ begin
    insert into public.profiles (id, email, full_name)
    values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
    on conflict (id) do nothing;
    return new;
  end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
create policy "profiles_read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.app_role() = 'admin');
-- L'utente modifica solo i propri dati anagrafici; ruolo e promoter li cambia l'admin.
create policy "profiles_update_self" on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.app_role() and promoter_id is not distinct from public.app_promoter_id());
create policy "profiles_admin" on public.profiles for all to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
