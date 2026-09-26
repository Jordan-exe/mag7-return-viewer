# Code Review by Claude: MAG7 Interactive Return Viewer

**Date:** 2026-09-26
**Reviewed at commit:** `ca96907` (main)
**Reviewer:** Claude Fable 5.1 (Claude Code)
**Scope:** Full-stack review against the take-home spec, the bonus points, and the Senior Fullstack Engineer (Portfolio Tools) role description.

## How this review was done

- Read every tracked source file in `backend/` and `frontend/`, the root README, and the git history.
- Ran the backend test suite and ruff (lint + format check).
- Ran the frontend `tsc --noEmit`, vitest, eslint, and prettier checks.
- Started the backend on a scratch port and probed `/returns` for: a normal range, a cached repeat, `start > end`, same-day range, malformed date, missing param, weekend-only range, a future range, a pre-META-IPO range (2012), and a range extending earlier than the cache.
- Did **not** open the UI in a browser. Responsiveness and chart interaction are assessed from the source only.

## Verdict

**All hard requirements are met. All five bonus points are met.** The submission is in good shape. The items below are ordered by how much I think they matter to a reviewer at Acadian. Nothing here is a blocker, but the first three are cheap fixes that remove avoidable friction for whoever clones the repo.

### Automated check results

| Check | Result |
| --- | --- |
| `uv run pytest` | 3 passed |
| `uv run ruff check .` | clean |
| `uv run ruff format --check .` | 1 file would be reformatted (`scripts/capture_fixture.py`) |
| `pnpm test` (tsc + vitest) | 6 passed |
| `pnpm lint` | clean |
| `prettier --check .` | clean |

---

## Requirements checklist

### Frontend (React)

