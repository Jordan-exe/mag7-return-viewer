from datetime import date, timedelta

import pandas as pd

from app.data.returns_store import ReturnsStore


class FakeSource:
    def get_returns_by_tickers(
        self, start: date, end: date, tickers: list[str]
    ) -> pd.DataFrame:
        index = pd.date_range(start, end, name="Date")
        return pd.DataFrame({t: 0.01 for t in tickers}, index=index)


class RecordingFakeSource:
    """Fake ReturnsSource that records every call it receives.

    Each fetch is filled with a value equal to its call number (1, 2, 3, ...)
    so that stitched data can be traced back to whichever fetch produced it.
    """

    def __init__(self) -> None:
        self.calls: list[tuple[date, date]] = []

    def get_returns_by_tickers(
        self, start: date, end: date, tickers: list[str]
    ) -> pd.DataFrame:
        self.calls.append((start, end))
        index = pd.date_range(start, end, name="Date")
        value = float(len(self.calls))
        return pd.DataFrame({t: value for t in tickers}, index=index)


def make_store(
    source: RecordingFakeSource,
    *,
    window: timedelta = timedelta(days=100_000),
    ttl: timedelta = timedelta(days=100_000),
) -> ReturnsStore:
    """Build a store with a huge window and TTL by default.

    That keeps every test date "inside" the mutable window and "not stale",
    so tests only exercise the code path they name unless they override
    `window` or `ttl` on purpose.
    """
    return ReturnsStore(
        source,
        ["MSFT", "AAPL"],
        mutable_window_size=window,
        mutable_window_ttl=ttl,
    )


def test_get_returns_returns_requested_range() -> None:
    store = ReturnsStore(
        FakeSource(),
        ["MSFT", "AAPL"],
        mutable_window_size=timedelta(days=10),
        mutable_window_ttl=timedelta(minutes=15),
    )

    result = store.get_returns(date(2024, 1, 2), date(2024, 1, 4))

    assert list(result.columns) == ["MSFT", "AAPL"]
    assert list(result.index) == list(pd.date_range("2024-01-02", "2024-01-04"))


def test_cold_fill_fetches_once_for_the_requested_range() -> None:
    """First-ever request has no cached data, so it fetches exactly the requested range."""
    source = RecordingFakeSource()
    store = make_store(source)

    result = store.get_returns(date(2024, 1, 2), date(2024, 1, 4))

    assert source.calls == [(date(2024, 1, 2), date(2024, 1, 4))]
    assert list(result.index) == list(pd.date_range("2024-01-02", "2024-01-04"))


def test_extends_earlier_when_start_precedes_cached_range() -> None:
    """A start date before the cached range only fetches the missing earlier slice."""
    source = RecordingFakeSource()
    store = make_store(source)

    store.get_returns(date(2024, 1, 5), date(2024, 1, 10))
    result = store.get_returns(date(2024, 1, 1), date(2024, 1, 10))

    assert source.calls == [
        (date(2024, 1, 5), date(2024, 1, 10)),
        (date(2024, 1, 1), date(2024, 1, 5)),
    ]
    assert list(result.index) == list(pd.date_range("2024-01-01", "2024-01-10"))
    # The overlapping day (Jan 5) is re-fetched by the extend-earlier call, and
    # "keep last" stitching means that later fetch's value wins.
    assert result.loc["2024-01-05", "MSFT"] == 2.0


def test_extends_later_when_end_follows_cached_range() -> None:
    """An end date after the cached range only fetches the missing later slice."""
    source = RecordingFakeSource()
    store = make_store(source)

    store.get_returns(date(2024, 1, 1), date(2024, 1, 5))
    result = store.get_returns(date(2024, 1, 1), date(2024, 1, 10))

    assert source.calls == [
        (date(2024, 1, 1), date(2024, 1, 5)),
        (date(2024, 1, 5), date(2024, 1, 10)),
    ]
    assert list(result.index) == list(pd.date_range("2024-01-01", "2024-01-10"))
    assert result.loc["2024-01-05", "MSFT"] == 2.0


def test_refreshes_mutable_window_when_stale() -> None:
    """A request whose end falls inside the mutable window re-fetches it once the TTL has expired."""
    source = RecordingFakeSource()
    # A negative TTL means any prior refresh is immediately considered stale.
    store = make_store(source, ttl=timedelta(days=-1))

    store.get_returns(date(2024, 1, 1), date(2024, 1, 10))
    store.get_returns(date(2024, 1, 1), date(2024, 1, 10))

    assert len(source.calls) == 2
    # The refresh re-fetches through (at least) the previously cached end date.
    assert source.calls[1][1] == date(2024, 1, 10)


def test_does_not_refetch_within_ttl() -> None:
    """Repeating an identical request within the TTL window serves entirely from cache."""
    source = RecordingFakeSource()
    store = make_store(source)  # huge TTL: the window refresh is never considered stale

    store.get_returns(date(2024, 1, 1), date(2024, 1, 10))
    result = store.get_returns(date(2024, 1, 1), date(2024, 1, 10))

    assert len(source.calls) == 1
    assert list(result.index) == list(pd.date_range("2024-01-01", "2024-01-10"))
