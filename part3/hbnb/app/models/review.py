from __future__ import annotations

from typing import Any

from hbnb.app.models.base_model import BaseModel
from hbnb.app import db


class Review(BaseModel):
    """
    Review entity:
    - text   (required)
    - rating (int 1..5)
    Note: Relationships (user, place) will be added in a later task
    """
    __tablename__ = 'reviews'

    text = db.Column(db.String(1000), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    def __init__(
        self,
        text: str,
        rating: int,
        **kwargs: Any,
    ):
        super().__init__(**kwargs)
        self.text = text
        self.rating = rating

        self.validate()

    def validate(self) -> None:
        if not isinstance(self.text, str) or not self.text.strip():
            raise ValueError("text is required")

        if not isinstance(self.rating, int):
            raise ValueError("rating must be an integer")
        if not (1 <= self.rating <= 5):
            raise ValueError("rating must be between 1 and 5")