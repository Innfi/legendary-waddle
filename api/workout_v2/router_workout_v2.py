from datetime import UTC, datetime, timedelta

import structlog
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from auth.current_user import get_current_user
from common.database import get_db
from user.model import User
from workout_v2.repository import (
    find_workouts_by_datekeys,
    update_workout_memo,
    bulk_create_workouts_v2,
)
from workout_v2.dto import CreateWorkoutRequest, GetWorkoutDetailResponse, WorkoutPayload

router_workout = APIRouter()
router_record = APIRouter()

log = structlog.get_logger()


@router_workout.get("/v2/workouts", response_model=list[WorkoutPayload])
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


@router_workout.get(
    "/v2/workout/{date_key}", response_model=list[GetWorkoutDetailResponse]
)
def get_workout_detail_by_date_key(
    date_key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch detailed workout information for a specific date key."""
    log.info(
        "Fetching workout details by date key",
        user_id=current_user.id,
        date_key=date_key,
    )

    workouts = find_workouts_by_datekeys(db, current_user.id, date_key, date_key)
    if not workouts:
        return []

    return workouts


@router_workout.post("/v2/workouts/bulk", status_code=status.HTTP_201_CREATED)
def post_workouts_v2_bulk(
    payload: CreateWorkoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bulk create workouts v2 with records embedded as JSONB"""
    log.info(
        "Bulk creating workouts v2",
        user_id=current_user.id,
        workout_count=len(payload.workouts),
    )

    # Bulk create workouts v2 with embedded records
    created_workouts = bulk_create_workouts_v2(db, current_user.id, payload.workouts)

    return {"created_count": len(created_workouts), "workouts": created_workouts}


@router_workout.patch("/v2/workout/{workout_id}", response_model=WorkoutPayload)
def patch_workout_memo(
    workout_id: int,
    payload: WorkoutPayload,
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
