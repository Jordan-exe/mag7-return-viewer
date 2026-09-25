import datetime as dt
from typing import Annotated

from fastapi import FastAPI, Query

from app.config import Settings
from app.model import ReturnsResponse
from app.service import ReturnsService


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    app = FastAPI(title="MAG7 Returns API")
    app.state.svc = ReturnsService()

    @app.get("/returns", response_model=ReturnsResponse, operation_id="getReturns")
    def get_returns(
        start: Annotated[dt.date, Query(description="Inclusive start YYYY-MM-DD")],
        end: Annotated[dt.date, Query(description="Inclusive end YYYY-MM-DD")],
    ) -> ReturnsResponse:
        return app.state.svc.fetch(start, end, tickers=settings.tickers)

    return app
