#!/usr/bin/env python3
"""Mock test for generate_factors_snapshot — validates classify/verdict/matrix/alerts logic.

Sandbox network restrictions block real fetches, so this monkey-patches the three
fetch_* functions with canned data covering each market-state path, runs the full
build_snapshot pipeline, and asserts the output shape and verdict mapping.
"""

from __future__ import annotations

import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import generate_factors_snapshot as gf


SEED = json.loads((ROOT / "data" / "factors_seed.json").read_text(encoding="utf-8"))


def _tnx_series(end: float, start: float, days: int = 25) -> list[tuple[str, float]]:
    """Build a synthetic FRED-style series ramping start→end over `days` points."""
    pts = []
    base = date(2026, 5, 1)
    for i in range(days):
        d = base + timedelta(days=i)
        frac = i / (days - 1)
        v = start + (end - start) * frac
        pts.append((d.isoformat(), round(v, 3)))
    return pts


def _nvda(cur: float, prev_q: float, yoy_q: float, period="2026-04-26") -> dict:
    return {"cur": cur, "prev_q": prev_q, "yoy_q": yoy_q,
            "yoy": (cur - yoy_q) / yoy_q * 100,
            "qoq": (cur - prev_q) / prev_q * 100,
            "period": period, "filing": "2026-05-29",
            "fiscal": gf._fiscal_label(period)}


def _eps(latest: float, base: float, latest_dt: date, base_dt: date) -> dict:
    return {"latest_v": latest, "latest_dt": latest_dt,
            "base_v": base, "base_dt": base_dt,
            "yoy": (latest - base) / base * 100}


# Each case pins (tnx_dir, eps_dir, nvda_dir) → expected state.
CASES = [
    # (label, tnx_series, nvda_dict, eps_dict, expected_state, expected_tone)
    ("主升牛市", _tnx_series(4.20, 4.55), _nvda(26000, 22600, 18760), _eps(240.0, 200.0, date(2026,5,1), date(2025,5,1)), "主升牛市", "bull"),
    ("扩散牛市", _tnx_series(4.10, 4.30), _nvda(22000, 22600, 14000), _eps(230.0, 210.0, date(2026,5,1), date(2025,5,1)), "扩散牛市", "bull"),
    ("震荡偏强", _tnx_series(4.60, 4.35), _nvda(26000, 25800, 18760), _eps(225.0, 205.0, date(2026,5,1), date(2025,5,1)), "震荡偏强", "chop"),
    ("主跌熊市", _tnx_series(4.65, 4.35), _nvda(18000, 22000, 14000), _eps(190.0, 210.0, date(2026,5,1), date(2025,5,1)), "主跌熊市", "bear"),
    ("防御熊",   _tnx_series(4.00, 4.30), _nvda(18000, 22000, 14000), _eps(190.0, 210.0, date(2026,5,1), date(2025,5,1)), "防御熊",   "bear"),
    ("震荡市",   _tnx_series(4.30, 4.31), _nvda(22000, 21600, 18760), _eps(200.0, 200.0, date(2026,5,1), date(2025,5,1)), "震荡市",   "chop"),
]


REQUIRED_INDICATOR_KEYS = {"label", "name", "value", "direction", "directionText",
                           "delta", "meter", "meterScale", "light", "hint", "source"}


