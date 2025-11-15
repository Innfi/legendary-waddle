
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class FavoriteWorkout(BaseModel):
    name: str
    icon: str


class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: str | None = None
    favorite_workouts: list[FavoriteWorkout]
    goal: str

    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )
