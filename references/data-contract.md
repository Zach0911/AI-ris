# Data Contract

## Snapshot Shape

`data/latest.json` and `src/data.js` must stay schema-compatible. The browser loads `data/latest.json` first and falls back to `src/data.js` when the request fails.

Top-level fields:

- `date`: Beijing-date string, `YYYY-MM-DD`.
- `updatedAt`: Beijing timestamp string, for example `2026-05-31T18:00:00+08:00`.
- `sourceNote`: short explanation of data origin or limitations.
- `periods`: ordered list of return periods.
- `themes`: array of theme records.

Theme fields:

- `id`: stable snake-case identifier.
- `name`: Chinese display name.
- `signal`: one of `共振`, `传导`, `背离`.
- `confidence`: integer, normally 55-96.
- `lead`: one-sentence Chinese summary.
- `tags`: mixed Chinese/English tags used for matching.
- `us`: US thematic ETF strength object.
- `cn`: A-share ETF candidate list.

US object fields:

- `primary`: primary US ETF ticker used for ranking and refresh.
- `etfs`: related US ETF tickers shown in the UI.
- `returns`: percentage returns keyed by `1d`, `5d`, `20d`, `60d`, `120d`, `ytd`.
- `rel`: relative returns versus broad US benchmark, keyed by `5d`, `20d`, `60d`, `120d`.
- `strength`: integer scores keyed by `short`, `mid`, `long`, `all`.

A-share ETF candidate fields:

- `code`: six-digit ETF code as a string.
- `name`: Chinese fund name.
- `index`: tracked index name.
- `returns`: percentage returns keyed by `1d`, `5d`, `20d`, `60d`, `120d`.
- `rel`: optional relative returns for display or future scoring.
- `amount`: daily turnover in RMB 100M units.
- `mappingScore`: integer mapping score from 30 to 99.
- `status`: one of `共振`, `传导`, `背离`.
- `reasons`: concise Chinese explanations of the mapping.
- `matchedTags`: optional generated list from synonym matching.

## Signal Meanings

- `共振`: US theme ETFs and A-share ETF candidates move in the same direction across meaningful periods.
- `传导`: US theme is already strong while A-share candidates have not fully followed.
- `背离`: US and A-share candidates are not synchronized or local factors dominate.

## Generator Behavior

`scripts/generate_snapshot.py` must be tolerant:

- If `yfinance` is unavailable or fails, keep the existing US fields.
- If the local `finance-all-in-one` helper is unavailable or fails, keep the existing A-share fields.
- Always refresh mapping scores and timestamp after a successful local run.
- Use `--skip-us --skip-cn` for deterministic schema-preserving smoke tests.

## UI Coupling

`src/app.js` expects:

- `themes[0]` to exist.
- Every listed theme to have at least one `cn` candidate.
- `signal` and `status` values to match the CSS classes in `signalClass`.
- `strength[state.horizon]` to be present for all four horizons.
- Return values to be numbers when present; missing values render as `-`.
