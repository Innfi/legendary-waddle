from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class WorkoutPayload(BaseModel):
    id: int
    date_key: str
    name: str
    memo: str | None

    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )


class WorkoutRecordPayload(BaseModel):
    workout_set: int
    workout_reps: int
    weight: int

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class WorkoutItemV2(BaseModel):
    date_key: str
    name: str
    memo: str | None = ""
    records: list[WorkoutRecordPayload]

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class CreateWorkoutRequest(BaseModel):
    workouts: list[WorkoutItemV2]

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class GetWorkoutDetailResponse(BaseModel):
    id: int
    date_key: str
    name: str
    memo: str | None
    records: list[WorkoutRecordPayload]

    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )
