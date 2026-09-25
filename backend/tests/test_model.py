from datetime import date

from app.model import SingleReturn


def test_single_return_serializes_return_alias() -> None:
    r = SingleReturn(date=date(2024, 1, 2), return_=0.01)

    assert r.model_dump(mode="json", by_alias=True) == {
        "date": "2024-01-02",
        "return": 0.01,
    }
