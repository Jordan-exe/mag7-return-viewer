import datetime as dt
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query

from app.config import Settings
from app.data import ReturnsStore, YFinanceAdapter
from app.model import ReturnsResponse
from app.service import ReturnsService


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    app = FastAPI(title="MAG7 Returns API")
    yf = YFinanceAdapter(lookback=settings.prices_lookback)
    returns_store = ReturnsStore(
        yf,
        settings.tickers,
        mutable_window_size=settings.mutable_window,
        mutable_window_ttl=settings.mutable_ttl,
    )
    app.state.svc = ReturnsService(returns_store)

    @app.get("/returns", response_model=ReturnsResponse, operation_id="getReturns")
    def get_returns(
        start: Annotated[dt.date, Query(description="Inclusive start YYYY-MM-DD")],
        end: Annotated[dt.date, Query(description="Inclusive end YYYY-MM-DD")],
    ) -> ReturnsResponse:
        try:
            return app.state.svc.fetch(start, end)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e
        except RuntimeError as e:
            raise HTTPException(
                status_code=502, detail="Upstream failed:  " + str(e)
            ) from e

    return app
