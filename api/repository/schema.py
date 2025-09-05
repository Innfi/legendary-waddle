from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime
from typing import List, Optional

class CreateRecordPayload(BaseModel):
    workout_name: str
    workout_reps: int
    date_key: str

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class WorkoutRecordItem(BaseModel):
    workout_name: str
    workout_reps: int
    workout_date: datetime
    date_key: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class FavoriteWorkout(BaseModel):
    name: str
    icon: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    favorite_workouts: List[FavoriteWorkout]
    goal: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
