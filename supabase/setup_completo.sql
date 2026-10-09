-- GENERATO da scripts/gen_setup_sql.py - non modificare a mano.
-- Per un progetto Supabase di PROVA: si può rieseguire, ma CANCELLA e ricrea tutti i dati.
begin;

-- ===== azzeramento =====
delete from auth.identities where user_id in (select id from auth.users where email like '%@vibra.local');
delete from auth.users where email like '%@vibra.local';
drop schema if exists public cascade;
create schema public;
grant usage, create on schema public to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

-- ===== 20261008000001_base.sql =====
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

-- ===== 20261008000002_tables.sql =====
-- GENERATO da scripts/gen_schema.py - non modificare a mano.
-- AISuggestion
create table public.ai_suggestion (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "computed_at" timestamptz,
  "promoter_id" text,
  "recommendations" jsonb,
  "summary" text,
  "week_start" date
);
create trigger ai_suggestion_touch before update on public.ai_suggestion
  for each row execute function public.touch_updated_date();
comment on table public.ai_suggestion is 'Entità Base44 AISuggestion';

-- Achievement
create table public.achievement (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "key" text,
  "title" text,
  "description" text,
  "category" text,
  "rarity" text,
  "icon_emoji" text,
  "icon_url" text,
  "condition_type" text,
  "condition_value" double precision,
  "sort_order" double precision default 0,
  "is_active" boolean default true
);
create trigger achievement_touch before update on public.achievement
  for each row execute function public.touch_updated_date();
comment on table public.achievement is 'Entità Base44 Achievement';

-- AppSettings
create table public.app_settings (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "key" text,
  "value" text
);
create trigger app_settings_touch before update on public.app_settings
  for each row execute function public.touch_updated_date();
comment on table public.app_settings is 'Entità Base44 AppSettings';

-- AuditLog
create table public.audit_log (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "user_id" text,
  "user_email" text,
  "user_name" text,
  "entity_name" text,
  "record_id" text,
  "record_label" text,
  "operation_type" text,
  "changed_fields" jsonb,
  "old_value" jsonb,
  "new_value" jsonb,
  "timestamp" timestamptz
);
create trigger audit_log_touch before update on public.audit_log
  for each row execute function public.touch_updated_date();
comment on table public.audit_log is 'Entità Base44 AuditLog';

-- Client
create table public.client (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "cum_attendance_rate" double precision default 0,
  "cum_avg_spent" double precision default 0,
  "cum_badges" jsonb,
  "cum_ciclo_medio" double precision default 0,
  "cum_extra" double precision default 0,
  "cum_first_attendance_date" date,
  "cum_fri" double precision default 0,
  "cum_last_attendance_date" date,
  "cum_last_event_venue" text,
  "cum_last_revenue" double precision default 0,
  "cum_month_trend" double precision default 0,
  "cum_rating" double precision default 0,
  "cum_sat" double precision default 0,
  "cum_stats_updated_at" timestamptz,
  "cum_sun" double precision default 0,
  "cum_total_spent" double precision default 0,
  "cum_trend_pct" double precision default 0,
  "cum_trend_status" text,
  "cum_venue_counts" jsonb,
  "cum_visits" double precision default 0,
  "data_nascita" text,
  "instagram" text,
  "instagram_profile_url" text,
  "is_driver" boolean default false,
  "is_lead" boolean default false,
  "is_leader" boolean default false,
  "last_contacted_at" timestamptz,
  "leader_since" timestamptz,
  "name" text,
  "new_people_brought" double precision default 0,
  "notes" text,
  "phone" text,
  "photo_url" text,
  "promoter_id" text,
  "referred_by_client_id" text,
  "residenza_key" text,
  "source_type" text,
  "stato_pagante" text,
  "tipologia_cliente" jsonb
);
create trigger client_touch before update on public.client
  for each row execute function public.touch_updated_date();
comment on table public.client is 'Entità Base44 Client';

-- ClientGroup
create table public.client_group (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "name" text,
  "client_ids" jsonb
);
create trigger client_group_touch before update on public.client_group
  for each row execute function public.touch_updated_date();
comment on table public.client_group is 'Entità Base44 ClientGroup';

-- ContactReminder
create table public.contact_reminder (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "client_id" text,
  "client_name" text,
  "reminder_datetime" timestamptz,
  "status" text default 'pending'
);
create trigger contact_reminder_touch before update on public.contact_reminder
  for each row execute function public.touch_updated_date();
comment on table public.contact_reminder is 'Entità Base44 ContactReminder';

-- CreditUsageLog
create table public.credit_usage_log (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "promoter_name" text,
  "feature" text,
  "credits" double precision default 1,
  "detail" text
);
create trigger credit_usage_log_touch before update on public.credit_usage_log
  for each row execute function public.touch_updated_date();
comment on table public.credit_usage_log is 'Entità Base44 CreditUsageLog';

-- DownloadItem
create table public.download_item (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "name" text,
  "file_url" text,
  "file_type" text,
  "section_id" text,
  "section_label" text,
  "section_icon" text,
  "section_color" text,
  "bg_class" text default 'bg-gray-900'
);
create trigger download_item_touch before update on public.download_item
  for each row execute function public.touch_updated_date();
comment on table public.download_item is 'Entità Base44 DownloadItem';

-- Event
create table public.event (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "name" text,
  "date" date,
  "venue" text,
  "physical_location" text,
  "total_revenue" double precision,
  "total_guests" double precision,
  "table_threshold" double precision,
  "is_extra" boolean default false,
  "notes" text
);
create trigger event_touch before update on public.event
  for each row execute function public.touch_updated_date();
comment on table public.event is 'Entità Base44 Event';

-- EventAttendance
create table public.event_attendance (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "event_id" text,
  "promoter_id" text,
  "client_id" text,
  "present" boolean default true,
  "revenue" double precision,
  "table_number" text,
  "notes" text,
  "new_people_brought" double precision default 0,
  "guadagno_pct" double precision default 0,
  "guadagno_fuori_mano" double precision default 0
);
create trigger event_attendance_touch before update on public.event_attendance
  for each row execute function public.touch_updated_date();
comment on table public.event_attendance is 'Entità Base44 EventAttendance';

-- IgnoredInstagramChat
create table public.ignored_instagram_chat (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "conversation_id" text,
  "handle" text,
  "username" text,
  "ignored_at" timestamptz
);
create trigger ignored_instagram_chat_touch before update on public.ignored_instagram_chat
  for each row execute function public.touch_updated_date();
comment on table public.ignored_instagram_chat is 'Entità Base44 IgnoredInstagramChat';

-- InstagramMessage
create table public.instagram_message (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "conversation_id" text,
  "sender_ig_id" text,
  "sender_handle" text,
  "sender_username" text,
  "sender_profile_pic_url" text,
  "message_text" text,
  "message_type" text default 'text',
  "message_timestamp" timestamptz,
  "matched_semina_id" text,
  "matched_client_id" text,
  "is_outgoing" boolean default false,
  "is_read" boolean default false,
  "is_pinned" boolean default false,
  "synced_at" timestamptz
);
create trigger instagram_message_touch before update on public.instagram_message
  for each row execute function public.touch_updated_date();
comment on table public.instagram_message is 'Entità Base44 InstagramMessage';

-- InstagramProfileSnapshot
create table public.instagram_profile_snapshot (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "date" date,
  "followers" double precision default 0,
  "following" double precision default 0,
  "semine_added" double precision default 0
);
create trigger instagram_profile_snapshot_touch before update on public.instagram_profile_snapshot
  for each row execute function public.touch_updated_date();
comment on table public.instagram_profile_snapshot is 'Entità Base44 InstagramProfileSnapshot';

-- Notification
create table public.notification (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "recipient_promoter_id" text,
  "type" text,
  "title" text,
  "message" text,
  "icon" text,
  "is_read" boolean default false,
  "related_id" text,
  "action_url" text
);
create trigger notification_touch before update on public.notification
  for each row execute function public.touch_updated_date();
comment on table public.notification is 'Entità Base44 Notification';

-- ProgrammazionePlan
create table public.programmazione_plan (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "plan" jsonb
);
create trigger programmazione_plan_touch before update on public.programmazione_plan
  for each row execute function public.touch_updated_date();
comment on table public.programmazione_plan is 'Entità Base44 ProgrammazionePlan';

-- Promoter
create table public.promoter (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "name" text,
  "phone" text,
  "instagram" text,
  "instagram_followers" double precision,
  "instagram_following" double precision,
  "ig_user_id" text,
  "ig_connected_at" timestamptz,
  "ig_profile_pic_url" text,
  "ig_followers_synced" double precision default 0,
  "ig_following_synced" double precision default 0,
  "ig_username_synced" text,
  "ig_name_synced" text,
  "ig_profile_synced_at" timestamptz,
  "photo_url" text,
  "photo_zoom" double precision default 1,
  "photo_offset_x" double precision default 0,
  "photo_offset_y" double precision default 0,
  "status" text default 'attivo',
  "show_in_stats" boolean default true,
  "ruolo" text,
  "referente_id" text,
  "neighborhood" text,
  "city" text,
  "province_area" text,
  "address" text,
  "lat" double precision,
  "lng" double precision,
  "promoter_from" date,
  "notes" text,
  "goals" jsonb,
  "accordi_per_locale" jsonb,
  "cum_total_revenue" double precision default 0,
  "cum_total_tables" double precision default 0,
  "cum_week_revenue" double precision default 0,
  "cum_week_tables" double precision default 0,
  "cum_month_revenue" double precision default 0,
  "cum_total_earnings" double precision default 0,
  "cum_total_clients" double precision default 0,
  "cum_total_presences" double precision default 0,
  "cum_vibra_vs_weekly_wins" double precision default 0,
  "cum_vibra_vs_weekly_streak" double precision default 0,
  "cum_vibra_vs_current_streak" double precision default 0,
  "cum_vibra_vs_monthly_win" double precision default 0,
  "cum_ach_total" double precision default 0,
  "cum_ach_unlocked" double precision default 0,
  "cum_ach_by_rarity" jsonb,
  "cum_geo_zone_counts" jsonb,
  "cum_stats_updated_at" timestamptz
);
create trigger promoter_touch before update on public.promoter
  for each row execute function public.touch_updated_date();
comment on table public.promoter is 'Entità Base44 Promoter';

-- PromoterAchievement
create table public.promoter_achievement (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "achievement_id" text,
  "achievement_key" text,
  "unlocked_at" timestamptz
);
create trigger promoter_achievement_touch before update on public.promoter_achievement
  for each row execute function public.touch_updated_date();
comment on table public.promoter_achievement is 'Entità Base44 PromoterAchievement';

-- PromoterIGToken
create table public.promoter_ig_token (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "ig_access_token" text,
  "ig_user_id" text,
  "ig_connected_at" timestamptz
);
create trigger promoter_ig_token_touch before update on public.promoter_ig_token
  for each row execute function public.touch_updated_date();
comment on table public.promoter_ig_token is 'Entità Base44 PromoterIGToken';

-- PromoterMonthlyStats
create table public.promoter_monthly_stats (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "month" text,
  "revenue" double precision default 0,
  "tables" double precision default 0
);
create trigger promoter_monthly_stats_touch before update on public.promoter_monthly_stats
  for each row execute function public.touch_updated_date();
comment on table public.promoter_monthly_stats is 'Entità Base44 PromoterMonthlyStats';

-- PromoterNote
create table public.promoter_note (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "title" text,
  "content" text,
  "color" text default '#1e1e2e',
  "pinned" boolean default false,
  "display_order" double precision default 0
);
create trigger promoter_note_touch before update on public.promoter_note
  for each row execute function public.touch_updated_date();
comment on table public.promoter_note is 'Entità Base44 PromoterNote';

-- PromoterRank
create table public.promoter_rank (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "rank_key" text
);
create trigger promoter_rank_touch before update on public.promoter_rank
  for each row execute function public.touch_updated_date();
comment on table public.promoter_rank is 'Entità Base44 PromoterRank';

-- PushSubscription
create table public.push_subscription (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "user_id" text,
  "endpoint" text,
  "p256dh" text,
  "auth" text,
  "user_agent" text
);
create trigger push_subscription_touch before update on public.push_subscription
  for each row execute function public.touch_updated_date();
comment on table public.push_subscription is 'Entità Base44 PushSubscription';

-- RecomputeLock
create table public.recompute_lock (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "key" text,
  "token" text
);
create trigger recompute_lock_touch before update on public.recompute_lock
  for each row execute function public.touch_updated_date();
comment on table public.recompute_lock is 'Entità Base44 RecomputeLock';

-- SeasonDivider
create table public.season_divider (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "label" text,
  "color" text,
  "eventId" text
);
create trigger season_divider_touch before update on public.season_divider
  for each row execute function public.touch_updated_date();
comment on table public.season_divider is 'Entità Base44 SeasonDivider';

-- Semina
create table public.semina (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "name" text,
  "promoter_id" text,
  "platform" text default 'instagram',
  "instagram" text,
  "instagram_profile_url" text,
  "tiktok" text,
  "tiktok_profile_url" text,
  "phone" text,
  "photo_url" text,
  "eta" double precision,
  "provenienza" text,
  "notes" text,
  "status" text default 'nuovo',
  "recettivita" double precision default 1,
  "is_off" boolean default false,
  "last_contacted_at" timestamptz,
  "display_order" double precision default 0,
  "ai_data" jsonb,
  "ai_extracted_at" timestamptz
);
create trigger semina_touch before update on public.semina
  for each row execute function public.touch_updated_date();
comment on table public.semina is 'Entità Base44 Semina';

-- SerataFittizia
create table public.serata_fittizia (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "name" text,
  "date" date
);
create trigger serata_fittizia_touch before update on public.serata_fittizia
  for each row execute function public.touch_updated_date();
comment on table public.serata_fittizia is 'Entità Base44 SerataFittizia';

-- Venue
create table public.venue (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "name" text,
  "day_of_week" double precision,
  "season_label" text,
  "color_hex" text default '#a78bfa',
  "default_threshold" double precision default 300,
  "is_extra" boolean default false,
  "is_active" boolean default true,
  "show_in_prospetto" boolean default true,
  "sort_order" double precision default 0,
  "logo_key" text
);
create trigger venue_touch before update on public.venue
  for each row execute function public.touch_updated_date();
comment on table public.venue is 'Entità Base44 Venue';

-- VibraChallenge
create table public.vibra_challenge (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "title" text,
  "description" text,
  "prize" text,
  "participant_ids" jsonb,
  "metric_type" text default 'fatturato',
  "manual_scores" jsonb,
  "start_date" date,
  "end_date" date,
  "is_active" boolean default true
);
create trigger vibra_challenge_touch before update on public.vibra_challenge
  for each row execute function public.touch_updated_date();
comment on table public.vibra_challenge is 'Entità Base44 VibraChallenge';

-- WeeklySuggestion
create table public.weekly_suggestion (
  id text primary key default public.new_id(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  created_by_id text default auth.uid()::text,
  created_by text default public.app_email(),
  "promoter_id" text,
  "week_start" date,
  "suggestions" jsonb,
  "computed_at" timestamptz
);
create trigger weekly_suggestion_touch before update on public.weekly_suggestion
  for each row execute function public.touch_updated_date();
comment on table public.weekly_suggestion is 'Entità Base44 WeeklySuggestion';

create index on public.ai_suggestion ("promoter_id");
create index on public.ai_suggestion (created_date desc);
create index on public.achievement (created_date desc);
create index on public.app_settings (created_date desc);
create index on public.audit_log ("user_id");
create index on public.audit_log ("record_id");
create index on public.audit_log (created_date desc);
create index on public.client ("promoter_id");
create index on public.client ("referred_by_client_id");
create index on public.client (created_date desc);
create index on public.client_group ("promoter_id");
create index on public.client_group (created_date desc);
create index on public.contact_reminder ("promoter_id");
create index on public.contact_reminder ("client_id");
create index on public.contact_reminder (created_date desc);
create index on public.credit_usage_log ("promoter_id");
create index on public.credit_usage_log (created_date desc);
create index on public.download_item ("section_id");
create index on public.download_item (created_date desc);
create index on public.event ("date");
create index on public.event (created_date desc);
create index on public.event_attendance ("event_id");
create index on public.event_attendance ("promoter_id");
create index on public.event_attendance ("client_id");
create index on public.event_attendance (created_date desc);
create index on public.ignored_instagram_chat ("promoter_id");
create index on public.ignored_instagram_chat ("conversation_id");
create index on public.ignored_instagram_chat (created_date desc);
create index on public.instagram_message ("promoter_id");
create index on public.instagram_message ("conversation_id");
create index on public.instagram_message ("sender_ig_id");
create index on public.instagram_message ("matched_semina_id");
create index on public.instagram_message ("matched_client_id");
create index on public.instagram_message (created_date desc);
create index on public.instagram_profile_snapshot ("promoter_id");
create index on public.instagram_profile_snapshot ("date");
create index on public.instagram_profile_snapshot (created_date desc);
create index on public.notification ("recipient_promoter_id");
create index on public.notification ("related_id");
create index on public.notification (created_date desc);
create index on public.programmazione_plan ("promoter_id");
create index on public.programmazione_plan (created_date desc);
create index on public.promoter ("ig_user_id");
create index on public.promoter ("referente_id");
create index on public.promoter (created_date desc);
create index on public.promoter_achievement ("promoter_id");
create index on public.promoter_achievement ("achievement_id");
create index on public.promoter_achievement (created_date desc);
create index on public.promoter_ig_token ("promoter_id");
create index on public.promoter_ig_token ("ig_user_id");
create index on public.promoter_ig_token (created_date desc);
create index on public.promoter_monthly_stats ("promoter_id");
create index on public.promoter_monthly_stats (created_date desc);
create index on public.promoter_note ("promoter_id");
create index on public.promoter_note (created_date desc);
create index on public.promoter_rank ("promoter_id");
create index on public.promoter_rank (created_date desc);
create index on public.push_subscription ("promoter_id");
create index on public.push_subscription ("user_id");
create index on public.push_subscription (created_date desc);
create index on public.recompute_lock (created_date desc);
create index on public.season_divider ("eventId");
create index on public.season_divider (created_date desc);
create index on public.semina ("promoter_id");
create index on public.semina (created_date desc);
create index on public.serata_fittizia ("date");
create index on public.serata_fittizia (created_date desc);
create index on public.venue (created_date desc);
create index on public.vibra_challenge (created_date desc);
create index on public.weekly_suggestion ("promoter_id");
create index on public.weekly_suggestion (created_date desc);

-- ===== 20261008000003_rls.sql =====
-- GENERATO da scripts/gen_schema.py - non modificare a mano.
-- AISuggestion
alter table public.ai_suggestion enable row level security;
create policy "ai_suggestion_create" on public.ai_suggestion for insert to authenticated with check (public.app_role() = 'admin');
create policy "ai_suggestion_read" on public.ai_suggestion for select to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "ai_suggestion_update" on public.ai_suggestion for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "ai_suggestion_delete" on public.ai_suggestion for delete to authenticated using (public.app_role() = 'admin');

-- Achievement
alter table public.achievement enable row level security;
create policy "achievement_create" on public.achievement for insert to authenticated with check (public.app_role() = 'admin');
create policy "achievement_read" on public.achievement for select to authenticated using (true);
create policy "achievement_update" on public.achievement for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "achievement_delete" on public.achievement for delete to authenticated using (public.app_role() = 'admin');

-- AppSettings
alter table public.app_settings enable row level security;
create policy "app_settings_create" on public.app_settings for insert to authenticated with check (public.app_role() = 'admin');
create policy "app_settings_read" on public.app_settings for select to authenticated using (true);
create policy "app_settings_update" on public.app_settings for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "app_settings_delete" on public.app_settings for delete to authenticated using (public.app_role() = 'admin');

-- AuditLog
alter table public.audit_log enable row level security;
create policy "audit_log_create" on public.audit_log for insert to authenticated with check (true);
create policy "audit_log_read" on public.audit_log for select to authenticated using (public.app_role() = 'admin');
create policy "audit_log_update" on public.audit_log for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "audit_log_delete" on public.audit_log for delete to authenticated using (public.app_role() = 'admin');

-- Client
alter table public.client enable row level security;
create policy "client_create" on public.client for insert to authenticated with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "client_read" on public.client for select to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "client_update" on public.client for update to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4')) with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "client_delete" on public.client for delete to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));

-- ClientGroup
alter table public.client_group enable row level security;
create policy "client_group_create" on public.client_group for insert to authenticated with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "client_group_read" on public.client_group for select to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "client_group_update" on public.client_group for update to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4')) with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "client_group_delete" on public.client_group for delete to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));

-- ContactReminder
alter table public.contact_reminder enable row level security;
create policy "contact_reminder_create" on public.contact_reminder for insert to authenticated with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "contact_reminder_read" on public.contact_reminder for select to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "contact_reminder_update" on public.contact_reminder for update to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id())) with check ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "contact_reminder_delete" on public.contact_reminder for delete to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));

-- CreditUsageLog
alter table public.credit_usage_log enable row level security;
create policy "credit_usage_log_create" on public.credit_usage_log for insert to authenticated with check (true);
create policy "credit_usage_log_read" on public.credit_usage_log for select to authenticated using (public.app_role() = 'admin');
create policy "credit_usage_log_update" on public.credit_usage_log for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "credit_usage_log_delete" on public.credit_usage_log for delete to authenticated using (public.app_role() = 'admin');

-- DownloadItem
alter table public.download_item enable row level security;
create policy "download_item_create" on public.download_item for insert to authenticated with check (public.app_role() = 'admin');
create policy "download_item_read" on public.download_item for select to authenticated using (true);
create policy "download_item_update" on public.download_item for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "download_item_delete" on public.download_item for delete to authenticated using (public.app_role() = 'admin');

-- Event
alter table public.event enable row level security;
create policy "event_create" on public.event for insert to authenticated with check (public.app_role() = 'admin');
create policy "event_read" on public.event for select to authenticated using (true);
create policy "event_update" on public.event for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "event_delete" on public.event for delete to authenticated using (public.app_role() = 'admin');

-- EventAttendance
alter table public.event_attendance enable row level security;
create policy "event_attendance_create" on public.event_attendance for insert to authenticated with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "event_attendance_read" on public.event_attendance for select to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "event_attendance_update" on public.event_attendance for update to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4')) with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "event_attendance_delete" on public.event_attendance for delete to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));

-- IgnoredInstagramChat
alter table public.ignored_instagram_chat enable row level security;
create policy "ignored_instagram_chat_create" on public.ignored_instagram_chat for insert to authenticated with check ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "ignored_instagram_chat_read" on public.ignored_instagram_chat for select to authenticated using ("promoter_id"::text = public.app_promoter_id());
create policy "ignored_instagram_chat_update" on public.ignored_instagram_chat for update to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id())) with check ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "ignored_instagram_chat_delete" on public.ignored_instagram_chat for delete to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));

-- InstagramMessage
alter table public.instagram_message enable row level security;
create policy "instagram_message_create" on public.instagram_message for insert to authenticated with check (public.app_role() = 'admin');
create policy "instagram_message_read" on public.instagram_message for select to authenticated using ("promoter_id"::text = public.app_promoter_id());
create policy "instagram_message_update" on public.instagram_message for update to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id())) with check ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "instagram_message_delete" on public.instagram_message for delete to authenticated using (public.app_role() = 'admin');

