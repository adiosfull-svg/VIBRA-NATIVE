#!/usr/bin/env python3
"""Raccoglie il consumo di token delle sessioni Claude Code su questo progetto.

Legge i transcript (~/.claude/projects/*/*.jsonl), raggruppa le chiamate al modello
per prompt dell'utente (i passi automatici che seguono un prompt contano per quel
prompt) e unisce il risultato nello storico `usage.json` accanto a questo file,
così i consumi restano anche quando il container della sessione viene eliminato.

Uso: python3 tools/token-usage/collect.py [cartella transcript]
"""
import glob
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "usage.json")
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/.claude/projects")


def user_text(msg):
    c = msg.get("content")
    if isinstance(c, str):
        return c
    if isinstance(c, list):
        texts = [b.get("text", "") for b in c if isinstance(b, dict) and b.get("type") == "text"]
        if texts and not any(isinstance(b, dict) and b.get("type") == "tool_result" for b in c):
            return " ".join(texts)
    return None


def parse(path):
    session = os.path.splitext(os.path.basename(path))[0]
    prompts, cur, seen = [], None, set()
    for line in open(path, encoding="utf-8"):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        m = d.get("message") if isinstance(d.get("message"), dict) else {}
        if d.get("type") == "user" and not d.get("isMeta") and not d.get("isSidechain"):
            t = user_text(m)
            if t and not t.lstrip().startswith("<"):
                cur = {
                    "id": f"{session[:8]}-{len(prompts) + 1:03d}",
                    "session": session[:8],
                    "at": d.get("timestamp"),
                    "prompt": " ".join(t.split())[:90],
                    "calls": [],
                }
                prompts.append(cur)
        elif d.get("type") == "assistant" and cur is not None:
            u = m.get("usage") or {}
            key = m.get("id") or d.get("requestId")
            if not u or key in seen:
                continue
            seen.add(key)
            cc = u.get("cache_creation") or {}
            cur["calls"].append({
                "model": m.get("model", ""),
                "sub": bool(d.get("isSidechain")),
                "input": u.get("input_tokens", 0),
                "cw5m": cc.get("ephemeral_5m_input_tokens", 0),
                "cw1h": cc.get("ephemeral_1h_input_tokens", u.get("cache_creation_input_tokens", 0) if not cc else 0),
                "cread": u.get("cache_read_input_tokens", 0),
                "output": u.get("output_tokens", 0),
                "thinking": (u.get("output_tokens_details") or {}).get("thinking_tokens", 0),
            })
    return [p for p in prompts if p["calls"]]


def main():
    store = {}
    if os.path.exists(OUT):
        for p in json.load(open(OUT, encoding="utf-8")):
            store[p["id"]] = p
    for path in sorted(glob.glob(os.path.join(SRC, "*", "*.jsonl"))):
        for p in parse(path):
            store[p["id"]] = p
    rows = sorted(store.values(), key=lambda p: p["at"] or "")
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)
    print(f"{len(rows)} prompt, {sum(len(p['calls']) for p in rows)} chiamate -> {OUT}")


if __name__ == "__main__":
    main()
