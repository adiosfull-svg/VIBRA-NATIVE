-- Test delle policy RLS generate. Ogni blocco simula un utente diverso.
-- Un assert fallito interrompe lo script (ON_ERROR_STOP).
\o /dev/null

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@test'),
  ('00000000-0000-0000-0000-00000000000b', 'pr1@test'),
  ('00000000-0000-0000-0000-00000000000c', 'pr2@test');
update public.profiles set role = 'admin' where email = 'admin@test';
update public.profiles set role = 'pr', promoter_id = 'p1' where email = 'pr1@test';
update public.profiles set role = 'pr', promoter_id = 'p2' where email = 'pr2@test';

insert into public.promoter (id, name) values ('p1', 'Uno'), ('p2', 'Due');
insert into public.client (name, promoter_id) values ('Cliente A', 'p1'), ('Cliente B', 'p2');
insert into public.contact_reminder (promoter_id, client_id, reminder_datetime)
  values ('p1', 'x', now()), ('p2', 'y', now());
insert into public.notification (type, title, message, recipient_promoter_id)
  values ('system', 'a tutti', 'm', null), ('system', 'a p1', 'm', 'p1'), ('system', 'a p2', 'm', 'p2');
insert into public.event (name, date) values ('Sabato', '2026-10-03');

create function pg_temp.check(ok boolean, msg text) returns void language plpgsql as
  $$ begin if not ok then raise exception 'FALLITO: %', msg; end if; end $$;

-- PR 1
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
select pg_temp.check((select count(*) from public.client) = 2, 'pr vede tutti i clienti (come su Base44)');
select pg_temp.check((select count(*) from public.contact_reminder) = 1, 'pr vede solo i propri promemoria');
select pg_temp.check((select count(*) from public.notification) = 2, 'pr vede broadcast + proprie notifiche');
select pg_temp.check((select count(*) from public.audit_log) = 0, 'pr non legge audit log');
select pg_temp.check((select count(*) from public.profiles) = 1, 'pr vede solo il proprio profilo');
do $$ begin
  insert into public.event (name, date) values ('X', '2026-10-04');
  raise exception 'FALLITO: pr non deve creare serate';
exception when insufficient_privilege then null;
end $$;
-- un pr non può promuoversi admin
do $$ begin
  update public.profiles set role = 'admin' where id = auth.uid();
  raise exception 'FALLITO: pr si è promosso admin';
exception when insufficient_privilege then null;
end $$;
reset role;
select pg_temp.check((select role from public.profiles where email = 'pr1@test') = 'pr', 'pr non cambia il proprio ruolo');

-- Promoter: il pr aggiorna solo il proprio record
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
update public.promoter set notes = 'mio' where id in ('p1', 'p2');
reset role;
select pg_temp.check((select count(*) from public.promoter where notes = 'mio') = 1, 'pr aggiorna solo il proprio promoter');

-- Admin
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select pg_temp.check((select count(*) from public.contact_reminder) = 2, 'admin vede tutti i promemoria');
insert into public.event (name, date) values ('Domenica', '2026-10-04');
select pg_temp.check((select count(*) from public.profiles) = 3, 'admin vede tutti i profili');
select pg_temp.check((select created_by_id from public.event where name = 'Domenica') = '00000000-0000-0000-0000-00000000000a', 'created_by_id automatico');
select pg_temp.check(length((select id from public.event where name = 'Domenica')) = 24, 'id stile Base44');
reset role;
