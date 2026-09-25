# MAG7 Interactive Return Viewer
Jordan Ferreras

## Overview
"A simple full-stack app to visualize daily returns of the
MAG7 stocks (MSFT, AAPL, GOOGL, AMZN, NVDA, META, TSLA) using data from 
yfinance."

This repo houses the full MAG7 returns web app under respective backend/ and frontend/ folders. The backend is its own python3.12 project managed with uv. The frontend is its own React app using the Next framework, and pnpm as the package manager.

## Local Setup
One simple way to do this is to open up two terminal windows, and then run one in each:
1. First spin up the Backend: `cd backend && uv sync && uv run uvicorn app.main:create_app --factory --port 8000`
1. Then start the Frontend: `cd frontend && npm run dev`

Note:
The next.config.ts file proxies the api route so there is no CORS issue on the browser.
If you serve the frontend statically or something then you might run into issues.

## Assumptions
- All 7 names trade on the same NYSE calendar so there is no need for calendar alignment
- yfinance data older than 10 calendar days doesn't materially change so it can be cached without a TTL
- No pagination needed at this scale with only 7 tickers