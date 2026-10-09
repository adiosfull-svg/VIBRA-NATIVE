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
