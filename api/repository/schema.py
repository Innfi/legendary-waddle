from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime
from typing import List, Optional

class CreateRecordPayload(BaseModel):
    workout_index: int
    workout_name: str
    workout_set: int
    workout_reps: int
    weight: int
    date_key: str

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class WorkoutRecordItem(BaseModel):
    workout_name: str
    workout_set: int
    workout_reps: int
    weight: int
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

class ScheduleDetailBase(BaseModel):
    workout_name: str
    sets: int
    reps: int

class ScheduleDetailCreate(ScheduleDetailBase):
    pass

class ScheduleDetail(ScheduleDetailBase):
    id: int
    schedule_id: int

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel, 
        populate_by_name=True
    )

class ScheduleBase(BaseModel):
    planned_date: datetime

class ScheduleCreate(ScheduleBase):
    details: List[ScheduleDetailCreate]

class Schedule(ScheduleBase):
    id: int
    owner_id: str
    details: List[ScheduleDetail] = []

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel, 
        populate_by_name=True
    )
