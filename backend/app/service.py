from datetime import date

import pandas as pd

from app.model import ReturnsResponse, SingleReturn


class ReturnsService:
    """Transforms data from the returns data store into the wire format."""

    def __init__(self) -> None:
        self._returns = None  # the returns store

    def fetch(self, start: date, end: date, *, tickers: list[str]) -> ReturnsResponse:
        date_range = pd.date_range(start, end)
        stub_returns = [SingleReturn(date=d, return_=0) for d in date_range]
        return {ticker: stub_returns for ticker in tickers}
