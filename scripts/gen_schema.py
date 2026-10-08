#!/usr/bin/env python3
"""Genera le migrazioni Postgres/Supabase dalle definizioni entità Base44.

Uso:  python3 scripts/gen_schema.py schema/entities supabase/migrations

Legge ogni <Entity>.jsonc e produce:
  - *_base.sql           profili utente, helper di ruolo, trigger updated_date
  - *_tables.sql       una tabella per entità (colonne JSON-compatibili)
  - *_rls.sql             policy Row-Level Security tradotte dalle regole Base44
  - *_realtime.sql   tabelle pubblicate su Supabase Realtime
Rigenerare il file sovrascrive l'output: non modificare a mano i .sql generati.
"""
import json
import os
import re
import sys

# Entità che il frontend ascolta con .subscribe() -> Realtime
REALTIME = ["Notification", "AISuggestion", "ProgrammazionePlan", "Semina"]

# Mappa ruolo/promoter dell'utente Base44 -> funzioni SQL
USER_VARS = {
    "{{user.id}}": "auth.uid()::text",
    "{{user.email}}": "public.app_email()",
    "{{user.role}}": "public.app_role()",
    "{{user.data.promoter_id}}": "public.app_promoter_id()",
}


def load_jsonc(path):
    text = open(path, encoding="utf-8").read()
    text = re.sub(r"(?m)^\s*//.*$", "", text)
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    return json.loads(text)


def snake(name):
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s).lower()


def table_name(entity):
    return snake(entity)


def qi(ident):
    return '"' + ident.replace('"', '""') + '"'


def ql(value):
    return "'" + str(value).replace("'", "''") + "'"


def col_type(spec):
    t = spec.get("type")
    fmt = spec.get("format")
    if t == "string":
        if fmt == "date-time":
            return "timestamptz"
        if fmt == "date":
            return "date"
        return "text"
    if t in ("number", "integer"):
        return "double precision"
    if t == "boolean":
        return "boolean"
    return "jsonb"  # object / array / non tipizzato


def col_default(spec, sqltype):
    if "default" not in spec:
        return ""
    d = spec["default"]
    if sqltype == "jsonb":
        return " default " + ql(json.dumps(d)) + "::jsonb"
    if isinstance(d, bool):
        return " default " + ("true" if d else "false")
    if isinstance(d, (int, float)):
        return " default " + repr(d)
    return " default " + ql(d)


# ---------- RLS ----------

def value_sql(v):
    if v is None:
        return None
    if isinstance(v, str) and v in USER_VARS:
        return USER_VARS[v]
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    return ql(v)


def field_ref(key, columns):
    # Base44: i campi custom usano il prefisso "data.", i built-in no.
    name = key[5:] if key.startswith("data.") else key
    if name not in columns:
        raise ValueError(f"campo RLS sconosciuto: {key}")
    return qi(name), columns[name]


def rule_sql(rule, columns):
    if rule is None or rule == {}:
        return "true"
    parts = []
    for key, val in rule.items():
        if key in ("$or", "$and"):
            subs = [rule_sql(r, columns) for r in val]
            joiner = " or " if key == "$or" else " and "
            parts.append("(" + joiner.join(subs) + ")")
        elif key == "user_condition":
            for ukey, uval in val.items():
                fn = {"role": "public.app_role()", "email": "public.app_email()",
                      "id": "auth.uid()::text"}.get(ukey)
                if fn is None:
                    raise ValueError(f"user_condition non gestita: {ukey}")
                parts.append(f"{fn} = {ql(uval)}")
        else:
            ref, ctype = field_ref(key, columns)
            if isinstance(val, dict):
                if set(val) == {"$in"}:
                    vals = ", ".join(value_sql(x) for x in val["$in"])
                    parts.append(f"{ref} in ({vals})")
                else:
                    raise ValueError(f"operatore non gestito: {val}")
            elif val is None:
                parts.append(f"{ref} is null")
            else:
                parts.append(f"{ref}::text = {value_sql(val)}")
    return parts[0] if len(parts) == 1 else "(" + " and ".join(parts) + ")"


def policies(entity, table, rls, columns):
    out = [f"alter table public.{table} enable row level security;"]
    for op in ("create", "read", "update", "delete"):
        cond = rule_sql(rls.get(op) if rls else None, columns)
        name = qi(f"{table}_{op}")
        if op == "create":
            out.append(f"create policy {name} on public.{table} for insert to authenticated with check ({cond});")
        elif op == "read":
            out.append(f"create policy {name} on public.{table} for select to authenticated using ({cond});")
        elif op == "update":
            out.append(f"create policy {name} on public.{table} for update to authenticated using ({cond}) with check ({cond});")
        else:
            out.append(f"create policy {name} on public.{table} for delete to authenticated using ({cond});")
    return "\n".join(out)