-- InstagramProfileSnapshot
alter table public.instagram_profile_snapshot enable row level security;
create policy "instagram_profile_snapshot_create" on public.instagram_profile_snapshot for insert to authenticated with check (public.app_role() = 'admin');
create policy "instagram_profile_snapshot_read" on public.instagram_profile_snapshot for select to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "instagram_profile_snapshot_update" on public.instagram_profile_snapshot for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "instagram_profile_snapshot_delete" on public.instagram_profile_snapshot for delete to authenticated using (public.app_role() = 'admin');

-- Notification
alter table public.notification enable row level security;
create policy "notification_create" on public.notification for insert to authenticated with check (true);
create policy "notification_read" on public.notification for select to authenticated using ((public.app_role() = 'admin' or "recipient_promoter_id"::text = public.app_promoter_id() or "recipient_promoter_id" is null));
create policy "notification_update" on public.notification for update to authenticated using ((public.app_role() = 'admin' or "recipient_promoter_id"::text = public.app_promoter_id() or "recipient_promoter_id" is null)) with check ((public.app_role() = 'admin' or "recipient_promoter_id"::text = public.app_promoter_id() or "recipient_promoter_id" is null));
create policy "notification_delete" on public.notification for delete to authenticated using ((public.app_role() = 'admin' or "recipient_promoter_id"::text = public.app_promoter_id() or "recipient_promoter_id" is null));

-- ProgrammazionePlan
alter table public.programmazione_plan enable row level security;
create policy "programmazione_plan_create" on public.programmazione_plan for insert to authenticated with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "programmazione_plan_read" on public.programmazione_plan for select to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "programmazione_plan_update" on public.programmazione_plan for update to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id())) with check ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "programmazione_plan_delete" on public.programmazione_plan for delete to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));

-- Promoter
alter table public.promoter enable row level security;
create policy "promoter_create" on public.promoter for insert to authenticated with check (public.app_role() = 'admin');
create policy "promoter_read" on public.promoter for select to authenticated using (true);
create policy "promoter_update" on public.promoter for update to authenticated using (("id"::text = public.app_promoter_id() or public.app_role() = 'admin')) with check (("id"::text = public.app_promoter_id() or public.app_role() = 'admin'));
create policy "promoter_delete" on public.promoter for delete to authenticated using (public.app_role() = 'admin');

-- PromoterAchievement
alter table public.promoter_achievement enable row level security;
create policy "promoter_achievement_create" on public.promoter_achievement for insert to authenticated with check (true);
create policy "promoter_achievement_read" on public.promoter_achievement for select to authenticated using (true);
create policy "promoter_achievement_update" on public.promoter_achievement for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "promoter_achievement_delete" on public.promoter_achievement for delete to authenticated using (public.app_role() = 'admin');

-- PromoterIGToken
alter table public.promoter_ig_token enable row level security;
create policy "promoter_ig_token_create" on public.promoter_ig_token for insert to authenticated with check (public.app_role() = 'admin');
create policy "promoter_ig_token_read" on public.promoter_ig_token for select to authenticated using (public.app_role() = 'admin');
create policy "promoter_ig_token_update" on public.promoter_ig_token for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "promoter_ig_token_delete" on public.promoter_ig_token for delete to authenticated using (public.app_role() = 'admin');

-- PromoterMonthlyStats
alter table public.promoter_monthly_stats enable row level security;
create policy "promoter_monthly_stats_create" on public.promoter_monthly_stats for insert to authenticated with check (public.app_role() = 'admin');
create policy "promoter_monthly_stats_read" on public.promoter_monthly_stats for select to authenticated using (true);
create policy "promoter_monthly_stats_update" on public.promoter_monthly_stats for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "promoter_monthly_stats_delete" on public.promoter_monthly_stats for delete to authenticated using (public.app_role() = 'admin');

-- PromoterNote
alter table public.promoter_note enable row level security;
create policy "promoter_note_create" on public.promoter_note for insert to authenticated with check (true);
create policy "promoter_note_read" on public.promoter_note for select to authenticated using (true);
create policy "promoter_note_update" on public.promoter_note for update to authenticated using (true) with check (true);
create policy "promoter_note_delete" on public.promoter_note for delete to authenticated using (true);

-- PromoterRank
alter table public.promoter_rank enable row level security;
create policy "promoter_rank_create" on public.promoter_rank for insert to authenticated with check (true);
create policy "promoter_rank_read" on public.promoter_rank for select to authenticated using (true);
create policy "promoter_rank_update" on public.promoter_rank for update to authenticated using (true) with check (true);
create policy "promoter_rank_delete" on public.promoter_rank for delete to authenticated using (public.app_role() = 'admin');

