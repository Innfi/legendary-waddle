from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class WorkoutRecordPayload(BaseModel):
    workout_set: int
    workout_reps: int
    weight: int

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class BulkWorkoutItemV2(BaseModel):
    name: str
    memo: str | None = ""
    records: list[WorkoutRecordPayload]

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class BulkWorkoutPayloadV2(BaseModel):
    date_key: str
    workouts: list[BulkWorkoutItemV2]

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
