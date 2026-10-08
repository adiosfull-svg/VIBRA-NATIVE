// GENERATO da scripts/gen_schema.py - non modificare a mano.
export type ColumnType = 'text' | 'date' | 'timestamptz' | 'double precision' | 'boolean' | 'jsonb';

export const SCHEMA = {
  "AISuggestion": {
    "columns": {
      "computed_at": "timestamptz",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "promoter_id": "text",
      "recommendations": "jsonb",
      "summary": "text",
      "updated_date": "timestamptz",
      "week_start": "date"
    },
    "table": "ai_suggestion"
  },
  "Achievement": {
    "columns": {
      "category": "text",
      "condition_type": "text",
      "condition_value": "double precision",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "description": "text",
      "icon_emoji": "text",
      "icon_url": "text",
      "id": "text",
      "is_active": "boolean",
      "key": "text",
      "rarity": "text",
      "sort_order": "double precision",
      "title": "text",
      "updated_date": "timestamptz"
    },
    "table": "achievement"
  },
  "AppSettings": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "key": "text",
      "updated_date": "timestamptz",
      "value": "text"
    },
    "table": "app_settings"
  },
  "AuditLog": {
    "columns": {
      "changed_fields": "jsonb",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "entity_name": "text",
      "id": "text",
      "new_value": "jsonb",
      "old_value": "jsonb",
      "operation_type": "text",
      "record_id": "text",
      "record_label": "text",
      "timestamp": "timestamptz",
      "updated_date": "timestamptz",
      "user_email": "text",
      "user_id": "text",
      "user_name": "text"
    },
    "table": "audit_log"
  },
  "Client": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "cum_attendance_rate": "double precision",
      "cum_avg_spent": "double precision",
      "cum_badges": "jsonb",
      "cum_ciclo_medio": "double precision",
      "cum_extra": "double precision",
      "cum_first_attendance_date": "date",
      "cum_fri": "double precision",
      "cum_last_attendance_date": "date",
      "cum_last_event_venue": "text",
      "cum_last_revenue": "double precision",
      "cum_month_trend": "double precision",
      "cum_rating": "double precision",
      "cum_sat": "double precision",
      "cum_stats_updated_at": "timestamptz",
      "cum_sun": "double precision",
      "cum_total_spent": "double precision",
      "cum_trend_pct": "double precision",
      "cum_trend_status": "text",
      "cum_venue_counts": "jsonb",
      "cum_visits": "double precision",
      "data_nascita": "text",
      "id": "text",
      "instagram": "text",
      "instagram_profile_url": "text",
      "is_driver": "boolean",
      "is_lead": "boolean",
      "is_leader": "boolean",
      "last_contacted_at": "timestamptz",
      "leader_since": "timestamptz",
      "name": "text",
      "new_people_brought": "double precision",
      "notes": "text",
      "phone": "text",
      "photo_url": "text",
      "promoter_id": "text",
      "referred_by_client_id": "text",
      "residenza_key": "text",
      "source_type": "text",
      "stato_pagante": "text",
      "tipologia_cliente": "jsonb",
      "updated_date": "timestamptz"
    },
    "table": "client"
  },
  "ClientGroup": {
    "columns": {
      "client_ids": "jsonb",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "name": "text",
      "promoter_id": "text",
      "updated_date": "timestamptz"
    },
    "table": "client_group"
  },
  "ContactReminder": {
    "columns": {
      "client_id": "text",
      "client_name": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "promoter_id": "text",
      "reminder_datetime": "timestamptz",
      "status": "text",
      "updated_date": "timestamptz"
    },
    "table": "contact_reminder"
  },
  "CreditUsageLog": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "credits": "double precision",
      "detail": "text",
      "feature": "text",
      "id": "text",
      "promoter_id": "text",
      "promoter_name": "text",
      "updated_date": "timestamptz"
    },
    "table": "credit_usage_log"
  },
  "DownloadItem": {
    "columns": {
      "bg_class": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "file_type": "text",
      "file_url": "text",
      "id": "text",
      "name": "text",
      "section_color": "text",
      "section_icon": "text",
      "section_id": "text",
      "section_label": "text",
      "updated_date": "timestamptz"
    },
    "table": "download_item"
  },
  "Event": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "date": "date",
      "id": "text",
      "is_extra": "boolean",
      "name": "text",
      "notes": "text",
      "physical_location": "text",
      "table_threshold": "double precision",
      "total_guests": "double precision",
      "total_revenue": "double precision",
      "updated_date": "timestamptz",
      "venue": "text"
    },
    "table": "event"
  },
  "EventAttendance": {
    "columns": {
      "client_id": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "event_id": "text",
      "guadagno_fuori_mano": "double precision",
      "guadagno_pct": "double precision",
      "id": "text",
      "new_people_brought": "double precision",
      "notes": "text",
      "present": "boolean",
      "promoter_id": "text",
      "revenue": "double precision",
      "table_number": "text",
      "updated_date": "timestamptz"
    },
    "table": "event_attendance"
  },
  "IgnoredInstagramChat": {
    "columns": {
      "conversation_id": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "handle": "text",
      "id": "text",
      "ignored_at": "timestamptz",
      "promoter_id": "text",
      "updated_date": "timestamptz",
      "username": "text"
    },
    "table": "ignored_instagram_chat"
  },
  "InstagramMessage": {
    "columns": {
      "conversation_id": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "is_outgoing": "boolean",
      "is_pinned": "boolean",
      "is_read": "boolean",
      "matched_client_id": "text",
      "matched_semina_id": "text",
      "message_text": "text",
      "message_timestamp": "timestamptz",
      "message_type": "text",
      "promoter_id": "text",
      "sender_handle": "text",
      "sender_ig_id": "text",
      "sender_profile_pic_url": "text",
      "sender_username": "text",
      "synced_at": "timestamptz",
      "updated_date": "timestamptz"
    },
    "table": "instagram_message"
  },
  "InstagramProfileSnapshot": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "date": "date",
      "followers": "double precision",
      "following": "double precision",
      "id": "text",
      "promoter_id": "text",
      "semine_added": "double precision",
      "updated_date": "timestamptz"
    },
    "table": "instagram_profile_snapshot"
  },
  "Notification": {
    "columns": {
      "action_url": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "icon": "text",
      "id": "text",
      "is_read": "boolean",
      "message": "text",
      "recipient_promoter_id": "text",
      "related_id": "text",
      "title": "text",
      "type": "text",
      "updated_date": "timestamptz"
    },
    "table": "notification"
  },
  "ProgrammazionePlan": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "plan": "jsonb",
      "promoter_id": "text",
      "updated_date": "timestamptz"
    },
    "table": "programmazione_plan"
  },
  "Promoter": {
    "columns": {
      "accordi_per_locale": "jsonb",
      "address": "text",
      "city": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "cum_ach_by_rarity": "jsonb",
      "cum_ach_total": "double precision",
      "cum_ach_unlocked": "double precision",
      "cum_geo_zone_counts": "jsonb",
      "cum_month_revenue": "double precision",
      "cum_stats_updated_at": "timestamptz",
      "cum_total_clients": "double precision",
      "cum_total_earnings": "double precision",
      "cum_total_presences": "double precision",
      "cum_total_revenue": "double precision",
      "cum_total_tables": "double precision",
      "cum_vibra_vs_current_streak": "double precision",
      "cum_vibra_vs_monthly_win": "double precision",
      "cum_vibra_vs_weekly_streak": "double precision",
      "cum_vibra_vs_weekly_wins": "double precision",
      "cum_week_revenue": "double precision",
      "cum_week_tables": "double precision",
      "goals": "jsonb",
      "id": "text",
      "ig_connected_at": "timestamptz",
      "ig_followers_synced": "double precision",
      "ig_following_synced": "double precision",
      "ig_name_synced": "text",
      "ig_profile_pic_url": "text",
      "ig_profile_synced_at": "timestamptz",
      "ig_user_id": "text",
      "ig_username_synced": "text",
      "instagram": "text",
      "instagram_followers": "double precision",
      "instagram_following": "double precision",
      "lat": "double precision",
      "lng": "double precision",
      "name": "text",
      "neighborhood": "text",
      "notes": "text",
      "phone": "text",
      "photo_offset_x": "double precision",
      "photo_offset_y": "double precision",
      "photo_url": "text",
      "photo_zoom": "double precision",
      "promoter_from": "date",
      "province_area": "text",
      "referente_id": "text",
      "ruolo": "text",
      "show_in_stats": "boolean",
      "status": "text",
      "updated_date": "timestamptz"
    },
    "table": "promoter"
  },
  "PromoterAchievement": {
    "columns": {
      "achievement_id": "text",
      "achievement_key": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "promoter_id": "text",
      "unlocked_at": "timestamptz",
      "updated_date": "timestamptz"
    },
    "table": "promoter_achievement"
  },
  "PromoterIGToken": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "ig_access_token": "text",
      "ig_connected_at": "timestamptz",
      "ig_user_id": "text",
      "promoter_id": "text",
      "updated_date": "timestamptz"
    },
    "table": "promoter_ig_token"
  },
  "PromoterMonthlyStats": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "month": "text",
      "promoter_id": "text",
      "revenue": "double precision",
      "tables": "double precision",
      "updated_date": "timestamptz"
    },
    "table": "promoter_monthly_stats"
  },
  "PromoterNote": {
    "columns": {
      "color": "text",
      "content": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "display_order": "double precision",
      "id": "text",
      "pinned": "boolean",
      "promoter_id": "text",
      "title": "text",
      "updated_date": "timestamptz"
    },
    "table": "promoter_note"
  },
  "PromoterRank": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "promoter_id": "text",
      "rank_key": "text",
      "updated_date": "timestamptz"
    },
    "table": "promoter_rank"
  },
  "PushSubscription": {
    "columns": {
      "auth": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "endpoint": "text",
      "id": "text",
      "p256dh": "text",
      "promoter_id": "text",
      "updated_date": "timestamptz",
      "user_agent": "text",
      "user_id": "text"
    },
    "table": "push_subscription"
  },
  "RecomputeLock": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "key": "text",
      "token": "text",
      "updated_date": "timestamptz"
    },
    "table": "recompute_lock"
  },
  "SeasonDivider": {
    "columns": {
      "color": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "eventId": "text",
      "id": "text",
      "label": "text",
      "updated_date": "timestamptz"
    },
    "table": "season_divider"
  },
  "Semina": {
    "columns": {
      "ai_data": "jsonb",
      "ai_extracted_at": "timestamptz",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "display_order": "double precision",
      "eta": "double precision",
      "id": "text",
      "instagram": "text",
      "instagram_profile_url": "text",
      "is_off": "boolean",
      "last_contacted_at": "timestamptz",
      "name": "text",
      "notes": "text",
      "phone": "text",
      "photo_url": "text",
      "platform": "text",
      "promoter_id": "text",
      "provenienza": "text",
      "recettivita": "double precision",
      "status": "text",
      "tiktok": "text",
      "tiktok_profile_url": "text",
      "updated_date": "timestamptz"
    },
    "table": "semina"
  },
  "SerataFittizia": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "date": "date",
      "id": "text",
      "name": "text",
      "updated_date": "timestamptz"
    },
    "table": "serata_fittizia"
  },
  "User": {
    "columns": {
      "created_date": "timestamptz",
      "email": "text",
      "full_name": "text",
      "id": "text",
      "legacy_id": "text",
      "promoter_id": "text",
      "role": "text",
      "updated_date": "timestamptz"
    },
    "table": "profiles"
  },
  "Venue": {
    "columns": {
      "color_hex": "text",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "day_of_week": "double precision",
      "default_threshold": "double precision",
      "id": "text",
      "is_active": "boolean",
      "is_extra": "boolean",
      "logo_key": "text",
      "name": "text",
      "season_label": "text",
      "show_in_prospetto": "boolean",
      "sort_order": "double precision",
      "updated_date": "timestamptz"
    },
    "table": "venue"
  },
  "VibraChallenge": {
    "columns": {
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "description": "text",
      "end_date": "date",
      "id": "text",
      "is_active": "boolean",
      "manual_scores": "jsonb",
      "metric_type": "text",
      "participant_ids": "jsonb",
      "prize": "text",
      "start_date": "date",
      "title": "text",
      "updated_date": "timestamptz"
    },
    "table": "vibra_challenge"
  },
  "WeeklySuggestion": {
    "columns": {
      "computed_at": "timestamptz",
      "created_by": "text",
      "created_by_id": "text",
      "created_date": "timestamptz",
      "id": "text",
      "promoter_id": "text",
      "suggestions": "jsonb",
      "updated_date": "timestamptz",
      "week_start": "date"
    },
    "table": "weekly_suggestion"
  }
} as const satisfies Record<string, { table: string; columns: Record<string, ColumnType> }>;

export type EntityName = keyof typeof SCHEMA;
