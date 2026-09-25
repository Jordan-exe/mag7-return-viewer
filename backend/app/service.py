from datetime import date

from app.data.returns_store import ReturnsStore
from app.model import ReturnsResponse, SingleReturn


class ReturnsService:
    """Transforms data from the returns data store into the wire format."""

    def __init__(self, returns: ReturnsStore) -> None:
        self._returns = returns

    def fetch(self, start: date, end: date) -> ReturnsResponse:
        if start > end:
            msg = "start date cannot come after the end date"
            raise ValueError(msg)

        returns_df = self._returns.get_returns(start, end)
        return {
            str(ticker): [
                SingleReturn(date=ts.date(), return_=r)
                for ts, r in col.dropna().items()
            ]
            for ticker, col in returns_df.items()
        }