| Requirement | Status | Evidence |
| --- | --- | --- |
| Interactive, responsive grid, 1 box per ticker | ✅ | `components/returns-grid.tsx`: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`. One `TickerCard` per key in the response. |
| Line chart of daily returns per box | ✅ | `components/return-chart.tsx` uses Recharts `LineChart`. |
| Zooming or tooltip inspection | ✅ both | `Brush` gives zoom; `ChartTooltip` gives hover inspection. `syncId="returns"` syncs tooltips across all 7 charts, which is a nice touch beyond the spec. |
| Summary stats: min, max, mean | ✅ | `components/summary-row.tsx` renders Min / Mean / Max from `lib/summarizer.ts`. Mean is explicitly labelled "daily, arithmetic". |
| Date picker for start_date / end_date | ✅ | `components/date-selector.tsx`, range mode, future dates disabled. |
| Re-fetch on change | ✅ | `hooks/use-returns.ts` keys the query on `[start, end]`. |
| React 18+ | ✅ | React 19.2.8, Next 16.3.6. |
| Charting library of choice | ✅ | Recharts 3.8.0 via shadcn chart wrapper. |

### Backend (Python)

| Requirement | Status | Evidence |
| --- | --- | --- |
| FastAPI | ✅ | `app/main.py`. |
| `/returns?start=YYYY-MM-DD&end=YYYY-MM-DD` | ✅ | Verified live. Inclusive on both ends. |
| yfinance daily close prices | ✅ | `app/data/yfinance_adapter.py` uses `yf.download(..., auto_adjust=True)` and selects `Close`. |
| Compute daily % returns | ✅ | `pct_change()` on the close frame. Returned as decimals (0.01 = 1%), documented in the Pydantic field description. |
| JSON shape `{ "MSFT": [{"date", "return"}], ... }` | ✅ | Verified live. `return_` is aliased to `return` and FastAPI serialises by alias by default. The OpenAPI spec and generated TS types both show `return`. |
| In-memory cache | ✅ | `app/data/returns_store.py`: a single growing DataFrame, stitched by range, with a 10-day mutable window refreshed on a 15-minute TTL. Repeat request measured at ~10 ms versus ~285 ms cold. |

### Bonus points

| Bonus | Status | Notes |
| --- | --- | --- |
| Responsive grid layout | ✅ | 1 / 2 / 4 columns by breakpoint. Header and date picker also collapse on mobile. Not verified in a browser in this review. |
| Handle fetch errors gracefully in the UI | ✅ | Destructive `Alert` with the error message. Prior data is retained via `keepPreviousData`. See note on retry delay below. |
| Summary table across all 7 names | ✅ | `components/summary-table.tsx`: total (compounded) return, best day, worst day, sorted descending by total return. |
| Modular Python backend | ✅ | Clean separation: `config` → `data/yfinance_adapter` (fetch) → `data/returns_store` (cache) → `service` (wire format) → `main` (endpoint). `ReturnsSource` Protocol makes the store testable with a fake. |
| pandas and type annotations | ✅ | pandas throughout the data layer. Annotations on every public function. |

### Submission

| Item | Status | Notes |
| --- | --- | --- |
| README with setup instructions | ⚠️ | Present but has gaps. See finding 1. |
| How to run frontend + backend | ⚠️ | Present but frontend command is inconsistent with the toolchain. See finding 1. |
| Assumptions | ✅ | Four clear assumptions listed. Good. |

---

## Findings

### 1. README setup steps will not work as written for a fresh clone (should fix)

**File:** `README.md`

- The frontend step is `cd frontend && npm run dev` but the project declares `packageManager: pnpm@10.28.0` and ships `pnpm-lock.yaml`. There is no install step at all. A fresh clone has no `node_modules`, so `npm run dev` fails immediately. I confirmed `node_modules` was absent on this checkout.
- Prerequisites are not stated: Python 3.12+, `uv`, Node version, pnpm.
- The backend port is hardcoded to 8000 in `frontend/next.config.ts`. Worth one sentence so a reader who changes `--port` knows why the proxy breaks.
- `frontend/README.md` is untouched create-next-app boilerplate. Either delete it or replace with a one-liner pointing at the root README.

Suggested frontend line: `cd frontend && pnpm install && pnpm dev`.

This is the single most likely thing to cost you points, because it is the first thing a reviewer does.

### 2. Frontend refuses same-day ranges that the backend accepts (should fix)

**File:** `frontend/hooks/use-returns.ts:13`

`enabled: !!start && !!end && start < end` uses strict less-than. Selecting the same day for both ends is legal in the picker and the backend returns a valid single-row response (verified live), but the frontend never fetches. Worse, because the summary table header reads `range.from` / `range.to` from state while the data is stale, the header shows the new single date over the old range's numbers. Use `start <= end`.

### 3. A future-dated request triggers a multi-year upstream fetch (should fix)

**File:** `backend/app/data/returns_store.py:51-71`

`get_returns` clamps `end` to today, but `start` is not clamped. With the cache holding Jan 2024, a request for `2030-01-01..2030-01-10` became `end = today`, so `end > self._last_date` fired `_fetch_and_stitch(2024-01-10, today)`: a 2.7-year download for a request that returns seven empty lists. I observed this live in the uvicorn log.

The frontend disables future dates so a user can't trigger this from the UI, but the API is the deliverable. Two options:

- Return early with empty series when `start > today`.
- Or clamp `start` too and let it fall through to the `start > end` validation in the service.

### 4. Cache logic is the most interesting code in the repo and has one test (should improve)

**File:** `backend/tests/data/test_returns_store.py`

The store handles five distinct paths: cold fill, extend-earlier, extend-later, mutable-window refresh on TTL expiry, and TTL-not-expired no-op. Only the cold path is tested. The `FakeSource` is already in place, so adding a call-counting fake and four more tests is maybe 40 lines. Given the role description emphasises "test and enhance" and "reliability", this is where I'd spend the next hour.

There is also no test for `app/main.py`. A single `TestClient` test that hits `/returns` with a fake store injected through `create_app(settings)` would prove the alias serialisation and the 400 path end to end. Right now `test_model.py` tests the alias on the model directly, which is close but not the same thing.

### 5. `yfinance` failures surface as an unhandled 500 (minor)

**File:** `backend/app/main.py:24-30`

Only `ValueError` is caught. `YFinanceAdapter.get_prices` raises `RuntimeError` on download failure or missing `Close` column, which becomes a bare 500 with a stack trace in the log and no body. The frontend shows "Request failed (500)", which is acceptable, but a `502`/`503` with a "upstream data source unavailable" detail would be more honest and easier to alert on. Small change, and it rounds out the "handle errors gracefully" bonus on the server side.

### 6. Errors take ~7 seconds to appear in the UI (minor)

**File:** `frontend/app/providers.tsx`

`QueryClient` is constructed with defaults, so react-query retries 3 times with exponential backoff before `isError` flips. With the backend down, the user sees the dimmed previous data for roughly 7 seconds before the alert appears. For a 400 from `start > end` a retry is pointless. Consider `retry: (count, err) => count < 2 && !is4xx(err)` or just `retry: 1`.

### 7. Leftovers to clean before sending (housekeeping)

- `frontend/components/stats-row.tsx` is an empty file.
- `backend/testing-notebook.ipynb` (37 KB) is committed. If it is scratch work, delete it or mention it in the README. If it is intentional, clear the outputs.
- `frontend/AGENTS.md` and `frontend/CLAUDE.md` are Next.js-generated agent rule files. Harmless, but a reviewer unfamiliar with them may wonder. Your root README already explains the AI-usage process, so a one-line mention would suffice.
- `lib/summarizer.ts:16` has a `// TODO: arithmetic or geometric?` comment. You already resolved this by labelling the UI "Mean (daily, arithmetic)". Turn the TODO into a statement of the decision, or move it to the README assumptions.
- `scripts/capture_fixture.py` fails `ruff format --check`. Run `uv run ruff format .`.
- `yf.download` prints a progress bar into the server log on every upstream fetch. Pass `progress=False`.
- `_first_date` and `_last_date` in `ReturnsStore.__init__` are initialised to `None` without a `date | None` annotation, while everything else in the file is annotated.
- `useReturns` uses non-null assertions (`start!`, `end!`) inside `queryFn`. They are safe because of `enabled`, but a local `if (!start || !end) throw` reads better and keeps `strict` happy without `!`.

