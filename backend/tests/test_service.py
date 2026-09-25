from datetime import date

import pandas as pd

from app.model import SingleReturn
from app.service import ReturnsService


class FakeStore:
    def get_returns(self, start: date, end: date) -> pd.DataFrame:
        return pd.DataFrame(
            {"MSFT": [0.01, 0.02]},
            index=pd.DatetimeIndex(["2024-01-02", "2024-01-03"]),
        )


def test_fetch_converts_dataframe_to_response() -> None:
    svc = ReturnsService(FakeStore())

    result = svc.fetch(date(2024, 1, 2), date(2024, 1, 3))

    assert result == {
        "MSFT": [
            SingleReturn(date=date(2024, 1, 2), return_=0.01),
            SingleReturn(date=date(2024, 1, 3), return_=0.02),
        ]
    }
