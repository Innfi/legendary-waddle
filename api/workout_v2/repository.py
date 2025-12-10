from uuid import UUID

from pydantic import BaseModel
import structlog
from sqlalchemy import Column
from sqlalchemy.orm import Session

from workout.model import WorkoutV2
from workout_v2.dto import CreateWorkoutRequest, WorkoutItemV2

log = structlog.get_logger()


def find_workouts_by_datekeys(
    db: Session, owner_id: Column[UUID], from_date: str, to_date: str
):
    """Fetches workouts for a user within a specified date range."""
    log.info(
        "Fetching workouts for user in date range",
        user_id=owner_id,
        from_date=from_date,
        to_date=to_date,
    )
    return (
        db.query(WorkoutV2)
        .filter(
            WorkoutV2.owner_id == owner_id,
            WorkoutV2.date_key >= from_date,
            WorkoutV2.date_key <= to_date,
        )
        .order_by(WorkoutV2.date_key)
        .all()
    )


def update_workout_memo(
    db: Session, workout_id: int, owner_id: Column[UUID], memo: str | None
):
    """Updates the memo field of a workout for a specific user."""
    log.info("Updating workout memo", workout_id=workout_id, user_id=owner_id)
    workout = (
        db.query(WorkoutV2)
        .filter(WorkoutV2.id == workout_id, WorkoutV2.owner_id == owner_id)
        .first()
    )

    if workout:
        workout.memo = memo # type: ignore
        db.commit()
        db.refresh(workout)
        return workout

    return None


def bulk_create_workouts_v2(
    db: Session, owner_id: Column[UUID], workouts_data: list[WorkoutItemV2]
):
    """Bulk creates WorkoutV2 records with embedded JSONB records in a single transaction."""
    log.info(
        "Bulk creating workouts v2",
        user_id=owner_id,
        workout_count=len(workouts_data),
    )

    created_workouts = []

    for workout_data in workouts_data:
        # Create WorkoutV2 with records embedded as JSONB
        # Ensure records are plain Python structures (list[dict]) so SQLAlchemy/psycopg
        # can serialize to JSONB. Pydantic models and ORM objects are not directly
        # JSON serializable by psycopg2.
        records_payload = []
        for r in workout_data.records:
            if isinstance(r, BaseModel):
                records_payload.append(r.model_dump())
            else:
                # assume it's already a dict-like or simple dataclass/obj
                try:
                    # common case: dict-like
                    records_payload.append(dict(r))
                except Exception:
                    # fallback: take attributes
                    records_payload.append(
                        {
                            "workout_set": getattr(r, "workout_set", None),
                            "workout_reps": getattr(r, "workout_reps", None),
                            "weight": getattr(r, "weight", None),
                        }
                    )

        # Create WorkoutV2 with records embedded as JSONB
        workout_v2 = WorkoutV2(
            owner_id=owner_id,
            date_key=workout_data.date_key,
            name=workout_data.name,
            memo=workout_data.memo or "",
            records=records_payload,  # Store records as JSONB
        )
        log.info("new record", workout_v2=workout_v2)
        # db.add(workout_v2)
        created_workouts.append(workout_v2)

    # Commit all changes at once
    # db.commit()

    # Refresh all workouts
    for workout in created_workouts:
        db.refresh(workout)

    log.info(
        "Successfully created workouts v2",
        workout_count=len(created_workouts),
    )

    return created_workouts
