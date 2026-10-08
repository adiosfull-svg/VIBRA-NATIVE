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
