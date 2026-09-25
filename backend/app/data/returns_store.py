from datetime import UTC, date, datetime, timedelta
from threading import Lock
from typing import Protocol

import pandas as pd


class ReturnsSource(Protocol):
    """Any source for returns."""

    def get_returns_by_tickers(
        self, start: date, end: date, tickers: list[str]
    ) -> pd.DataFrame:
        """Returns dataframe with date index and tickers as columns. Start and End dates are inclusive."""
        ...


class ReturnsStore:
    """Fetches returns data from upstream source and manages data stitching & cache state."""

    def __init__(
        self,
        returns_source: ReturnsSource,
        tickers: list[str],
        *,
        mutable_window_size: timedelta,
        mutable_window_ttl: timedelta,
    ) -> None:
        self._source = returns_source
        self._tickers = tickers

        self._data = pd.DataFrame(
            columns=self._tickers,
            index=pd.DatetimeIndex([], name="Date"),
            dtype="float64",
        )
        self._first_date = None  # earliest date fetched from upstream
        self._last_date = None  # latest date fetched from upstream

        self._window: timedelta = mutable_window_size
        self._ttl: timedelta = mutable_window_ttl
        self._last_refresh: datetime | None = None
        self._lock = Lock()

    def get_returns(self, start: date, end: date) -> pd.DataFrame:
        """Returns cached data when available and not considered stale.

        Otherwise fetches & caches fresh data for missing/stale dates.
        If the end date is anywhere inside the mutable window then the whole window is refreshed.
        Data refreshes are serialized with a lock to avoid overwhelming the upstream.
        """
        with self._lock:
            now = datetime.now(UTC)
            end = min(end, now.date())
            self._fill_data(start, end, now)
        return self._data.loc[str(start) : str(end)].copy()

    def _fill_data(self, start: date, end: date, now: datetime) -> None:
        if self._first_date is None or self._last_date is None:
            self._fetch_and_stitch(start, end)
            self._first_date, self._last_date = start, end
            self._last_refresh = now
            return

        if start < self._first_date:
            self._fetch_and_stitch(start, self._first_date)
            self._first_date = start
        if end > self._last_date:
            self._fetch_and_stitch(self._last_date, end)
            self._last_date = end

        window_start = now.date() - self._window
        if end >= window_start and self._is_stale(now):
            self._fetch_and_stitch(window_start, max(end, self._last_date))
            self._last_refresh = now

    def _fetch_and_stitch(self, start: date, end: date) -> None:
        returns_df = self._source.get_returns_by_tickers(start, end, self._tickers)
        returns_df = returns_df.reindex(columns=self._tickers)
        if self._data.empty:
            self._data = returns_df.sort_index()
            return
        combined = pd.concat([self._data, returns_df])
        self._data = combined[~combined.index.duplicated(keep="last")].sort_index()

    def _is_stale(self, now: datetime) -> bool:
        if self._last_refresh is None:
            return True
        return self._last_refresh + self._ttl < now
