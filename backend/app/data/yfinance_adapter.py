from datetime import date, timedelta
from typing import Literal

import pandas as pd
import yfinance as yf


class YFinanceAdapter:
    """The interface for yfinance data which can serve as a ReturnsSource."""

    def __init__(self, *, lookback: timedelta) -> None:
        self._lookback = lookback

    def get_returns_by_tickers(
        self, start: date, end: date, tickers: list[str]
    ) -> pd.DataFrame:
        """Uses yfinance close price data to calculate daily returns.

        start and end are both inclusive.
        """
        lookback_start = start - self._lookback
        daily_prices = self.get_prices(lookback_start, end, tickers=tickers)
        daily_returns = daily_prices.pct_change()
        return daily_returns.loc[str(start) :]

    def get_prices(
        self,
        start: date,
        end: date,
        *,
        tickers: list[str] | None = None,
        metric: Literal["Close"] = "Close",
    ) -> pd.DataFrame:
        """Get price data from yfinance."""
        if not tickers:
            msg = "tickers must be set to a non-empty list of strings."
            raise ValueError(msg)
        if metric.casefold() != "close":
            msg = "Only Close price is supported for now."
            raise NotImplementedError(msg)

        yf_end = end + timedelta(days=1)  # since yfinance end date is exclusive
        try:
            prices = yf.download(tickers, start, yf_end, auto_adjust=True)
        except Exception as e:
            msg = "The yfinance download call failed."
            raise RuntimeError(msg) from e

        if prices is None:
            msg = f"No price data from {start} to {end} for {tickers}"
            raise RuntimeError(msg)
        if "Close" not in prices.columns:
            msg = "Cannot find close price column in the yfinance dataframe result"
            raise RuntimeError(msg)
        return pd.DataFrame(prices["Close"])
