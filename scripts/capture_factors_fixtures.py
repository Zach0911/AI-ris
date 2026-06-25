#!/usr/bin/env python3
"""One-shot: capture real upstream responses to scripts/fixtures/ for offline parse tests.

Run manually on a machine with network (NOT in CI). The captured fixtures let
test_factors_mock.py exercise the actual JSON/HTML parse paths — so key-name
bugs like SEC submissions 'reportDate' vs 'periodOfReport' can't hide.

Usage:  python scripts/capture_factors_fixtures.py
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXDIR = ROOT / "scripts" / "fixtures"

import generate_factors_snapshot as gf  # noqa: E402


def main() -> None:
    FIXDIR.mkdir(parents=True, exist_ok=True)

    # SEC submissions JSON
    subs_text = gf.http_get(gf.SEC_SUBMISSIONS, gf.SEC_TIMEOUT)
    (FIXDIR / "sec_submissions.json").write_text(subs_text, encoding="utf-8")
    subs = json.loads(subs_text)
    rec = subs["filings"]["recent"]
    forms = rec["form"]
    accs = rec["accessionNumber"]
    docs = rec["primaryDocument"]
    idx = next(i for i, f in enumerate(forms) if f == "10-Q")
    acc = accs[idx]
    doc = docs[idx]

    # One real 10-Q (latest)
    tenq_text = gf.http_get(gf.SEC_DOC.format(acc=acc.replace("-", ""), doc=doc), gf.SEC_TIMEOUT)
    (FIXDIR / "sec_10q.html").write_text(tenq_text, encoding="utf-8")

    # multpl EPS page
    multpl_text = gf.http_get(gf.MULTPL_EPS, gf.MULTPL_TIMEOUT, ua=gf.BROWSER_UA)
    (FIXDIR / "multpl_eps.html").write_text(multpl_text, encoding="utf-8")

    # FRED DGS10 CSV
    fred_text = gf.http_get(gf.FRED_DGS10.format(start=gf.FRED_START), gf.FRED_TIMEOUT)
    (FIXDIR / "fred_dgs10.csv").write_text(fred_text, encoding="utf-8")

    print(f"OK: captured 4 fixtures to {FIXDIR}")


if __name__ == "__main__":
    main()
