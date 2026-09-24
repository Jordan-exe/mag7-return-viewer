# MAG7 Interactive Return Viewer
Jordan Ferreras

## Overview
"A simple full-stack app to visualize daily returns of the
MAG7 stocks (MSFT, AAPL, GOOGL, AMZN, NVDA, META, TSLA) using data from 
yfinance."

This repo houses the full MAG7 returns web app under respective backend/ and frontend/ folders. The backend is its own python3.12 project managed with uv. The frontend is its own React app using the Next framework.

## Local Setup
- uvicorn for fast api app on port X
- next dev with a proxy to port X so no CORS concern from the browser

## Assumptions
- All 7 names trade on the same NYSE calendar so there is no need for calendar alignment
- yfinance data older than 7 calendar days doesn't change so it can be cached without a TTL
- No pagination needed at this scale with only 7 tickers