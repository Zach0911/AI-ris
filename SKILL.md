---
name: AI-ris
description: Build, refresh, validate, and extend the AI-ris market radar dashboard. Use when Codex needs to work on a static investment dashboard that ranks US thematic ETFs, maps them to A-share listed ETF candidates, tracks influence-person market signals, refreshes data snapshots, adjusts the theme mapping schema, explains resonance/lead/divergence signals, or prepares the project for static deployment on GitHub Pages or similar hosts.
---

# AI-ris

## Overview

Use this skill to maintain the AI-ris dashboard that maps US thematic ETF strength into A-share listed ETF candidates and tracks influence-person market signals. The project is a static HTML/CSS/JavaScript app with tolerant Python snapshot generators.

## Project Layout

- `index.html`: app shell and visible Chinese UI labels.
- `src/app.js`: filtering, sorting, signal rendering, and client-side data loading.
- `src/data.js`: built-in sample data used when `data/latest.json` is unavailable.
- `src/styles.css`: dashboard layout and responsive styling.
- `data/latest.json`: generated snapshot loaded by the page at runtime.
- `scripts/generate_snapshot.py`: refresh US and A-share ETF data while preserving the front-end schema.
- `scripts/e2e_smoke.py`: local end-to-end smoke test for snapshot generation and static serving.
- `references/data-contract.md`: schema, scoring, signal, and extension rules.

## Standard Workflow

1. Inspect the current schema before changing data or UI:
   - Read `references/data-contract.md`.
   - Sample existing records in `data/latest.json` and `src/data.js`.
2. Make narrowly scoped edits:
   - Keep `data/latest.json` and `src/data.js` schema-compatible.
   - Preserve Chinese UI copy unless the user asks for another language.
   - Prefer extending `scripts/generate_snapshot.py` over hand-editing generated fields.
3. Validate data generation:
   - For deterministic local checks, run `python3 scripts/generate_snapshot.py --skip-us --skip-cn`.
   - For live US data refresh, run `python3 scripts/generate_snapshot.py --skip-cn` after installing `requirements.txt`.
   - Use `--skip-cn` in CI unless the local `finance-all-in-one` dependency is available.
4. Validate the static app:
   - Run `python3 scripts/e2e_smoke.py`.
   - If UI behavior or CSS changed, also start `python3 -m http.server 5173` and inspect `http://localhost:5173`.
5. Commit only intentional snapshot changes:
   - Snapshot generation updates `updatedAt` and `date`; review those diffs before committing.

## Data Rules

- Treat `themes[]` as the public contract for the app.
- Every theme must include `id`, `name`, `signal`, `confidence`, `lead`, `tags`, `us`, and `cn`.
- Every `us` object must include `primary`, `etfs`, `returns`, `rel`, and `strength`.
- Every `cn[]` item must include `code`, `name`, `index`, `returns`, `amount`, `mappingScore`, `status`, and `reasons`.
- Use signal values exactly as Chinese strings: `共振`, `传导`, `背离`.
- Use strength keys exactly as `short`, `mid`, `long`, and `all`.
- Use return-period keys exactly as `1d`, `5d`, `20d`, `60d`, `120d`, and `ytd` where available.

## Extension Guidance

- Add new themes by choosing a liquid US primary ETF, two to four related US ETFs, and one or more A-share ETF candidates.
- Keep `tags` broad enough for synonym matching but specific enough to avoid unrelated ETF matches.
- Prefer clear `reasons[]` entries that explain direct name matches, index exposure, theme purity, liquidity, or substitute relationships.
- Update `SYNONYMS` in `scripts/generate_snapshot.py` when adding a theme family that needs Chinese/English tag expansion.
- Keep fallback behavior tolerant: failed data sources should not break the page or delete existing usable fields.

## Deployment Notes

- The app is static and can be served from GitHub Pages, Cloudflare Pages, or any static host.
- GitHub Actions runs `scripts/generate_snapshot.py --skip-cn` because the A-share helper is local-only.
- Browser fetches `./data/latest.json`; use a local HTTP server for full preview instead of relying only on `file://`.
