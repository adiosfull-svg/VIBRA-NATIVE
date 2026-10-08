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
