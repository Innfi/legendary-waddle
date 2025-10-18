from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
import structlog
from datetime import datetime, timedelta, timezone

from auth.current_user import get_current_user
from common.database import get_db
from user.model import User
from workout.dto import WorkoutWithRecords, UpdateWorkoutMemoPayload, WorkoutPayload
from workout.repository_workout import find_many_by_date_keys, find_many as find_workouts, update_memo
from workout.repository_record import find_many_by_workout_ids

router_workout = APIRouter()
log = structlog.get_logger()

@router_workout.get('/workouts', response_model=list[WorkoutPayload])
def get_workouts(db: Session = Depends(get_db), 
                 current_user: User = Depends(get_current_user), 
                 from_date: str | None = Query(None),
                 to_date: str | None = Query(None)):
    if from_date is None or to_date is None:
        today = datetime.now(timezone.utc)
        one_month_ago = today - timedelta(days=30)
        from_date = one_month_ago.strftime("%y%m%d")  # Fixed format: removed extra 'y'
        to_date = today.strftime("%y%m%d")  # Fixed format: removed extra 'y'

    workouts = find_many_by_date_keys(db, current_user.id, from_date, to_date)
    if workouts is None:
        return []
    
    return workouts 
    
@router_workout.get("/workout-detail", response_model=list[WorkoutWithRecords])
def get_workout_detail(date_key: str = Query(..., regex=r"^\d{6}$", description="Date in yymmdd format (e.g., 251008)"),
                       db: Session = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    """Get detailed workout information with records for a specific date."""
    log.info("Fetching workout detail for user", user_id=current_user.id, date_key=date_key)
    
    # Get all workouts for the specific date
    workouts = find_workouts(db, current_user.id, date_key)
    
    if not workouts:
        return []
    
    # Get workout IDs
    workout_ids = [workout.id for workout in workouts]
    
    # Get all records for these workouts
    records = find_many_by_workout_ids(db, workout_ids)
    
    # Group records by workout_id
    records_by_workout = {}
    for record in records:
        if record.workout_id not in records_by_workout:
            records_by_workout[record.workout_id] = []
        records_by_workout[record.workout_id].append(record)
    
    # Combine workouts with their records
    result = []
    for workout in workouts:
        # Create a dict to match the WorkoutWithRecords structure
        workout_data = {
            'workout_id': workout.id,
            'date_key': workout.date_key,
            'name': workout.name,
            'memo': workout.memo,
            'records': records_by_workout.get(workout.id, [])
        }
        result.append(workout_data)
    
    return result

@router_workout.patch("/workout/{workout_id}", response_model=WorkoutWithRecords)
def update_workout_memo(workout_id: int,
                        payload: UpdateWorkoutMemoPayload,
                        db: Session = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    """Update the memo field of a specific workout."""
    log.info("Updating workout memo", workout_id=workout_id, user_id=current_user.id)
    
    updated_workout = update_memo(db, workout_id, current_user.id, payload.memo)
    
    if not updated_workout:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Workout not found or access denied")
    
    return updated_workout