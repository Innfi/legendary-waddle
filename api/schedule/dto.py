from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime
from typing import List

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