BASE_SQL = """-- GENERATO da scripts/gen_schema.py - non modificare a mano.
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
"""


def main(src, dst):
    entities = {}
    for fn in sorted(os.listdir(src)):
        if fn.endswith(".jsonc"):
            spec = load_jsonc(os.path.join(src, fn))
            entities[spec.get("name") or fn[:-6]] = spec
    entities.pop("User", None)  # gestita da public.profiles

    tables, rls_out, index_out = [], [], []
    app_schema = {}
    for name, spec in entities.items():
        table = table_name(name)
        props = spec.get("properties", {})
        cols = [
            "  id text primary key default public.new_id()",
            "  created_date timestamptz not null default now()",
            "  updated_date timestamptz not null default now()",
            "  created_by_id text default auth.uid()::text",
            "  created_by text default public.app_email()",
        ]
        coltypes = {"id": "text", "created_date": "timestamptz", "updated_date": "timestamptz",
                    "created_by_id": "text", "created_by": "text"}
        for field, fspec in props.items():
            ctype = col_type(fspec)
            coltypes[field] = ctype
            # "required" in Base44 è solo una validazione in scrittura: i dati storici possono non
            # rispettarla, quindi niente NOT NULL (lo garantiscono i form dell'app, come prima).
            cols.append(f"  {qi(field)} {ctype}{col_default(fspec, ctype)}")
        app_schema[name] = {"table": table, "columns": coltypes}
        tables.append(
            f"-- {name}: {spec.get('description', '')}".rstrip(": ") + "\n"
            f"create table public.{table} (\n" + ",\n".join(cols) + "\n);\n"
            f"create trigger {table}_touch before update on public.{table}\n"
            f"  for each row execute function public.touch_updated_date();\n"
            f"comment on table public.{table} is {ql('Entità Base44 ' + name)};"
        )
        for field, ctype in coltypes.items():
            if (field.endswith("_id") and field not in ("id", "created_by_id")) or field in ("date", "eventId"):
                index_out.append(f"create index on public.{table} ({qi(field)});")
        index_out.append(f"create index on public.{table} (created_date desc);")
        rls_out.append(f"-- {name}\n" + policies(name, table, spec.get("rls"), coltypes))

    os.makedirs(dst, exist_ok=True)
    header = "-- GENERATO da scripts/gen_schema.py - non modificare a mano.\n"
    open(os.path.join(dst, "20261008000001_base.sql"), "w").write(BASE_SQL)
    open(os.path.join(dst, "20261008000002_tables.sql"), "w").write(
        header + "\n\n".join(tables) + "\n\n" + "\n".join(index_out) + "\n")
    open(os.path.join(dst, "20261008000003_rls.sql"), "w").write(header + "\n\n".join(rls_out) + "\n")
    rt = [f"alter publication supabase_realtime add table public.{table_name(e)};" for e in REALTIME]
    open(os.path.join(dst, "20261008000004_realtime.sql"), "w").write(header + "\n".join(rt) + "\n")

    # Schema per l'adapter dati dell'app (colonne e tipi di ogni entità).
    app_schema["User"] = {"table": "profiles", "columns": {
        "id": "text", "email": "text", "full_name": "text", "role": "text", "promoter_id": "text",
        "legacy_id": "text", "created_date": "timestamptz", "updated_date": "timestamptz"}}
    # Stesso schema in JSON per gli script (import dati).
    open(os.path.join(os.path.dirname(src.rstrip("/")), "schema.json"), "w").write(
        json.dumps(app_schema, indent=2, sort_keys=True) + "\n")
    app_file = os.path.join(os.path.dirname(src.rstrip("/")), "..", "app", "src", "lib", "schema.generated.ts")
    os.makedirs(os.path.dirname(app_file), exist_ok=True)
    open(app_file, "w").write(
        "// GENERATO da scripts/gen_schema.py - non modificare a mano.\n"
        "export type ColumnType = 'text' | 'date' | 'timestamptz' | 'double precision' | 'boolean' | 'jsonb';\n\n"
        "export const SCHEMA = " + json.dumps(app_schema, indent=2, sort_keys=True) +
        " as const satisfies Record<string, { table: string; columns: Record<string, ColumnType> }>;\n\n"
        "export type EntityName = keyof typeof SCHEMA;\n")
    print(f"{len(entities)} entità -> {dst}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
