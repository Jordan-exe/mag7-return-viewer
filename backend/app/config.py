from datetime import timedelta

from pydantic_settings import BaseSettings, SettingsConfigDict

MAG7 = ["MSFT", "AAPL", "GOOGL", "AMZN", "NVDA", "META", "TSLA"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MAG7_")

    tickers: list[str] = MAG7
    prices_lookback: timedelta = timedelta(days=10)

    # Timeframe for which the underlying data is considered to be mutable
    mutable_window: timedelta = timedelta(days=10)

    # TTL to re-fetch the underlying data inside the mutable_window
    mutable_ttl: timedelta = timedelta(minutes=15)