def run_one(case: tuple) -> tuple[bool, str]:
    label, tnx_series, nvda_dict, eps_dict, expected_state, expected_tone = case
    gf.fetch_dgs10_series = lambda: tnx_series        # type: ignore
    gf.fetch_nvda_datacenter = lambda: nvda_dict      # type: ignore
    gf.fetch_spx_eps = lambda: eps_dict              # type: ignore

    snap = gf.build_snapshot(SEED)

    problems = []

    # Top-level shape
    for key in ("updatedAt", "date", "headline", "verdict", "indicators",
                "alerts", "matrix", "pace", "sourceNote"):
        if key not in snap:
            problems.append(f"missing top key: {key}")

    # Verdict
    v = snap["verdict"]
    if v.get("state") != expected_state:
        problems.append(f"verdict.state={v.get('state')!r} expected {expected_state!r}")
    if v.get("tone") != expected_tone:
        problems.append(f"verdict.tone={v.get('tone')!r} expected {expected_tone!r}")
    for key in ("light", "title", "state", "tone", "action", "confidence", "desc"):
        if key not in v:
            problems.append(f"verdict missing {key}")

    # Indicators
    ind = snap["indicators"]
    for name in ("tnx", "nvda", "eps"):
        if name not in ind:
            problems.append(f"indicators missing {name}")
            continue
        missing = REQUIRED_INDICATOR_KEYS - set(ind[name])
        if missing:
            problems.append(f"indicator {name} missing {missing}")
        # meter in [0,100]
        m = ind[name].get("meter")
        if not isinstance(m, int) or not 0 <= m <= 100:
            problems.append(f"indicator {name} meter={m!r} out of range")
        # direction value legal
        if ind[name].get("direction") not in {"up", "down", "flat", "speed", "slow", "hold"}:
            problems.append(f"indicator {name} direction={ind[name].get('direction')!r}")

    # Alerts
    alerts = snap["alerts"]
    if len(alerts) != 2:
        problems.append(f"expected 2 alerts, got {len(alerts)}")
    for a in alerts:
        for key in ("id", "title", "detail", "triggered", "status"):
            if key not in a:
                problems.append(f"alert {a.get('id')} missing {key}")
        if a.get("status") not in ("触发", "未触发"):
            problems.append(f"alert {a.get('id')} status={a.get('status')!r}")

    # Matrix
    rows = snap["matrix"]
    if len(rows) != 6:
        problems.append(f"expected 6 matrix rows, got {len(rows)}")
    active = [r for r in rows if r.get("active")]
    if len(active) != 1:
        problems.append(f"expected exactly 1 active matrix row, got {len(active)}")
    elif active[0]["state"] != expected_state:
        problems.append(f"active row={active[0]['state']!r} expected {expected_state!r}")

    # JSON serializable
    try:
        json.dumps(snap, ensure_ascii=False)
    except TypeError as e:
        problems.append(f"not JSON serializable: {e}")

    ok = not problems
    return ok, "; ".join(problems) if problems else "ok"


def main() -> int:
    all_ok = True
    for case in CASES:
        ok, msg = run_one(case)
        mark = "PASS" if ok else "FAIL"
        print(f"[{mark}] {case[0]:6s} → {msg}")
        if not ok:
            all_ok = False

    # Alert-trigger path sanity: 主跌熊市 should fire alert #1 (NVDA slow + EPS down)
    gf.fetch_dgs10_series = lambda: _tnx_series(4.65, 4.35)
    gf.fetch_nvda_datacenter = lambda: _nvda(18000, 22000, 14000)
    gf.fetch_spx_eps = lambda: _eps(190.0, 210.0, date(2026,5,1), date(2025,5,1))
    snap = gf.build_snapshot(SEED)
    a1 = next(a for a in snap["alerts"] if a["id"] == "top1")
    if a1["triggered"]:
        print(f"[PASS] alert#1 triggered in 主跌熊市")
    else:
        print(f"[FAIL] alert#1 not triggered in 主跌熊市 (expected triggered)")
        all_ok = False

    # Alert-trigger #2: TNX up + >= warnThreshold + EPS not up
    gf.fetch_dgs10_series = lambda: _tnx_series(4.75, 4.50)  # up, value 4.75 >= 4.70
    gf.fetch_nvda_datacenter = lambda: _nvda(22000, 21600, 18760)
    gf.fetch_spx_eps = lambda: _eps(200.0, 205.0, date(2026,5,1), date(2025,5,1))  # eps down
    snap = gf.build_snapshot(SEED)
    a2 = next(a for a in snap["alerts"] if a["id"] == "top2")
    if a2["triggered"]:
        print(f"[PASS] alert#2 triggered when TNX>=warn + EPS not up")
    else:
        print(f"[FAIL] alert#2 not triggered (TNX={snap['indicators']['tnx']['value']})")
        all_ok = False

    # Tolerance: main() preserves old snapshot when fetch fails
    out = ROOT / "data" / "factors-latest.json"
    if out.exists():
        original = out.read_text(encoding="utf-8")
        gf.fetch_dgs10_series = lambda: (_ for _ in ()).throw(RuntimeError("simulated"))
        gf.fetch_nvda_datacenter = lambda: (_ for _ in ()).throw(RuntimeError("simulated"))
        gf.fetch_spx_eps = lambda: (_ for _ in ()).throw(RuntimeError("simulated"))
        try:
            gf.main()
            after = out.read_text(encoding="utf-8")
            if after == original:
                print("[PASS] tolerance: old snapshot preserved on fetch failure")
            else:
                print("[FAIL] tolerance: snapshot changed despite fetch failure")
                all_ok = False
        except SystemExit as e:
            print(f"[FAIL] tolerance: main() raised SystemExit: {e}")
            all_ok = False
    else:
        print("[SKIP] tolerance: no existing factors-latest.json to compare")

    print()
    print("ALL PASS" if all_ok else "SOME FAILED")
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
