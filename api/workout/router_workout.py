from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import Column
import structlog
from fastapi import APIRouter, Depends, Query, status, BackgroundTasks
from sqlalchemy.orm import Session

from auth.current_user import get_current_user
from common.database import get_db
from migration.wokout_migration_handler import migrate_workouts
from user.model import User
from workout.dto import (
    BulkWorkoutPayload,
    CreateRecordPayload,
    UpdateWorkoutMemoPayload,
    WorkoutPayload,
    WorkoutRecordItem,
    WorkoutWithRecords,
)
from workout.model import Record
from workout.repository_workout import (
    bulk_create_workouts_with_records,
    create_record,
    create_workout_if_not_exists,
    find_records_by_workout_id,
    find_records_by_workout_ids,
    find_workouts,
    find_workouts_by_datekeys,
    find_workouts_by_name_and_date,
    update_workout_memo,
)

router_workout = APIRouter()
router_record = APIRouter()

log = structlog.get_logger()


@router_workout.get("/workouts", response_model=list[WorkoutPayload])
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
):
    if from_date is None or to_date is None:
        today = datetime.now(UTC)
        one_month_ago = today - timedelta(days=30)
        from_date = one_month_ago.strftime("%y%m%d")  # Fixed format: removed extra 'y'
        to_date = today.strftime("%y%m%d")  # Fixed format: removed extra 'y'

    workouts = find_workouts_by_datekeys(db, current_user.id, from_date, to_date)
    if workouts is None:
        return []

    return workouts


@router_workout.post("/workouts/bulk", status_code=status.HTTP_201_CREATED)
def post_workouts_bulk(
    payload: BulkWorkoutPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bulk create workouts with records for a specific date."""
    log.info(
        "Bulk creating workouts",
        user_id=current_user.id,
        date_key=payload.date_key,
        workout_count=len(payload.workouts),
    )

    # Convert Pydantic models to dicts for repository
    workouts_data = [
        {
            "name": workout.name,
            "memo": workout.memo,
            "records": [
                {"sets": record.sets, "reps": record.reps, "weight": record.weight}
                for record in workout.records
            ],
        }
        for workout in payload.workouts
    ]

    # Bulk create workouts and records
    created_workouts = bulk_create_workouts_with_records(
        db, current_user.id, payload.date_key, workouts_data
    )

    return {"created_count": len(created_workouts), "workouts": created_workouts}


@router_workout.get("/workout-detail", response_model=list[WorkoutWithRecords])
def get_workout_detail(
    background_tasks: BackgroundTasks,
    date_key: str = Query(
        ..., regex=r"^\d{6}$", description="Date in yymmdd format (e.g., 251008)"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get detailed workout information with records for a specific date."""
    log.info(
        "Fetching workout detail for user", user_id=current_user.id, date_key=date_key
    )

    background_tasks.add_task(migrate_workouts, date_key, current_user.id)

    return fetch_workout_detail(date_key, db, current_user.id)

def fetch_workout_detail(
    date_key: str,
    db: Session,
    user_id: Column[UUID],
) -> list[WorkoutWithRecords]:
    # Get all workouts for the specific date
    workouts = find_workouts(db, user_id, date_key)

    if not workouts:
        return []

    # Get workout IDs
    workout_ids = [workout.id for workout in workouts]

    # Get all records for these workouts
    records = find_records_by_workout_ids(db, workout_ids)

    # Group records by workout_id
    records_by_workout = {}
    for record in records:
        if record.workout_id not in records_by_workout:
            records_by_workout[record.workout_id] = []
        records_by_workout[record.workout_id].append(record)

    # Combine workouts with their records
    result: list[WorkoutWithRecords] = []
    for workout in workouts:
        # Create a dict to match the WorkoutWithRecords structure
        workout_data = WorkoutWithRecords(
            workout_id=workout.id,
            date_key=workout.date_key,
            name=workout.name,
            memo=workout.memo,
            records=records_by_workout.get(workout.id, []),
        )

        result.append(workout_data)

    return result


@router_workout.patch("/workout/{workout_id}", response_model=WorkoutWithRecords)
def patch_workout_memo(
    workout_id: int,
    payload: UpdateWorkoutMemoPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the memo field of a specific workout."""
    log.info("Updating workout memo", workout_id=workout_id, user_id=current_user.id)

    updated_workout = update_workout_memo(db, workout_id, current_user.id, payload.memo)

    if not updated_workout:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404, detail="Workout not found or access denied"
        )

    return updated_workout


@router_record.post("/records", status_code=status.HTTP_201_CREATED)
def post_record(
    payload: CreateRecordPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Creates a new record with automatic workout creation if needed."""

    # 1. Generate date_key field by "yymmdd" of today
    today = datetime.now(UTC)
    date_key = today.strftime("%y%m%d")

    # 2. Try to find workout by current_user.id, date_key, and payload.workout_name
    # 3. If there is no workout, create one using the repository method
    workout = create_workout_if_not_exists(
        db, current_user.id, date_key, payload.workout_name
    )

    new_record = Record(
        workout_id=workout.id,
        workout_set=payload.workout_set,
        workout_reps=payload.workout_reps,
        weight=payload.weight,
        workout_date=today,
    )

    # Create the record
    create_record(db, new_record=new_record)

    return


@router_record.get("/records", response_model=list[WorkoutRecordItem])
def get_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    date_key: str | None = Query(None),
    workout_name: str | None = Query(None),
):
    if workout_name is None:
        return {"error": "Workout name is required"}, status.HTTP_404_NOT_FOUND
    if date_key is None:
        today = datetime.now(UTC)
        date_key = today.strftime("%y%m%d")

    workout = find_workouts_by_name_and_date(
        db, current_user.id, date_key, workout_name
    )

    return find_records_by_workout_id(db, workout_id=workout.id) if workout else []


@router_record.get("/records/list", response_model=list[WorkoutRecordItem])
def get_records_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
):
    if from_date is None or to_date is None:
        today = datetime.now(UTC)
        one_month_ago = today - timedelta(days=30)
        from_date = one_month_ago.strftime("%yy%m%d")
        to_date = today.strftime("%yy%m%d")

    return find_workouts_by_datekeys(db, current_user.id, from_date, to_date)
