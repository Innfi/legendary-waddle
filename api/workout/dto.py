from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime
from typing import List, Optional

class CreateRecordPayload(BaseModel):
    workout_name: str
    workout_set: int
    workout_reps: int
    weight: int

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class WorkoutRecordItem(BaseModel):
    workout_id: int
    workout_set: int
    workout_reps: int
    weight: int
    workout_date: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class WorkoutRecordUnit(BaseModel):
    workout_id: int
    workout_set: int
    workout_reps: int
    weight: int
    workout_date: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class WorkoutWithRecords(BaseModel):
    workout_id: int
    date_key: str
    name: str
    memo: Optional[str]
    records: List[WorkoutRecordUnit] = []

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class WorkoutPayload(BaseModel):
    workout_id: int
    date_key: str
    name: str
    memo: Optional[str]

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class UpdateWorkoutMemoPayload(BaseModel):
    memo: Optional[str]

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