### 8. Things I checked that are fine

- **Stock splits:** `auto_adjust=True` plus the committed 2022 fixture and its "no unadjusted split days" assertion cover this. Good instinct to pin it with a regression test.
- **Pre-IPO tickers:** META in May 2012 returns 5 rows while the others return 10. NaNs are dropped per-column in the service, not globally, so one ticker's missing history doesn't blank the others.
- **Thread safety:** the endpoint is a sync `def`, so FastAPI runs it in a threadpool. The `Lock` around `_fill_data` is therefore necessary and present. The read of `self._data` outside the lock is safe because reassignment is atomic and `.copy()` snapshots it.
- **Lookback for the first return:** the 10-day calendar lookback comfortably covers any holiday cluster so the first requested day always has a prior close.
- **Inclusive end date:** the adapter adds one day to compensate for yfinance's exclusive end. Verified.
- **Contract-first API:** exporting `openapi.json` and generating `schema.d.ts` with `openapi-typescript` / `openapi-fetch` is exactly what a portfolio-tools team wants to see. The `return` alias flows correctly through the whole chain.
- **Config:** `pydantic-settings` with an env prefix makes the TTL and window tunable without code changes.

---

## Read against the role description

Where the submission lines up well with what the posting asks for:

- **"Clean, modular, full-stack"**: the backend layering and the Protocol-based seam are the strongest part of the submission. The frontend mirrors it: data hook → pure `lib/` functions → presentational components.
- **"Speed, reliability, maintainability"**: the stitching cache is a thoughtful answer to "cache in memory". It avoids the naive per-range dict and shows you thought about how the data actually behaves (immutable past, mutable recent window).
- **"pandas and type annotations"**: idiomatic. `pct_change`, `reindex`, `concat` + dedupe by index. No row-by-row loops.
- **Investment domain awareness**: compounded total return in the summary table, adjusted closes for splits, explicit arithmetic-vs-geometric labelling. These are the details a PM-facing tool gets asked about.
- **Transparency about AI usage**: the CLAUDE.md constraints, committed prompts, and prefixed commits are a differentiator. It answers the question a hiring panel is going to ask anyway.

Where a senior reviewer might push:

- Test depth on the cache (finding 4). The layering is designed for testability, so the thin coverage is conspicuous.
- The README friction (finding 1). Senior candidates are expected to have run their own setup instructions on a clean machine.
- No mention of Ray or async. Not required by the spec, but the posting names Ray explicitly. A sentence in the README about how you'd scale the fetch layer (per-ticker parallelism, a shared cache process) would cost nothing and signal you read the posting.

## Suggested order of operations before submitting

1. Fix the README (finding 1). Five minutes.
2. `start <= end` in the hook (finding 2). One character.
3. Guard future `start` in the store (finding 3). Five lines.
4. Add store tests for the four untested paths and one `TestClient` test (finding 4). One hour.
5. Housekeeping pass (finding 7). Ten minutes.
6. Findings 5 and 6 if time permits.
