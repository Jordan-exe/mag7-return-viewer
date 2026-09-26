# MAG7 Interactive Return Viewer
Jordan Ferreras

## Overview
"A simple full-stack app to visualize daily returns of the
MAG7 stocks (MSFT, AAPL, GOOGL, AMZN, NVDA, META, TSLA) using data from 
yfinance."

This repo houses the full MAG7 returns web app under respective backend/ and frontend/ folders. The backend is its own python3.12 project managed with uv. The frontend is its own React app using the Next framework, and pnpm as the package manager.

## Local Setup
### Prerequisites
- `pnpm` https://pnpm.io/installation
- Python 3.12+
- `uv` https://docs.astral.sh/uv/getting-started/installation/

### Starting the app locally
One simple way to do this is to open up two terminal windows, and then run one in each:
1. First spin up the Backend: `cd backend && uv sync && uv run uvicorn app.main:create_app --factory --port 8000`
1. Then start the Frontend: `cd frontend && pnpm install && pnpm dev`

Note:
The `frontend/next.config.ts` file proxies the api route so there is no CORS issue on the browser.
If you serve the frontend statically or something then you might run into issues.
That file is what sets the port to 8000 so if you serve the backend on a different port then you will need to update the next config `frontend/next.config.ts` accordingly.

## Assumptions
- All 7 names trade on the same NYSE calendar so there is no need for calendar alignment
- yfinance data older than 10 calendar days doesn't materially change so older data can be cached without a TTL while recent days can be made stale and refreshed
- No pagination needed at this scale with only 7 tickers
- Boston-based user and NYSE calendar so for the purposes of this I just use local eastern dates without doing much date handling logic
- The instructions said "Display basic summary stats: min, max, mean." and I assumed this meant the simple arithmetic mean rather than some geometric annualized mean.

## Development Process
Normally I would use AI from the beginning of the project to plan, scaffold, and build. For the sake of the take-home, I decided to hand-code the app up until meeting the requirements, without any branding or heavy frontend polish. I assume my eye for branding isn't the focus here, but if it is then I apologize for that misunderstanding.

I decided to limit my AI-generated code to strictly the git commits which clearly state it was AI-generated. For additional transparency, I also include my prompt in the git commit description for review. I try to one-shot these as much as possible so that the prompt + commit provides enough transparency to Mike, Soichi, or whoever else is reviewing this.

### AI Usage
- Wrote a CLAUDE.md in the project root to tell cc to only write code when asked and to always commit transparently
- I'll probably ask claude to code review at the end so that will go in the claude-code-reviews folder
- For transparency I will write my prompts into claude-code-prompts/
- Git histotry will clearly show what is AI-generated