-- PushSubscription
alter table public.push_subscription enable row level security;
create policy "push_subscription_create" on public.push_subscription for insert to authenticated with check (true);
create policy "push_subscription_read" on public.push_subscription for select to authenticated using ((public.app_role() = 'admin' or "user_id"::text = auth.uid()::text));
create policy "push_subscription_update" on public.push_subscription for update to authenticated using ((public.app_role() = 'admin' or "user_id"::text = auth.uid()::text)) with check ((public.app_role() = 'admin' or "user_id"::text = auth.uid()::text));
create policy "push_subscription_delete" on public.push_subscription for delete to authenticated using ((public.app_role() = 'admin' or "user_id"::text = auth.uid()::text));

-- RecomputeLock
alter table public.recompute_lock enable row level security;
create policy "recompute_lock_create" on public.recompute_lock for insert to authenticated with check (public.app_role() = 'admin');
create policy "recompute_lock_read" on public.recompute_lock for select to authenticated using (public.app_role() = 'admin');
create policy "recompute_lock_update" on public.recompute_lock for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "recompute_lock_delete" on public.recompute_lock for delete to authenticated using (public.app_role() = 'admin');

-- SeasonDivider
alter table public.season_divider enable row level security;
create policy "season_divider_create" on public.season_divider for insert to authenticated with check (public.app_role() = 'admin');
create policy "season_divider_read" on public.season_divider for select to authenticated using (true);
create policy "season_divider_update" on public.season_divider for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "season_divider_delete" on public.season_divider for delete to authenticated using (public.app_role() = 'admin');

-- Semina
alter table public.semina enable row level security;
create policy "semina_create" on public.semina for insert to authenticated with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "semina_read" on public.semina for select to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "semina_update" on public.semina for update to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4')) with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "semina_delete" on public.semina for delete to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));

-- SerataFittizia
alter table public.serata_fittizia enable row level security;
create policy "serata_fittizia_create" on public.serata_fittizia for insert to authenticated with check ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "serata_fittizia_read" on public.serata_fittizia for select to authenticated using ((public.app_role() = 'admin' or public.app_role() = 'capogruppo' or public.app_role() = 'pr' or public.app_role() = 'super4'));
create policy "serata_fittizia_update" on public.serata_fittizia for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "serata_fittizia_delete" on public.serata_fittizia for delete to authenticated using (public.app_role() = 'admin');

-- Venue
alter table public.venue enable row level security;
create policy "venue_create" on public.venue for insert to authenticated with check (public.app_role() = 'admin');
create policy "venue_read" on public.venue for select to authenticated using (true);
create policy "venue_update" on public.venue for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "venue_delete" on public.venue for delete to authenticated using (public.app_role() = 'admin');

-- VibraChallenge
alter table public.vibra_challenge enable row level security;
create policy "vibra_challenge_create" on public.vibra_challenge for insert to authenticated with check (public.app_role() = 'admin');
create policy "vibra_challenge_read" on public.vibra_challenge for select to authenticated using (true);
create policy "vibra_challenge_update" on public.vibra_challenge for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "vibra_challenge_delete" on public.vibra_challenge for delete to authenticated using (public.app_role() = 'admin');

-- WeeklySuggestion
alter table public.weekly_suggestion enable row level security;
create policy "weekly_suggestion_create" on public.weekly_suggestion for insert to authenticated with check (public.app_role() = 'admin');
create policy "weekly_suggestion_read" on public.weekly_suggestion for select to authenticated using ((public.app_role() = 'admin' or "promoter_id"::text = public.app_promoter_id()));
create policy "weekly_suggestion_update" on public.weekly_suggestion for update to authenticated using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy "weekly_suggestion_delete" on public.weekly_suggestion for delete to authenticated using (public.app_role() = 'admin');

-- ===== 20261008000004_realtime.sql =====
-- GENERATO da scripts/gen_schema.py - non modificare a mano.
alter publication supabase_realtime add table public.notification;
alter publication supabase_realtime add table public.ai_suggestion;
alter publication supabase_realtime add table public.programmazione_plan;
alter publication supabase_realtime add table public.semina;

-- ===== permessi Data API (le regole RLS restano quelle delle migrazioni) =====
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;

-- ===== dati di prova =====
-- Dati SINTETICI di prova per un progetto Supabase vero (nessun dato reale).
-- Generato da scripts/local/seed.sql con utenti nell'Auth di Supabase: vedi scripts/gen_setup_sql.py.
-- Login di sviluppo: admin@vibra.local / pr@vibra.local / super4@vibra.local, password "vibra".
select setseed(0.42);

-- Utenti di prova nell'Auth vero di Supabase (password "vibra"), con identità email.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token)
select '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email,
  extensions.crypt('vibra', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', u.full_name), now(), now(),
  '', '', '', '', '', '', '', ''
from (values
  ('00000000-0000-0000-0000-0000000000a1'::uuid, 'admin@vibra.local', 'Admin Vibra'),
  ('00000000-0000-0000-0000-0000000000b1'::uuid, 'pr@vibra.local', 'Marco Esposito'),
  ('00000000-0000-0000-0000-0000000000c1'::uuid, 'super4@vibra.local', 'Luca Russo')) as u(id, email, full_name);

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id, u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true), 'email', now(), now(), now()
from auth.users u where u.email like '%@vibra.local';

