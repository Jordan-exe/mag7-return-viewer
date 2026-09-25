# MAG7 Interactive Return Viewer
Jordan Ferreras

## Overview
"A simple full-stack app to visualize daily returns of the
MAG7 stocks (MSFT, AAPL, GOOGL, AMZN, NVDA, META, TSLA) using data from 
yfinance."

This repo houses the full MAG7 returns web app under respective backend/ and frontend/ folders. The backend is its own python3.12 project managed with uv. The frontend is its own React app using the Next framework.

## Local Setup
- Backend: `cd backend && uv sync && uv run uvicorn app.main:create_app --factory --port 8000`
- Frontend: `next dev` with a proxy to port 8000 so there is no CORS concern from the browser

## Assumptions
- All 7 names trade on the same NYSE calendar so there is no need for calendar alignment
- yfinance data older than 10 calendar days doesn't materially change so it can be cached without a TTL
- No pagination needed at this scale with only 7 tickers