from datetime import date, timedelta

import pandas as pd

from app.data.returns_store import ReturnsStore


class FakeSource:
    def get_returns_by_tickers(
        self, start: date, end: date, tickers: list[str]
    ) -> pd.DataFrame:
        index = pd.date_range(start, end, name="Date")
        return pd.DataFrame({t: 0.01 for t in tickers}, index=index)


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
