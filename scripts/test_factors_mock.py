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


def _nvda(cur: float, prev_q: float, yoy_q: float, period="2026-04-26",
          acc="0001045810-26-000001") -> dict:
    return {"accessionNumber": acc, "cur": cur, "prev_q": prev_q, "yoy_q": yoy_q,
            "yoy": (cur - yoy_q) / yoy_q * 100,
            "qoq": (cur - prev_q) / prev_q * 100,
            "period": period, "filing": "2026-05-29",
            "fiscal": gf._fiscal_label(period)}


def _eps(latest: float, base: float, latest_dt: date, base_dt: date) -> dict:
    return {"latest_v": latest, "latest_dt": latest_dt,
            "base_v": base, "base_dt": base_dt,
            "yoy": (latest - base) / base * 100,
            "history": [{"date": latest_dt.isoformat(), "value": latest},
                        {"date": base_dt.isoformat(), "value": base}]}


def _patch_nvda(nvda_dict: dict) -> None:
    """Wire the three new NVDA functions so build_snapshot never touches network."""
    acc = nvda_dict.get("accessionNumber", "0001045810-26-000001")
    gf.fetch_nvda_submissions = lambda: {"rec": {"form": ["10-Q"],
                                                  "accessionNumber": [acc],
                                                  "primaryDocument": ["nvda-10q.htm"],
                                                  "reportDate": [nvda_dict["period"]],
                                                  "filingDate": [nvda_dict["filing"]]},
                                          "cik": "0001045810"}
    gf.parse_nvda_10q = lambda a, d, p, f: nvda_dict
    gf.backfill_nvda_history = lambda cache, subs: [
        {"date": nvda_dict["period"], "value": round(nvda_dict["yoy"]),
         "qoq": round(nvda_dict["qoq"], 1), "fiscal": nvda_dict["fiscal"]}]
    gf.save_nvda_cache = lambda cache: None


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
                           "delta", "meter", "meterScale", "light", "hint", "source",
                           "explain", "history"}


def run_one(case: tuple) -> tuple[bool, str]:
    label, tnx_series, nvda_dict, eps_dict, expected_state, expected_tone = case
    gf.fetch_dgs10_series = lambda: tnx_series        # type: ignore
    _patch_nvda(nvda_dict)
    gf.fetch_spx_eps = lambda: eps_dict              # type: ignore

    snap = gf.build_snapshot(SEED)

    problems = []

    # Top-level shape
    for key in ("updatedAt", "date", "headline", "verdict", "indicators",
                "alerts", "matrix", "pace", "sourceNote", "modelExplainer"):
        if key not in snap:
            problems.append(f"missing top key: {key}")

    # modelExplainer shape
    me = snap.get("modelExplainer", {})
    if not me.get("summary"):
        problems.append("modelExplainer.summary empty")
    if not isinstance(me.get("framework"), list) or len(me["framework"]) != 3:
        problems.append(f"modelExplainer.framework must be 3 items, got {me.get('framework')!r}")
    if not isinstance(me.get("howToRead"), list) or not me["howToRead"]:
        problems.append("modelExplainer.howToRead empty")

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
        # explain shape
        ex = ind[name].get("explain", {})
        for k in ("definition", "current", "threshold"):
            if not ex.get(k):
                problems.append(f"indicator {name} explain.{k} empty")
        # history shape
        hist = ind[name].get("history")
        if not isinstance(hist, list) or not hist:
            problems.append(f"indicator {name} history empty")
            continue
        if name == "nvda" and len(hist) > 8:
            problems.append(f"indicator nvda history len={len(hist)} > 8")
        for pt in hist:
            if "date" not in pt or "value" not in pt:
                problems.append(f"indicator {name} history point missing date/value: {pt!r}")
                break

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
    elif not active[0].get("reason"):
        problems.append("active row missing non-empty reason")

    # Every row needs desc + sentiment coding (for the new card/legend layout)
    for r in rows:
        if not r.get("desc"):
            problems.append(f"row {r['state']} missing desc")
        for skey in ("tnxSentiment", "epsSentiment", "nvdaSentiment"):
            if r.get(skey) not in {"up", "down", "flat"}:
                problems.append(f"row {r['state']} {skey}={r.get(skey)!r}")

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
    _patch_nvda(_nvda(18000, 22000, 14000))
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
    _patch_nvda(_nvda(22000, 21600, 18760))
    gf.fetch_spx_eps = lambda: _eps(200.0, 205.0, date(2026,5,1), date(2025,5,1))  # eps down
    snap = gf.build_snapshot(SEED)
    a2 = next(a for a in snap["alerts"] if a["id"] == "top2")
    if a2["triggered"]:
        print(f"[PASS] alert#2 triggered when TNX>=warn + EPS not up")
    else:
        print(f"[FAIL] alert#2 not triggered (TNX={snap['indicators']['tnx']['value']})")
        all_ok = False

    # NVDA backfill: 3 10-Qs, one intentionally fails parse → ≤3 points, no throw.
    # Reload gf to restore the real backfill_nvda_history (alert tests above
    # replaced it with a canned lambda via _patch_nvda).
    import importlib
    importlib.reload(gf)
    fake_subs = {"rec": {"form": ["10-Q", "10-Q", "10-Q"],
                         "accessionNumber": ["A-1", "A-2", "A-3"],
                         "primaryDocument": ["d1.htm", "d2.htm", "d3.htm"],
                         "reportDate": ["2026-04-26", "2026-01-25", "2025-10-26"],
                         "filingDate": ["2026-05-29", "2026-02-27", "2025-11-21"]},
                 "cik": "0001045810"}
    parse_calls = {"A-1": _nvda(26000, 22600, 18760, period="2026-04-26", acc="A-1"),
                   "A-2": _nvda(22600, 18760, 14000, period="2026-01-25", acc="A-2")}
    def _fake_parse(acc, doc, period, filing):
        if acc == "A-3":
            raise RuntimeError("intentional parse miss for A-3")
        return parse_calls[acc]
    gf.parse_nvda_10q = _fake_parse
    cache = {"nvda_by_acc": {}, "updatedAt": None}
    pts = gf.backfill_nvda_history(cache, fake_subs)
    if len(pts) <= 3 and all("date" in p and "value" in p for p in pts):
        print(f"[PASS] backfill: {len(pts)} points, no throw on parse miss")
    else:
        print(f"[FAIL] backfill: got {len(pts)} points, shape={pts!r}")
        all_ok = False
    if cache["nvda_by_acc"].get("A-3") == "null":
        print(f"[PASS] backfill: failed acc cached as 'null' (no re-fetch next run)")
    else:
        print(f"[FAIL] backfill: failed acc not marked null (got {cache['nvda_by_acc'].get('A-3')!r})")
        all_ok = False

    # Tolerance: main() preserves old snapshot when fetch fails
    out = ROOT / "data" / "factors-latest.json"
    if out.exists():
        original = out.read_text(encoding="utf-8")
        gf.fetch_dgs10_series = lambda: (_ for _ in ()).throw(RuntimeError("simulated"))
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

    # Real-fixture parse test (honors mock-test-real-parse-path memory):
    # exercises the actual JSON/HTML parse paths with saved responses, so
    # key-name bugs like 'reportDate' vs 'periodOfReport' can't hide.
    fixture_ok = _test_real_parse()
    if fixture_ok is False:
        all_ok = False

    print()
    print("ALL PASS" if all_ok else "SOME FAILED")
    return 0 if all_ok else 1


