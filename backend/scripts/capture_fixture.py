"""Capture a GET /returns response from the local backend as a frontend test fixture.

Usage (with the backend running on port 8000):
    uv run python scripts/capture_fixture.py [--start YYYY-MM-DD] [--end YYYY-MM-DD]

The default range covers the 2022 AMZN (Jun 6, 20:1), GOOGL (Jul 18, 20:1) and
TSLA (Aug 25, 3:1) stock splits.
"""

import argparse
import json
import urllib.parse
import urllib.request
from pathlib import Path

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "frontend" / "test" / "fixtures"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", default="2022-05-23")
    parser.add_argument("--end", default="2022-08-31")
    parser.add_argument("--base-url", default="http://localhost:8000")
    args = parser.parse_args()

    query = urllib.parse.urlencode({"start": args.start, "end": args.end})
    with urllib.request.urlopen(f"{args.base_url}/returns?{query}") as resp:
        data = json.load(resp)

    FIXTURES_DIR.mkdir(parents=True, exist_ok=True)
    out = FIXTURES_DIR / f"returns_{args.start}_{args.end}.json"
    out.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
