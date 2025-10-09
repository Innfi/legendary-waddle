from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
import structlog
from datetime import datetime, timedelta, timezone

from auth.current_user import get_current_user
from common.database import get_db
from user.model import User
from workout.dto import WorkoutRecordItem, CreateRecordPayload
from workout.repository_workout import find_many_by_date_keys, create_workout_if_not_exists
from workout.repository_record import find_many, create_one

router_record = APIRouter()
log = structlog.get_logger()
    
@router_record.post("/records", status_code=status.HTTP_201_CREATED)
def create_record(payload: CreateRecordPayload, 
                  db: Session = Depends(get_db), 
                  current_user: User = Depends(get_current_user)):
    """Creates a new record with automatic workout creation if needed."""
    
    # 1. Generate date_key field by "yymmdd" of today
    today = datetime.now(timezone.utc)
    date_key = today.strftime("%y%m%d")
    
    # 2. Try to find workout by current_user.id, date_key, and payload.workout_name
    # 3. If there is no workout, create one using the repository method
    workout = create_workout_if_not_exists(
        db, 
        current_user.id, 
        date_key, 
        payload.workout_name
    )
    
    # Create a new payload with the workout_id and date_key
    updated_payload = CreateRecordPayload(
        workout_name=payload.workout_name,
        workout_set=payload.workout_set,
        workout_reps=payload.workout_reps,
        weight=payload.weight,
        date_key=date_key,
        workout_id=workout.id
    )
    
    # Create the record
    create_one(db, updated_payload, current_user.id)
    
    return
@router_record.get("/records", response_model=list[WorkoutRecordItem])
def get_records(db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user), 
                date_key: str | None = Query(None),
                workout_name: str | None = Query(None)):
    return find_many(db, current_user.id, date_key, workout_name)

@router_record.get("/records/list", response_model=list[WorkoutRecordItem])
def get_records_list(db: Session = Depends(get_db),
                     current_user: User = Depends(get_current_user),
                     from_date: str | None = Query(None),
                     to_date: str | None = Query(None)):
    if from_date is None or to_date is None:
        today = datetime.now(timezone.utc)
        one_month_ago = today - timedelta(days=30)
        from_date = one_month_ago.strftime("%yy%m%d")
        to_date = today.strftime("%yy%m%d")
        
    return find_many_by_date_keys(db, current_user.id, from_date, to_date)