def _test_real_parse() -> bool | None:
    """Returns True if pass, False if fail, None if skipped (no fixtures)."""
    fixdir = ROOT / "scripts" / "fixtures"
    sec_sub = fixdir / "sec_submissions.json"
    multpl = fixdir / "multpl_eps.html"
    fred = fixdir / "fred_dgs10.csv"
    tenq = fixdir / "sec_10q.html"
    if not all(p.exists() for p in (sec_sub, multpl, fred, tenq)):
        print("[SKIP] real-parse: fixtures not captured (run scripts/capture_factors_fixtures.py)")
        return None

    # Restore real parse/fetch implementations by reloading the module, then
    # stub only http_get (the real fetchers call it via global lookup at call time).
    import importlib
    importlib.reload(gf)
    problems = []
    def _fake_http_get(url, timeout, ua=gf.EDGAR_UA):
        if "data.sec.gov/submissions" in url:
            return sec_sub.read_text(encoding="utf-8")
        if "www.sec.gov/Archives" in url:
            return tenq.read_text(encoding="utf-8")
        if "multpl.com" in url:
            return multpl.read_text(encoding="utf-8")
        if "fred.stlouisfed.org" in url:
            return fred.read_text(encoding="utf-8")
        raise RuntimeError(f"unexpected url in fixture test: {url}")
    gf.http_get = _fake_http_get

    # SEC submissions must surface 'reportDate' (the real key), not 'periodOfReport'
    subs = gf.fetch_nvda_submissions()
    rec = subs["rec"]
    if "reportDate" not in rec or "accessionNumber" not in rec:
        problems.append(f"sec submissions missing reportDate/accessionNumber; keys={list(rec)[:8]}")
    forms = rec["form"]
    accs = rec["accessionNumber"]
    docs = rec["primaryDocument"]
    periods = rec["reportDate"]
    filed = rec["filingDate"]
    idx = next((i for i, f in enumerate(forms) if f == "10-Q"), None)
    if idx is None:
        problems.append("no 10-Q found in fixture submissions")
    else:
        parsed = gf.parse_nvda_10q(accs[idx], docs[idx], periods[idx], filed[idx])
        if "yoy" not in parsed or "qoq" not in parsed:
            problems.append(f"parse_nvda_10q output missing yoy/qoq: {parsed!r}")

    # FRED CSV parse
    series = gf.fetch_dgs10_series()
    if not series or not isinstance(series[0], tuple):
        problems.append(f"fetch_dgs10_series returned empty/shape-wrong: {series[:2]!r}")

    # multpl EPS parse (includes history)
    eps = gf.fetch_spx_eps()
    if "yoy" not in eps or "history" not in eps or not eps["history"]:
        problems.append(f"fetch_spx_eps missing yoy/history: {eps!r}")

    if problems:
        print(f"[FAIL] real-parse: {'; '.join(problems)}")
        return False
    print(f"[PASS] real-parse: SEC submissions key='reportDate', 10-Q/FRED/multpl all parsed")
    return True


if __name__ == "__main__":
    sys.exit(main())
