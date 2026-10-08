#!/usr/bin/env python3
"""Converte un export JSON dei dati Base44 in SQL per il nuovo database Supabase.

Uso:  python3 scripts/import_base44.py <cartella_export> > import.sql
      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f import.sql

<cartella_export> contiene un file <Entità>.json per entità (array di record così come
li restituisce Base44, campi built-in compresi). L'export si fa in SOLA LETTURA:
nessuna scrittura avviene su Base44.

Cosa fa:
  - tiene solo le colonne esistenti nella tabella (scarta es. is_sample);
  - normalizza i valori che Postgres rifiuterebbe ('' in date/numeri, date senza fuso);
  - fa upsert per id (rieseguibile: un secondo import aggiorna i record);
  - User.json non diventa una tabella: produce gli update di public.profiles per email
    (gli account vanno prima creati/invitati in Supabase Auth, vedi docs/MIGRAZIONE.md)
    e rimappa created_by_id dagli id utente Base44 ai nuovi id Supabase.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMA = json.load(open(os.path.join(ROOT, "schema", "schema.json")))
CHUNK = 500
TZ_RE = re.compile(r"(Z|[+-]\d{2}:?\d{2})$")


def coerce(ctype, value):
    if value is None:
        return None
    if ctype == "double precision":
        if value == "" or isinstance(value, bool):
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None
    if ctype == "boolean":
        if value == "":
            return None
        return value is True or value == "true" or value == 1
    if ctype == "date":
        if not isinstance(value, str) or not re.match(r"^\d{4}-\d{2}-\d{2}", value):
            return None
        return value[:10]
    if ctype == "timestamptz":
        if not isinstance(value, str) or not value.strip():
            return None
        return value if TZ_RE.search(value) else value + "Z"  # Base44 salva in UTC senza fuso
    if ctype == "jsonb":
        return value
    return value if isinstance(value, str) else json.dumps(value) if isinstance(value, (dict, list)) else str(value)


def clean(entity, row, now):
    cols = SCHEMA[entity]["columns"]
    out = {k: coerce(cols[k], v) for k, v in row.items() if k in cols}
    # jsonb_populate_recordset non applica i default: le date di sistema vanno sempre valorizzate
    out["created_date"] = out.get("created_date") or now
    out["updated_date"] = out.get("updated_date") or out["created_date"]
    return out, sorted(set(row) - set(cols))


def dollar_quote(text):
    tag = "j"
    while f"${tag}$" in text:
        tag += "j"
    return f"${tag}${text}${tag}$"


def upsert_sql(table, columns, rows):
    cols = ", ".join(f'"{c}"' for c in columns)
    updates = ", ".join(f'"{c}" = excluded."{c}"' for c in columns if c != "id")
    payload = dollar_quote(json.dumps(rows, ensure_ascii=False))
    return (
        f"insert into public.{table} ({cols})\n"
        f"select {cols} from jsonb_populate_recordset(null::public.{table}, {payload}::jsonb)\n"
        f"on conflict (id) do update set {updates};\n"
    )


def main(export_dir):
    out = ["-- GENERATO da scripts/import_base44.py", "begin;"]
    report = []
    users = None
    now = datetime.now(timezone.utc).isoformat()
    for fn in sorted(os.listdir(export_dir)):
        if not fn.endswith(".json"):
            continue
        entity = fn[:-5]
        rows = json.load(open(os.path.join(export_dir, fn)))
        if entity == "User":
            users = rows
            continue
        if entity not in SCHEMA:
            report.append(f"{entity}: entità sconosciuta, ignorata")
            continue
        table = SCHEMA[entity]["table"]
        cleaned, dropped = [], set()
        for r in rows:
            c, d = clean(entity, r, now)
            cleaned.append(c)
            dropped.update(d)
        columns = sorted(SCHEMA[entity]["columns"])
        for i in range(0, len(cleaned), CHUNK):
            out.append(upsert_sql(table, columns, cleaned[i:i + CHUNK]))
        report.append(f"{entity}: {len(cleaned)} record" + (f" (campi scartati: {', '.join(sorted(dropped))})" if dropped else ""))

    if users is not None:
        out.append("-- Utenti: aggiorna i profili già creati in Supabase Auth (match per email)")
        for u in users:
            if not u.get("email"):
                continue
            role = u.get("role") if u.get("role") in ("admin", "super4", "capogruppo", "pr") else "pr"
            vals = {"role": role, "promoter_id": u.get("promoter_id"), "legacy_id": u["id"], "full_name": u.get("full_name") or ""}
            sets = ", ".join(f"{k} = {sql_lit(v)}" for k, v in vals.items())
            out.append(f"update public.profiles set {sets} where lower(email) = lower({sql_lit(u['email'])});")
        out.append("-- created_by_id: da id utente Base44 a id Supabase")
        for entity in SCHEMA:
            if entity == "User":
                continue
            t = SCHEMA[entity]["table"]
            out.append(f"update public.{t} x set created_by_id = p.id::text from public.profiles p where x.created_by_id = p.legacy_id;")
        report.append(f"User: {len(users)} utenti (profili aggiornati per email)")

    out.append("commit;")
    print("\n".join(out))
    print("\n".join(f"  {r}" for r in report), file=sys.stderr)


def sql_lit(v):
    if v is None:
        return "null"
    return "'" + str(v).replace("'", "''") + "'"


if __name__ == "__main__":
    main(sys.argv[1])
