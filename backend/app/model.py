from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class SingleReturn(BaseModel):
    model_config = ConfigDict(frozen=True)

    date: date
    return_: float = Field(
        serialization_alias="return",
        description="Decimal format return so 1 percent is 0.01",
    )


ReturnsResponse = dict[str, list[SingleReturn]]
