from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime

class CreateRecordPayload(BaseModel):
    workout_name: str
    workout_set: int
    workout_reps: int

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class WorkoutRecordItem(BaseModel):
    workout_name: str
    workout_set: int
    workout_reps: int
    workout_date: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
