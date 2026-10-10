#!/usr/bin/env python3
"""Esporta lo storico `usage.json` come righe per la dashboard (una riga per chiamata al modello)."""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "calls.json")
rows = []
for p in json.load(open(os.path.join(HERE, "usage.json"), encoding="utf-8")):
    for i, c in enumerate(p["calls"], 1):
        rows.append({
            "call_id": f"{p['id']}-{i:03d}", "prompt_id": p["id"], "step": i,
            "at": p["at"], "prompt": p["prompt"], "model": c["model"], "subagent": c["sub"],
            "input": c["input"], "cache_write_5m": c["cw5m"], "cache_write_1h": c["cw1h"],
            "cache_read": c["cread"], "output": c["output"], "thinking": c["thinking"],
        })
json.dump(rows, open(out, "w", encoding="utf-8"), ensure_ascii=False)
print(len(rows), "righe ->", out)