insert into public.promoter (id, name, instagram, ruolo, status, neighborhood, city, promoter_from) values
  ('prom000000000000000001', 'Marco Esposito', 'marco.esp', 'pr', 'attivo', 'Vomero', 'Napoli', '2024-05-01'),
  ('prom000000000000000002', 'Luca Russo', 'lucarusso', 'super4', 'attivo', 'Posillipo', 'Napoli', '2023-03-15'),
  ('prom000000000000000003', 'Giulia Romano', 'giuli.r', 'capogruppo', 'attivo', 'Chiaia', 'Napoli', '2023-09-10'),
  ('prom000000000000000004', 'Andrea Ferrara', 'andrea.f', 'pr', 'inattivo', 'Fuorigrotta', 'Napoli', '2024-01-20');

update public.profiles set role = 'admin' where email = 'admin@vibra.local';
update public.profiles set role = 'pr', promoter_id = 'prom000000000000000001' where email = 'pr@vibra.local';
update public.profiles set role = 'super4', promoter_id = 'prom000000000000000002' where email = 'super4@vibra.local';

insert into public.venue (name, day_of_week, color_hex, default_threshold, sort_order) values
  ('Ammare Frontemare', 5, '#a78bfa', 300, 1),
  ('Duel Club', 6, '#38bdf8', 360, 2),
  ('Arenile', 0, '#34d399', 300, 3);

-- Serate: venerdì/sabato/domenica delle ultime 16 settimane
insert into public.event (name, date, venue, total_revenue, total_guests)
select v.name || ' ' || to_char(d, 'DD/MM'), d::date, v.name,
       round((2500 + random() * 6000)::numeric, 0), (150 + random() * 350)::int
from generate_series(current_date - 112, current_date - 1, interval '1 day') d
join public.venue v on v.day_of_week = extract(dow from d);

-- Clienti
insert into public.client (name, promoter_id, phone, instagram, source_type, is_leader, residenza_key, data_nascita)
select n.first || ' ' || n.last,
       (array['prom000000000000000001','prom000000000000000002','prom000000000000000003'])[1 + (i % 3)],
       '+39 3' || lpad((100000000 + i * 7919)::text, 9, '0'),
       lower(n.first) || '.' || lower(n.last) || i,
       (array['instagram','tiktok','direct','referred'])[1 + (i % 4)],
       i % 9 = 0,
       (array['NA_VOMERO','NA_CHIAIA','NA_POSILLIPO','NA_FUORIGROTTA','CE_CASERTA'])[1 + (i % 5)],
       (1998 + i % 8)::text || '-0' || (1 + i % 9)::text || '-1' || (i % 9)::text
from generate_series(1, 45) i
cross join lateral (select
  (array['Alessandro','Francesca','Lorenzo','Chiara','Matteo','Sofia','Gabriele','Martina','Riccardo','Aurora'])[1 + (i % 10)] as first,
  (array['Bianchi','Esposito','Russo','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Conti'])[1 + (i % 11)] as last) n;

-- Presenze: ogni cliente partecipa a circa un terzo delle serate
insert into public.event_attendance (event_id, promoter_id, client_id, present, revenue, table_number)
select e.id, c.promoter_id, c.id, true, round((80 + random() * 520)::numeric, 0), (1 + floor(random() * 40))::text
from public.event e cross join public.client c
where random() < 0.33;

-- Presenze dei promoter (client_id nullo): qui sta il fatturato del promoter per serata
insert into public.event_attendance (event_id, promoter_id, present, revenue, guadagno_pct)
select e.id, p.id, true, round((400 + random() * 1800)::numeric, 0), 10
from public.event e cross join public.promoter p
where p.status = 'attivo' and random() < 0.8;

insert into public.achievement (key, title, description, category, rarity, icon_emoji, condition_type, condition_value, sort_order) values
  ('first_client', 'Primo cliente', 'Registra il tuo primo cliente', 'clienti', 'bronzo', '🌱', 'total_clients', 1, 1),
  ('clients_25', 'Rete in crescita', 'Raggiungi 25 clienti', 'clienti', 'argento', '🌿', 'total_clients', 25, 2),
  ('revenue_10k', 'Diecimila', 'Genera 10.000 € di fatturato', 'fatturato', 'oro', '💰', 'total_revenue', 10000, 3);

insert into public.notification (type, title, message, icon, recipient_promoter_id) values
  ('system', 'Benvenuto in Vibra mobile', 'Questa è la versione nativa di prova.', '👋', null),
  ('new_event', 'Nuova serata', 'Sabato al Duel Club: prepara la lista!', '🎉', 'prom000000000000000001');

commit;
